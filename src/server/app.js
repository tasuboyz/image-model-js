/**
 * Express.js Server - Backend API for preset management
 * Serves static files and provides REST API endpoints for presets
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
    constructor(options = {}) {
        this.options = {
            port: process.env.PORT || 3000,
            host: process.env.HOST || 'localhost',
            ...options
        };
        
        this.app = express();
        this.db = new Database();
        
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    /**
     * Set up Express middleware
     */
    setupMiddleware() {
        // CORS configuration
        this.app.use(cors({
            origin: true,
            credentials: true
        }));

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });

        // Static file serving
        const staticPath = path.join(__dirname, '../../');
        this.app.use(express.static(staticPath));
    }

    /**
     * Set up API routes
     */
    setupRoutes() {
        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });

        // Preset CRUD operations
        this.setupPresetRoutes();
        
        // Category and tag routes
        this.setupMetadataRoutes();
        
        // Batch operations
        this.setupBatchRoutes();
        
        // Import/Export routes
        this.setupImportExportRoutes();

        // Serve index.html for all non-API routes
        this.app.get('*', (req, res) => {
            if (!req.path.startsWith('/api')) {
                res.sendFile(path.join(__dirname, '../../index.html'));
            } else {
                res.status(404).json({ error: 'API endpoint not found' });
            }
        });
    }

    /**
     * Set up preset CRUD routes
     */
    setupPresetRoutes() {
        // Get all presets
        this.app.get('/api/presets', async (req, res) => {
            try {
                const { category, tags, search, limit, offset } = req.query;
                
                const filters = {};
                if (category) filters.category = category;
                if (tags) filters.tags = tags.split(',');
                if (search) filters.search = search;
                if (limit) filters.limit = parseInt(limit, 10);
                if (offset) filters.offset = parseInt(offset, 10);

                const presets = await this.db.getPresets(filters);
                res.json(presets);
            } catch (error) {
                console.error('Error getting presets:', error);
                res.status(500).json({ error: 'Failed to retrieve presets' });
            }
        });

        // Get single preset
        this.app.get('/api/presets/:id', async (req, res) => {
            try {
                const preset = await this.db.getPreset(req.params.id);
                
                if (!preset) {
                    return res.status(404).json({ error: 'Preset not found' });
                }
                
                res.json(preset);
            } catch (error) {
                console.error('Error getting preset:', error);
                res.status(500).json({ error: 'Failed to retrieve preset' });
            }
        });

        // Create new preset
        this.app.post('/api/presets', async (req, res) => {
            try {
                const { name, category, data, tags } = req.body;
                
                if (!name || !data) {
                    return res.status(400).json({ 
                        error: 'Name and data are required' 
                    });
                }
                
                const preset = {
                    name: name.trim(),
                    category: category || 'outfit',
                    data,
                    tags: tags || []
                };
                
                const id = await this.db.createPreset(preset);
                res.status(201).json({ ok: true, id });
            } catch (error) {
                console.error('Error creating preset:', error);
                res.status(500).json({ error: 'Failed to create preset' });
            }
        });

        // Update preset
        this.app.put('/api/presets/:id', async (req, res) => {
            try {
                const { name, category, data, tags } = req.body;
                
                const preset = {
                    name: name.trim(),
                    category: category || 'outfit',
                    data,
                    tags: tags || []
                };
                
                const success = await this.db.updatePreset(req.params.id, preset);
                
                if (!success) {
                    return res.status(404).json({ error: 'Preset not found' });
                }
                
                res.json({ ok: true });
            } catch (error) {
                console.error('Error updating preset:', error);
                res.status(500).json({ error: 'Failed to update preset' });
            }
        });

        // Delete preset
        this.app.delete('/api/presets/:id', async (req, res) => {
            try {
                const success = await this.db.deletePreset(req.params.id);
                
                if (!success) {
                    return res.status(404).json({ error: 'Preset not found' });
                }
                
                res.json({ ok: true });
            } catch (error) {
                console.error('Error deleting preset:', error);
                res.status(500).json({ error: 'Failed to delete preset' });
            }
        });
    }

    /**
     * Set up metadata routes (categories, tags)
     */
    setupMetadataRoutes() {
        // Get categories
        this.app.get('/api/categories', async (req, res) => {
            try {
                const categories = await this.db.getCategories();
                res.json(categories);
            } catch (error) {
                console.error('Error getting categories:', error);
                res.status(500).json({ error: 'Failed to retrieve categories' });
            }
        });

        // Get tags
        this.app.get('/api/tags', async (req, res) => {
            try {
                const tags = await this.db.getTags();
                res.json(tags);
            } catch (error) {
                console.error('Error getting tags:', error);
                res.status(500).json({ error: 'Failed to retrieve tags' });
            }
        });
    }

    /**
     * Set up batch operation routes
     */
    setupBatchRoutes() {
        // Batch create presets
        this.app.post('/api/presets/batch', async (req, res) => {
            try {
                const { presets } = req.body;
                
                if (!Array.isArray(presets)) {
                    return res.status(400).json({ 
                        error: 'Presets must be an array' 
                    });
                }
                
                const results = [];
                
                for (const preset of presets) {
                    try {
                        const id = await this.db.createPreset(preset);
                        results.push({ success: true, id, name: preset.name });
                    } catch (error) {
                        results.push({ 
                            success: false, 
                            error: error.message, 
                            name: preset.name 
                        });
                    }
                }
                
                const successCount = results.filter(r => r.success).length;
                
                res.json({
                    success: successCount,
                    failed: results.length - successCount,
                    total: results.length,
                    results
                });
            } catch (error) {
                console.error('Error in batch create:', error);
                res.status(500).json({ error: 'Batch operation failed' });
            }
        });

        // Batch delete presets
        this.app.delete('/api/presets/batch', async (req, res) => {
            try {
                const { ids } = req.body;
                
                if (!Array.isArray(ids)) {
                    return res.status(400).json({ 
                        error: 'IDs must be an array' 
                    });
                }
                
                const results = [];
                
                for (const id of ids) {
                    try {
                        const success = await this.db.deletePreset(id);
                        results.push({ success, id });
                    } catch (error) {
                        results.push({ 
                            success: false, 
                            error: error.message, 
                            id 
                        });
                    }
                }
                
                const successCount = results.filter(r => r.success).length;
                
                res.json({
                    success: successCount,
                    failed: results.length - successCount,
                    total: results.length,
                    results
                });
            } catch (error) {
                console.error('Error in batch delete:', error);
                res.status(500).json({ error: 'Batch operation failed' });
            }
        });
    }

    /**
     * Set up import/export routes
     */
    setupImportExportRoutes() {
        // Export presets
        this.app.get('/api/export', async (req, res) => {
            try {
                const { format = 'json', category, ids } = req.query;
                
                let presets;
                
                if (ids) {
                    const idList = ids.split(',');
                    presets = await Promise.all(
                        idList.map(id => this.db.getPreset(id))
                    );
                    presets = presets.filter(Boolean);
                } else {
                    const filters = category ? { category } : {};
                    presets = await this.db.getPresets(filters);
                }
                
                const exportData = {
                    version: '1.0',
                    exported: new Date().toISOString(),
                    presets
                };
                
                if (format === 'json') {
                    res.setHeader('Content-Disposition', 
                        'attachment; filename="presets-export.json"');
                    res.setHeader('Content-Type', 'application/json');
                    res.json(exportData);
                } else {
                    res.status(400).json({ error: 'Unsupported format' });
                }
            } catch (error) {
                console.error('Error exporting presets:', error);
                res.status(500).json({ error: 'Export failed' });
            }
        });

        // Import presets
        this.app.post('/api/import', async (req, res) => {
            try {
                const { data: importData } = req.body;
                
                if (!importData) {
                    return res.status(400).json({ 
                        error: 'No import data provided' 
                    });
                }
                
                let parsedData;
                
                if (typeof importData === 'string') {
                    parsedData = JSON.parse(importData);
                } else {
                    parsedData = importData;
                }
                
                if (!parsedData.presets || !Array.isArray(parsedData.presets)) {
                    return res.status(400).json({ 
                        error: 'Invalid import format' 
                    });
                }
                
                const results = [];
                
                for (const preset of parsedData.presets) {
                    try {
                        const id = await this.db.createPreset(preset);
                        results.push({ success: true, id, name: preset.name });
                    } catch (error) {
                        results.push({ 
                            success: false, 
                            error: error.message, 
                            name: preset.name 
                        });
                    }
                }
                
                const successCount = results.filter(r => r.success).length;
                
                res.json({
                    success: successCount,
                    failed: results.length - successCount,
                    total: results.length,
                    results
                });
            } catch (error) {
                console.error('Error importing presets:', error);
                res.status(500).json({ error: 'Import failed' });
            }
        });
    }

    /**
     * Set up error handling
     */
    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({ error: 'Not found' });
        });

        // Global error handler
        this.app.use((error, req, res, next) => {
            console.error('Unhandled error:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
    }

    /**
     * Start the server
     */
    async start() {
        try {
            // Initialize database
            await this.db.init();
            
            // Start listening
            const server = this.app.listen(this.options.port, this.options.host, () => {
                console.log(`🚀 Server running at http://${this.options.host}:${this.options.port}`);
                console.log(`📁 Serving static files from: ${path.join(__dirname, '../../')}`);
                console.log(`💾 Database file: ${this.db.dbPath}`);
            });
            
            // Handle graceful shutdown
            process.on('SIGTERM', () => {
                console.log('SIGTERM received, shutting down gracefully');
                server.close(() => {
                    this.db.close();
                    process.exit(0);
                });
            });
            
            process.on('SIGINT', () => {
                console.log('SIGINT received, shutting down gracefully');
                server.close(() => {
                    this.db.close();
                    process.exit(0);
                });
            });
            
            return server;
        } catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    }
}

// Start server if this file is run directly
if (process.argv[1] && process.argv[1].endsWith('app.js')) {
    const server = new Server();
    server.start();
}

export default Server;
