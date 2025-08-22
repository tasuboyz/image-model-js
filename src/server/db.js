/**
 * Database Helper - SQLite database operations for preset persistence
 * Handles all database operations for storing and retrieving presets
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Database {
    constructor(dbPath = null) {
        this.dbPath = dbPath || path.join(__dirname, '../../prompts.db');
        this.db = null;
    }

    /**
     * Initialize database connection and create tables
     */
    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                    return;
                }
                
                console.log(`📁 Connected to SQLite database: ${this.dbPath}`);
                this.createTables()
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    /**
     * Create database tables if they don't exist
     */
    async createTables() {
        const createPresetsTable = `
            CREATE TABLE IF NOT EXISTS presets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT DEFAULT 'outfit',
                data TEXT NOT NULL,
                tags TEXT DEFAULT '[]',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createIndexes = [
            'CREATE INDEX IF NOT EXISTS idx_presets_category ON presets(category)',
            'CREATE INDEX IF NOT EXISTS idx_presets_created_at ON presets(created_at)',
            'CREATE INDEX IF NOT EXISTS idx_presets_name ON presets(name)'
        ];

        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(createPresetsTable, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                });

                // Create indexes
                createIndexes.forEach(indexSql => {
                    this.db.run(indexSql, (err) => {
                        if (err) {
                            console.warn('Index creation warning:', err.message);
                        }
                    });
                });

                resolve();
            });
        });
    }

    /**
     * Create a new preset
     */
    async createPreset(preset) {
        const { name, category = 'outfit', data, tags = [] } = preset;
        
        const sql = `
            INSERT INTO presets (name, category, data, tags)
            VALUES (?, ?, ?, ?)
        `;
        
        const params = [
            name,
            category,
            JSON.stringify(data),
            JSON.stringify(tags)
        ];

        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.lastID);
            });
        });
    }

    /**
     * Get a preset by ID
     */
    async getPreset(id) {
        const sql = 'SELECT * FROM presets WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!row) {
                    resolve(null);
                    return;
                }
                
                resolve(this._parsePresetRow(row));
            });
        });
    }

    /**
     * Get all presets with optional filtering
     */
    async getPresets(filters = {}) {
        let sql = 'SELECT * FROM presets WHERE 1=1';
        const params = [];

        // Add category filter
        if (filters.category) {
            sql += ' AND category = ?';
            params.push(filters.category);
        }

        // Add search filter
        if (filters.search) {
            sql += ' AND (name LIKE ? OR tags LIKE ?)';
            const searchPattern = `%${filters.search}%`;
            params.push(searchPattern, searchPattern);
        }

        // Add tag filter
        if (filters.tags && Array.isArray(filters.tags)) {
            const tagConditions = filters.tags.map(() => 'tags LIKE ?').join(' OR ');
            sql += ` AND (${tagConditions})`;
            filters.tags.forEach(tag => {
                params.push(`%"${tag}"%`);
            });
        }

        // Add ordering
        sql += ' ORDER BY created_at DESC';

        // Add pagination
        if (filters.limit) {
            sql += ' LIMIT ?';
            params.push(filters.limit);
            
            if (filters.offset) {
                sql += ' OFFSET ?';
                params.push(filters.offset);
            }
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const presets = rows.map(row => this._parsePresetRow(row));
                resolve(presets);
            });
        });
    }

    /**
     * Update a preset
     */
    async updatePreset(id, preset) {
        const { name, category, data, tags } = preset;
        
        const sql = `
            UPDATE presets 
            SET name = ?, category = ?, data = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        const params = [
            name,
            category,
            JSON.stringify(data),
            JSON.stringify(tags),
            id
        ];

        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes > 0);
            });
        });
    }

    /**
     * Delete a preset
     */
    async deletePreset(id) {
        const sql = 'DELETE FROM presets WHERE id = ?';
        
        return new Promise((resolve, reject) => {
            this.db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(this.changes > 0);
            });
        });
    }

    /**
     * Get all categories
     */
    async getCategories() {
        const sql = 'SELECT DISTINCT category FROM presets ORDER BY category';
        
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const categories = rows.map(row => row.category);
                resolve(categories);
            });
        });
    }

    /**
     * Get all tags
     */
    async getTags() {
        const sql = 'SELECT tags FROM presets WHERE tags != "[]"';
        
        return new Promise((resolve, reject) => {
            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const tagSet = new Set();
                
                rows.forEach(row => {
                    try {
                        const tags = JSON.parse(row.tags);
                        if (Array.isArray(tags)) {
                            tags.forEach(tag => tagSet.add(tag));
                        }
                    } catch (e) {
                        // Ignore malformed JSON
                    }
                });
                
                const tags = Array.from(tagSet).sort();
                resolve(tags);
            });
        });
    }

    /**
     * Get database statistics
     */
    async getStats() {
        const queries = {
            totalPresets: 'SELECT COUNT(*) as count FROM presets',
            categories: 'SELECT category, COUNT(*) as count FROM presets GROUP BY category',
            recentPresets: 'SELECT COUNT(*) as count FROM presets WHERE created_at > datetime("now", "-7 days")'
        };

        const results = {};

        for (const [key, sql] of Object.entries(queries)) {
            try {
                const result = await new Promise((resolve, reject) => {
                    if (key === 'categories') {
                        this.db.all(sql, [], (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        });
                    } else {
                        this.db.get(sql, [], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    }
                });
                
                results[key] = result;
            } catch (error) {
                console.error(`Error getting ${key}:`, error);
                results[key] = key === 'categories' ? [] : { count: 0 };
            }
        }

        return results;
    }

    /**
     * Search presets with full-text search capabilities
     */
    async searchPresets(query, options = {}) {
        const {
            category,
            limit = 50,
            offset = 0,
            sortBy = 'relevance' // 'relevance', 'date', 'name'
        } = options;

        let sql = `
            SELECT *, 
                   (CASE 
                    WHEN name LIKE ? THEN 3
                    WHEN data LIKE ? THEN 2
                    WHEN tags LIKE ? THEN 1
                    ELSE 0
                   END) as relevance_score
            FROM presets 
            WHERE (name LIKE ? OR data LIKE ? OR tags LIKE ?)
        `;
        
        const searchPattern = `%${query}%`;
        const params = [
            searchPattern, searchPattern, searchPattern,
            searchPattern, searchPattern, searchPattern
        ];

        if (category) {
            sql += ' AND category = ?';
            params.push(category);
        }

        // Add sorting
        switch (sortBy) {
            case 'relevance':
                sql += ' ORDER BY relevance_score DESC, created_at DESC';
                break;
            case 'date':
                sql += ' ORDER BY created_at DESC';
                break;
            case 'name':
                sql += ' ORDER BY name ASC';
                break;
            default:
                sql += ' ORDER BY created_at DESC';
        }

        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const presets = rows.map(row => this._parsePresetRow(row));
                resolve(presets);
            });
        });
    }

    /**
     * Backup database to JSON
     */
    async backup() {
        const presets = await this.getPresets();
        const stats = await this.getStats();
        
        return {
            version: '1.0',
            created: new Date().toISOString(),
            stats,
            presets
        };
    }

    /**
     * Parse database row to preset object
     * @private
     */
    _parsePresetRow(row) {
        try {
            return {
                id: row.id,
                name: row.name,
                category: row.category,
                data: JSON.parse(row.data),
                tags: JSON.parse(row.tags),
                created_at: row.created_at,
                updated_at: row.updated_at
            };
        } catch (error) {
            console.error('Error parsing preset row:', error);
            return {
                id: row.id,
                name: row.name,
                category: row.category,
                data: {},
                tags: [],
                created_at: row.created_at,
                updated_at: row.updated_at,
                error: 'Parse error'
            };
        }
    }

    /**
     * Close database connection
     */
    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }

    /**
     * Execute raw SQL (for debugging/maintenance)
     */
    async executeQuery(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }
}

export default Database;
