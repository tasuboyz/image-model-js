/**
 * ApiClient - AJAX client for backend API communication
 * Handles preset management with the Flask backend
 */
export class ApiClient {
    constructor(options = {}) {
        this.options = {
            baseUrl: '',  // Empty for same origin
            timeout: 10000,
            ...options
        };
    }

    /**
     * Make HTTP request
     * @private
     */
    async _request(url, options = {}) {
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.options.timeout);
        config.signal = controller.signal;

        try {
            const response = await fetch(`${this.options.baseUrl}${url}`, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            throw error;
        }
    }

    /**
     * Create a new preset on the server
     * @param {Object} preset - Preset data
     * @returns {Promise<Object>} Server response
     */
    async createPreset(preset) {
        const payload = {
            name: preset.name,
            category: preset.category || 'outfit',
            data: preset.data,
            tags: preset.tags || []
        };

        return await this._request('/api/presets', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }

    /**
     * Get all presets from the server
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>} Array of presets
     */
    async getPresets(filters = {}) {
        const params = new URLSearchParams();
        
        if (filters.category) params.append('category', filters.category);
        if (filters.tags) params.append('tags', filters.tags);
        if (filters.search) params.append('search', filters.search);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);

        const queryString = params.toString();
        const url = queryString ? `/api/presets?${queryString}` : '/api/presets';
        
        return await this._request(url);
    }

    /**
     * Get a specific preset by ID
     * @param {number|string} id - Preset ID
     * @returns {Promise<Object>} Preset data
     */
    async getPreset(id) {
        return await this._request(`/api/presets/${id}`);
    }

    /**
     * Update a preset
     * @param {number|string} id - Preset ID
     * @param {Object} preset - Updated preset data
     * @returns {Promise<Object>} Server response
     */
    async updatePreset(id, preset) {
        const payload = {
            name: preset.name,
            category: preset.category,
            data: preset.data,
            tags: preset.tags || []
        };

        return await this._request(`/api/presets/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    }

    /**
     * Delete a preset
     * @param {number|string} id - Preset ID
     * @returns {Promise<Object>} Server response
     */
    async deletePreset(id) {
        return await this._request(`/api/presets/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Search presets
     * @param {string} query - Search query
     * @param {Object} filters - Additional filters
     * @returns {Promise<Array>} Search results
     */
    async searchPresets(query, filters = {}) {
        return await this.getPresets({
            search: query,
            ...filters
        });
    }

    /**
     * Get preset categories
     * @returns {Promise<Array>} Available categories
     */
    async getCategories() {
        return await this._request('/api/categories');
    }

    /**
     * Get preset tags
     * @returns {Promise<Array>} Available tags
     */
    async getTags() {
        return await this._request('/api/tags');
    }

    /**
     * Check server health
     * @returns {Promise<Object>} Health status
     */
    async health() {
        return await this._request('/api/health');
    }

    /**
     * Batch operations
     */

    /**
     * Upload multiple presets
     * @param {Array} presets - Array of preset objects
     * @returns {Promise<Object>} Batch upload result
     */
    async batchCreatePresets(presets) {
        return await this._request('/api/presets/batch', {
            method: 'POST',
            body: JSON.stringify({ presets })
        });
    }

    /**
     * Delete multiple presets
     * @param {Array} ids - Array of preset IDs
     * @returns {Promise<Object>} Batch delete result
     */
    async batchDeletePresets(ids) {
        return await this._request('/api/presets/batch', {
            method: 'DELETE',
            body: JSON.stringify({ ids })
        });
    }

    /**
     * Export presets in various formats
     * @param {Object} options - Export options
     * @returns {Promise<string>} Exported data
     */
    async exportPresets(options = {}) {
        const params = new URLSearchParams();
        
        if (options.format) params.append('format', options.format);
        if (options.category) params.append('category', options.category);
        if (options.ids) params.append('ids', options.ids.join(','));

        const queryString = params.toString();
        const url = queryString ? `/api/export?${queryString}` : '/api/export';
        
        return await this._request(url);
    }

    /**
     * Import presets from file/data
     * @param {string|File} data - Import data
     * @param {Object} options - Import options
     * @returns {Promise<Object>} Import result
     */
    async importPresets(data, options = {}) {
        let body;
        let headers = {};

        if (data instanceof File) {
            body = new FormData();
            body.append('file', data);
            // Don't set Content-Type, let browser set it with boundary
        } else if (typeof data === 'string') {
            body = JSON.stringify({ data, ...options });
            headers['Content-Type'] = 'application/json';
        } else {
            throw new Error('Invalid data type for import');
        }

        return await this._request('/api/import', {
            method: 'POST',
            headers,
            body
        });
    }

    /**
     * Error handling helper
     * @param {Error} error - Error object
     * @returns {Object} Normalized error response
     */
    handleError(error) {
        console.error('API Error:', error);
        
        return {
            success: false,
            error: error.message || 'Unknown error occurred',
            code: error.code || 'UNKNOWN_ERROR'
        };
    }

    /**
     * Check if server is available
     * @returns {Promise<boolean>} Server availability
     */
    async isServerAvailable() {
        try {
            await this.health();
            return true;
        } catch (error) {
            console.warn('Server not available:', error.message);
            return false;
        }
    }

    /**
     * Sync local presets with server
     * @param {Array} localPresets - Local presets to sync
     * @returns {Promise<Object>} Sync result
     */
    async syncPresets(localPresets) {
        try {
            // Get server presets
            const serverPresets = await this.getPresets();
            const serverIds = new Set(serverPresets.map(p => p.id));
            
            // Find presets to upload (local only)
            const toUpload = localPresets.filter(preset => 
                !serverIds.has(preset.id)
            );
            
            // Upload new presets
            const uploadResults = [];
            for (const preset of toUpload) {
                try {
                    const result = await this.createPreset(preset);
                    uploadResults.push({ preset: preset.name, success: true, result });
                } catch (error) {
                    uploadResults.push({ preset: preset.name, success: false, error: error.message });
                }
            }
            
            return {
                success: true,
                uploaded: uploadResults.filter(r => r.success).length,
                failed: uploadResults.filter(r => !r.success).length,
                details: uploadResults
            };
        } catch (error) {
            return this.handleError(error);
        }
    }
}

export default ApiClient;
