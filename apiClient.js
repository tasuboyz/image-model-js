// =============================================================================
// API CLIENT MODULE - Server communication and error handling
// =============================================================================

const ApiClient = {
    // Configuration
    baseUrl: 'http://localhost:5000/api',
    timeout: 5000,

    // Set base URL for API calls
    setBaseUrl(url) {
        this.baseUrl = url;
    },

    // Generic fetch wrapper with timeout and error handling
    async _fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error(`API call failed: ${endpoint}`, error);
            throw error;
        }
    },

    // Health check
    async healthCheck() {
        try {
            const data = await this._fetch('/health');
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Alternative health check method (for compatibility)
    async checkHealth() {
        return this.healthCheck();
    },

    // Generate prompt (if we want server-side generation)
    async generatePrompt(formData) {
        try {
            const data = await this._fetch('/prompts/generate', {
                method: 'POST',
                body: JSON.stringify({
                    identity: formData.identity || {},
                    appearance: formData.appearance || {},
                    clothing: formData.clothing || {},
                    scene: formData.scene || {},
                    ...formData // fallback to flat structure
                })
            });
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Save prompt to server
    async savePrompt(payload) {
        try {
            const data = await this._fetch('/prompts/save', {
                method: 'POST',
                body: JSON.stringify({
                    name: payload.name,
                    prompt: payload.prompt,
                    form_data: payload.form_data || payload.formData
                })
            });
            return { success: true, id: data.id, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get saved prompts from server
    async getSavedPrompts(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const endpoint = `/prompts/saved${queryString ? '?' + queryString : ''}`;
            const data = await this._fetch(endpoint);
            return { success: true, prompts: data.prompts || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Alternative method name for compatibility
    async getPrompts(params = {}) {
        return this.getSavedPrompts(params);
    },

    // Delete prompt from server
    async deletePrompt(promptId) {
        try {
            const data = await this._fetch(`/prompts/${promptId}`, {
                method: 'DELETE'
            });
            return { success: true, message: data.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // Get default presets
    async getDefaultPresets() {
        try {
            const data = await this._fetch('/presets/default');
            return { success: true, presets: data.presets || {} };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiClient;
}
