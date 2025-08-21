// =============================================================================
// STORAGE MODULE - Local storage management and server synchronization
// =============================================================================

const Storage = {
    // Configuration
    STORAGE_KEY: 'promptBuilder_data',

    // Save data to localStorage
    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Load data from localStorage
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    },

    // Clear storage
    clear() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },

    // Save prompt locally
    savePrompt(promptData) {
        const saved = this.load() || {};
        if (!Array.isArray(saved.prompts)) saved.prompts = [];
        
        const newPrompt = {
            id: this._generateId(),
            name: promptData.name || `Prompt ${saved.prompts.length + 1}`,
            prompt: promptData.prompt,
            formData: promptData.formData,
            timestamp: new Date().toISOString()
        };
        
        saved.prompts.unshift(newPrompt);
        
        // Keep only last 20 prompts locally
        if (saved.prompts.length > 20) {
            saved.prompts = saved.prompts.slice(0, 20);
        }
        
        this.save(saved);
        return newPrompt;
    },

    // Get saved prompts from local storage
    getSavedPrompts() {
        const saved = this.load();
        return saved?.prompts || [];
    },

    // Delete prompt from local storage
    deletePrompt(id) {
        const saved = this.load();
        if (saved?.prompts) {
            saved.prompts = saved.prompts.filter(p => p.id !== id);
            this.save(saved);
            return true;
        }
        return false;
    },

    // Auto-save current form data
    autoSave(formData) {
        const saved = this.load() || {};
        saved.currentForm = formData;
        this.save(saved);
    },

    // Load auto-saved form data
    loadAutoSave() {
        const saved = this.load();
        return saved?.currentForm || null;
    },

    // Sync prompts from server and update local storage
    async syncFromServer(apiBaseUrl = 'http://localhost:5000/api') {
        try {
            const response = await fetch(`${apiBaseUrl}/prompts/saved`);
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            
            const data = await response.json();
            if (data && data.success && Array.isArray(data.prompts)) {
                // Transform server format to local format
                const saved = { 
                    prompts: data.prompts.map(p => ({
                        id: String(p.id),
                        name: p.name,
                        prompt: p.prompt,
                        formData: p.form_data || p.formData || {},
                        timestamp: p.created_at || p.timestamp || new Date().toISOString()
                    }))
                };

                // Keep maximum 50 client-side
                saved.prompts = saved.prompts.slice(0, 50);
                
                // Preserve current form if exists
                const current = this.load();
                if (current?.currentForm) {
                    saved.currentForm = current.currentForm;
                }
                
                this.save(saved);
                return saved.prompts;
            }
            return null;
        } catch (err) {
            console.warn('Failed to sync prompts from server:', err);
            return null;
        }
    },

    // Private helper to generate unique IDs
    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
