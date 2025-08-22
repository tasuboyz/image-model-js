/**
 * Storage - LocalStorage wrapper with autosave functionality
 * Handles form data persistence and preset management
 */
export class Storage {
    constructor(options = {}) {
        this.options = {
            keyPrefix: 'aiPrompt_',
            autosaveKey: 'currentForm',
            autosaveDelay: 1000, // ms
            ...options
        };
        
        this.autosaveTimer = null;
        this.isSupported = this._checkSupport();
    }

    /**
     * Check if localStorage is supported
     * @private
     */
    _checkSupport() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not supported:', e);
            return false;
        }
    }

    /**
     * Get full key with prefix
     * @private
     */
    _getKey(key) {
        return `${this.options.keyPrefix}${key}`;
    }

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to save
     * @returns {boolean} Success status
     */
    save(key, data) {
        if (!this.isSupported) return false;

        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(this._getKey(key), serialized);
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    }

    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Loaded data or default value
     */
    load(key, defaultValue = null) {
        if (!this.isSupported) return defaultValue;

        try {
            const serialized = localStorage.getItem(this._getKey(key));
            if (serialized === null) return defaultValue;
            return JSON.parse(serialized);
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return defaultValue;
        }
    }

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        if (!this.isSupported) return false;

        try {
            localStorage.removeItem(this._getKey(key));
            return true;
        } catch (e) {
            console.error('Failed to remove from localStorage:', e);
            return false;
        }
    }

    /**
     * Get all keys with the prefix
     * @returns {Array<string>} Array of keys without prefix
     */
    getAllKeys() {
        if (!this.isSupported) return [];

        const keys = [];
        const prefix = this._getKey('');
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keys.push(key.substring(prefix.length));
            }
        }
        
        return keys;
    }

    /**
     * Clear all data with the prefix
     * @returns {boolean} Success status
     */
    clear() {
        if (!this.isSupported) return false;

        try {
            const keys = this.getAllKeys();
            keys.forEach(key => this.remove(key));
            return true;
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
            return false;
        }
    }

    /**
     * Save form data with autosave debouncing
     * @param {Object} formData - Form data to save
     */
    autosave(formData) {
        if (!this.isSupported) return;

        // Clear existing timer
        if (this.autosaveTimer) {
            clearTimeout(this.autosaveTimer);
        }

        // Set new timer
        this.autosaveTimer = setTimeout(() => {
            this.save(this.options.autosaveKey, {
                data: formData,
                timestamp: Date.now()
            });
            console.log('Form data autosaved');
        }, this.options.autosaveDelay);
    }

    /**
     * Load autosaved form data
     * @returns {Object|null} Autosaved form data or null
     */
    loadAutosaved() {
        const saved = this.load(this.options.autosaveKey);
        if (!saved || !saved.data) return null;

        // Check if autosave is recent (within 24 hours)
        const dayInMs = 24 * 60 * 60 * 1000;
        if (Date.now() - saved.timestamp > dayInMs) {
            this.remove(this.options.autosaveKey);
            return null;
        }

        return saved.data;
    }

    /**
     * Save a preset
     * @param {string} name - Preset name
     * @param {Object} data - Preset data
     * @param {Object} metadata - Additional metadata
     * @returns {string} Preset ID
     */
    savePreset(name, data, metadata = {}) {
        const presetId = `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const preset = {
            id: presetId,
            name,
            data,
            metadata: {
                created: Date.now(),
                ...metadata
            }
        };

        this.save(presetId, preset);
        
        // Update presets index
        const presets = this.loadPresets();
        presets.push({
            id: presetId,
            name,
            created: preset.metadata.created,
            category: metadata.category,
            tags: metadata.tags || []
        });
        this.save('presets_index', presets);

        return presetId;
    }

    /**
     * Load a preset by ID
     * @param {string} presetId - Preset ID
     * @returns {Object|null} Preset data or null
     */
    loadPreset(presetId) {
        return this.load(presetId);
    }

    /**
     * Load all presets metadata
     * @returns {Array} Array of preset metadata
     */
    loadPresets() {
        return this.load('presets_index', []);
    }

    /**
     * Delete a preset
     * @param {string} presetId - Preset ID
     * @returns {boolean} Success status
     */
    deletePreset(presetId) {
        // Remove preset data
        const success = this.remove(presetId);
        
        if (success) {
            // Update presets index
            const presets = this.loadPresets();
            const filtered = presets.filter(p => p.id !== presetId);
            this.save('presets_index', filtered);
        }
        
        return success;
    }

    /**
     * Search presets by name, category, or tags
     * @param {string} query - Search query
     * @param {string} category - Filter by category
     * @returns {Array} Filtered presets
     */
    searchPresets(query = '', category = '') {
        const presets = this.loadPresets();
        
        return presets.filter(preset => {
            const matchesQuery = !query || 
                preset.name.toLowerCase().includes(query.toLowerCase()) ||
                (preset.tags && preset.tags.some(tag => 
                    tag.toLowerCase().includes(query.toLowerCase())
                ));
                
            const matchesCategory = !category || preset.category === category;
            
            return matchesQuery && matchesCategory;
        });
    }

    /**
     * Export presets to JSON
     * @returns {string} JSON string of all presets
     */
    exportPresets() {
        const presets = this.loadPresets();
        const fullPresets = presets.map(meta => this.loadPreset(meta.id));
        
        return JSON.stringify({
            version: '1.0',
            exported: Date.now(),
            presets: fullPresets.filter(Boolean)
        }, null, 2);
    }

    /**
     * Import presets from JSON
     * @param {string} jsonData - JSON string of presets
     * @returns {Object} Import result with success count and errors
     */
    importPresets(jsonData) {
        try {
            const importData = JSON.parse(jsonData);
            const result = {
                success: 0,
                errors: [],
                total: 0
            };

            if (!importData.presets || !Array.isArray(importData.presets)) {
                result.errors.push('Invalid import format');
                return result;
            }

            result.total = importData.presets.length;

            importData.presets.forEach((preset, index) => {
                try {
                    if (!preset.name || !preset.data) {
                        result.errors.push(`Preset ${index + 1}: Missing name or data`);
                        return;
                    }

                    this.savePreset(
                        preset.name,
                        preset.data,
                        preset.metadata || {}
                    );
                    result.success++;
                } catch (e) {
                    result.errors.push(`Preset ${index + 1}: ${e.message}`);
                }
            });

            return result;
        } catch (e) {
            return {
                success: 0,
                errors: [`Failed to parse JSON: ${e.message}`],
                total: 0
            };
        }
    }

    /**
     * Get storage usage statistics
     * @returns {Object} Storage statistics
     */
    getStorageStats() {
        if (!this.isSupported) {
            return { supported: false };
        }

        const keys = this.getAllKeys();
        let totalSize = 0;
        let presetCount = 0;

        keys.forEach(key => {
            const data = localStorage.getItem(this._getKey(key));
            if (data) {
                totalSize += data.length;
                if (key.startsWith('preset_')) {
                    presetCount++;
                }
            }
        });

        return {
            supported: true,
            totalKeys: keys.length,
            presetCount,
            totalSize,
            formattedSize: this._formatBytes(totalSize)
        };
    }

    /**
     * Format bytes to human readable format
     * @private
     */
    _formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export default Storage;
