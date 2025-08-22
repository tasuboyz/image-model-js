/**
 * Main UI Controller - Event handling, preview, and form management
 * Coordinates between form inputs, prompt generation, and preview display
 */

import PromptGenerator from '../lib/promptGenerator.js';
import Storage from '../lib/storage.js';
import ApiClient from '../lib/apiClient.js';
import I18n from '../lib/i18n.js';
import { defaultOutfits, defaultAppearancePresets, defaultScenePresets, config } from '../data/outfits.js';

class AppController {
    constructor() {
        // Initialize core components
        this.promptGenerator = new PromptGenerator();
        this.storage = new Storage();
        this.apiClient = new ApiClient();
        this.i18n = new I18n('en');
        
        // Current form data
        this.formData = {
            identity: {},
            appearance: {},
            outfit: {},
            scene: {}
        };
        
        // UI state
        this.isDarkTheme = false;
        this.isServerAvailable = false;
    this.includeSensitive = false;
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing AI Prompt Generator...');
        
        // Check server availability
        this.isServerAvailable = await this.apiClient.isServerAvailable();
        console.log('Server available:', this.isServerAvailable);
        
        // Set up event listeners
        this.setupEventListeners();

    // Wire includeSensitive control if present
    this.initSensitiveControl();
        
        // Load default data
        this.loadDefaultPresets();
        
        // Load autosaved data if available
        this.loadAutosavedData();
        
        // Set initial theme
        this.loadTheme();
        
        // Generate initial preview
        this.updatePreview();
        
        console.log('Application initialized successfully');
    }

    /**
     * Set up event listeners for form elements and controls
     */
    setupEventListeners() {
        // Form field listeners
        this.setupFormListeners();
        
        // Header control listeners
        this.setupHeaderListeners();
        
        // Modal listeners
        this.setupModalListeners();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Initialize tab interactions
        this.initTabs();
        
    // Wire prompt copy button
    this.setupCopyPrompt();
    }

    /**
     * Initialize tab buttons/panels for Outfit section
     */
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        if (!tabButtons || tabButtons.length === 0) return;

        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = btn.getAttribute('data-tab');
                // toggle active class on buttons
                tabButtons.forEach(b => b.classList.toggle('active', b === btn));

                // show/hide panels
                const panels = document.querySelectorAll('.tab-panel');
                panels.forEach(p => p.classList.toggle('active', p.id === target));
            });
        });
    }

    /**
     * Set up form field event listeners
     */
    setupFormListeners() {
        // Get all form inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Add input event listener for real-time updates
            input.addEventListener('input', (e) => {
                this.handleFormChange(e.target);
            });
            
            // Add change event for select elements
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', (e) => {
                    this.handleFormChange(e.target);
                });
            }
        });
    }

    /**
     * Set up header control event listeners
     */
    setupHeaderListeners() {
        // Load preset dropdown
        const loadPreset = document.getElementById('loadPreset');
        if (loadPreset) {
            loadPreset.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadPreset(e.target.value);
                }
            });
        }

        // Inline delete button (next to select)
        const inlineDelete = document.getElementById('presetDeleteBtnInline');
        if (inlineDelete && loadPreset) {
            // enable when a stored preset is selected (based on storage index)
            const refreshDeleteState = () => {
                const val = loadPreset.value;
                const saved = this.storage.loadPresets();
                inlineDelete.disabled = !val || !saved.some(p => p.id === val);
            };

            // refresh when dropdown changes and after presets load
            loadPreset.addEventListener('change', (e) => {
                refreshDeleteState();
                if (e.target.value) {
                    this.loadPreset(e.target.value);
                }
            });

            // call once to initialize
            refreshDeleteState();

            inlineDelete.addEventListener('click', async () => {
                const selected = loadPreset.value;
                if (!selected) return;

                const confirmed = confirm('Delete selected preset? This cannot be undone.');
                if (!confirmed) return;

                const results = { local: false, server: null };

                try {
                    results.local = this.storage.deletePreset(selected);
                } catch (err) {
                    console.warn('Local delete error:', err);
                }

                if (this.isServerAvailable) {
                    try {
                        const sid = this._getServerIdForLocal(selected) || selected;
                        await this.apiClient.deletePreset(sid);
                        results.server = true;
                    } catch (err) {
                        console.warn('Server delete failed:', err.message || err);
                        results.server = false;
                    }
                }

                // Refresh dropdown and update button state
                this.loadDefaultPresets();
                refreshDeleteState();

                // Provide detailed feedback
                if (results.local && (results.server === null || results.server === true)) {
                    alert('Preset deleted successfully.');
                } else if (results.local && results.server === false) {
                    alert('Preset deleted locally but server delete failed.');
                } else if (!results.local && results.server === true) {
                    alert('Server preset deleted, but local deletion failed.');
                } else {
                    alert('Failed to delete preset. Check console for details.');
                }
            });
        }
        
        // Save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.showSaveModal();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
        
        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearForm();
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /** Copy prompt to clipboard and show feedback */
    setupCopyPrompt() {
        const btn = document.getElementById('copyPromptBtn');
        const output = document.getElementById('promptOutput');
        if (!btn || !output) return;

        btn.addEventListener('click', async () => {
            const text = output.textContent || output.innerText || '';
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text.replace(/^"|"$/g, ''));
                } else {
                    // fallback
                    const ta = document.createElement('textarea');
                    ta.value = text.replace(/^"|"$/g, '');
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                }

                // visual feedback
                const original = btn.textContent;
                btn.textContent = 'Copied';
                setTimeout(() => btn.textContent = original, 1200);
            } catch (e) {
                console.warn('Copy failed', e);
                btn.textContent = 'Failed';
                setTimeout(() => btn.textContent = 'Copy', 1200);
            }
        });
    }

    /**
     * Initialize includeSensitive checkbox and related visibility logic
     */
    initSensitiveControl() {
        const chk = document.getElementById('includeSensitive');
        if (chk) {
            this.includeSensitive = chk.checked;
            chk.addEventListener('change', (e) => {
                this.includeSensitive = e.target.checked;
                // propagate to prompt generator
                this.promptGenerator.updateOptions({ includeSensitive: this.includeSensitive });
                this.updateBreastSectionVisibility();
                this.updatePreview();
            });
        }
        // Ensure prompt generator has the initial value
        this.promptGenerator.updateOptions({ includeSensitive: this.includeSensitive });
        this.updateBreastSectionVisibility();
    }

    /**
     * Set up modal event listeners
     */
    setupModalListeners() {
        // Save modal
        const saveModal = document.getElementById('saveModal');
        const saveConfirm = document.getElementById('saveConfirm');
        const saveCancel = document.getElementById('saveCancel');
        
        if (saveConfirm) {
            saveConfirm.addEventListener('click', () => {
                this.confirmSave();
            });
        }
        
        if (saveCancel) {
            saveCancel.addEventListener('click', () => {
                this.hideSaveModal();
            });
        }
        
        // Close modal on backdrop click
        if (saveModal) {
            saveModal.addEventListener('click', (e) => {
                if (e.target === saveModal) {
                    this.hideSaveModal();
                }
            });
        }

        // Manage presets modal wiring
        const manageBtn = document.getElementById('managePresetsBtn');
        const manageModal = document.getElementById('managePresetsModal');
        const closeManage = document.getElementById('closeManagePresets');

        if (manageBtn && manageModal) {
            manageBtn.addEventListener('click', () => {
                this.openManagePresets();
            });
        }

        if (closeManage) {
            closeManage.addEventListener('click', () => {
                if (manageModal) manageModal.style.display = 'none';
            });
        }

        if (manageModal) {
            manageModal.addEventListener('click', (e) => {
                if (e.target === manageModal) manageModal.style.display = 'none';
            });
        }
    }

    /**
     * Set up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S for save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.showSaveModal();
            }
            
            // Ctrl+E for export
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.exportData();
            }
            
            // Ctrl+R for clear (prevent default page refresh)
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.clearForm();
            }
            
            // Escape to close modal
            if (e.key === 'Escape') {
                this.hideSaveModal();
            }
        });
    }

    /**
     * Handle form field changes
     */
    handleFormChange(field) {
        const { id, value } = field;
        
        // Determine which section this field belongs to
        const section = this.getFieldSection(id);
        
        if (section) {
            // Update form data
            // Only store sensitive fields if includeSensitive is true
            const sensitiveIds = ['braCup','bustSize','breastShape','cleavage'];
            if (sensitiveIds.includes(id) && !this.includeSensitive) {
                // ignore sensitive input when disabled
            } else {
                this.formData[section][id] = value;
            }
            
            // Update preview
            this.updatePreview();
            
            // Autosave
            this.autosave();
            
            // Show visual feedback
            this.showFieldFeedback(field);
        }
    }

    /**
     * Show or hide the breast section based on gender and includeSensitive
     */
    updateBreastSectionVisibility() {
        const gender = this.formData.identity?.gender || (document.getElementById('gender')?.value);
        const breastSection = document.getElementById('breastSection');
        if (!breastSection) return;

        if (gender === 'female' && this.includeSensitive) {
            breastSection.style.display = '';
        } else {
            breastSection.style.display = 'none';
            // Optionally clear sensitive fields when hidden
            ['braCup','bustSize','breastShape','cleavage'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
                if (this.formData.appearance && this.formData.appearance[id]) delete this.formData.appearance[id];
                if (this.formData.identity && this.formData.identity[id]) delete this.formData.identity[id];
            });
        }
    }

    /**
     * Determine which section a field belongs to
     */
    getFieldSection(fieldId) {
        const identityFields = ['age', 'gender', 'ethnicity', 'profession', 'braCup', 'bustSize', 'tags', 'notes'];
        const appearanceFields = ['bodyType', 'height', 'skinTone', 'hairLength', 'hairStyle', 'hairColor', 'eyeColor', 'makeup'];
    const outfitFields = ['torso', 'torsoColor', 'torsoLength', 'neckline', 'lower', 'lowerColor', 'footwear', 'footwearColor', 'heelHeight', 'accessories', 'outerwear', 'headwear', 'hairAccessories', 'faceAccessories', 'upperBodyMain', 'torsoGarment', 'torsoStyle', 'torsoFit', 'bottomsType', 'bottomsStyle', 'intimateLower', 'legwear', 'legwearStyle', 'shoeType', 'earrings', 'neckwear'];
        const sceneFields = ['pose', 'location', 'time', 'weather', 'mood', 'lighting', 'shotType', 'background'];
        
        if (identityFields.includes(fieldId)) return 'identity';
        if (appearanceFields.includes(fieldId)) return 'appearance';
        if (outfitFields.includes(fieldId)) return 'outfit';
        if (sceneFields.includes(fieldId)) return 'scene';
        
        return null;
    }

    /**
     * Update the preview areas
     */
    updatePreview() {
        try {
            // Generate prompt and clothing map
            const result = this.promptGenerator.generate(this.formData);
            
            // Update prompt output
            const promptOutput = document.getElementById('promptOutput');
            if (promptOutput) {
                promptOutput.textContent = `"${result.prompt}"`;
            }
            
            // Update clothing map
            this.updateClothingMap(result.clothingMap);
            
        } catch (error) {
            console.error('Error updating preview:', error);
        }
    }

    /**
     * Update clothing map display
     */
    updateClothingMap(clothingMap) {
        const clothingMapOutput = document.getElementById('clothingMapOutput');
        if (!clothingMapOutput || !clothingMap) return;
        
        // Clear existing content
        clothingMapOutput.innerHTML = '';
        
        // Add each clothing area
        clothingMap.forEach(area => {
            const item = document.createElement('div');
            item.className = 'clothing-item';
            item.textContent = area.display;
            
            // Add empty class if no items
            if (area.items.length === 0) {
                item.classList.add('empty');
            }
            
            clothingMapOutput.appendChild(item);
        });
    }

    /**
     * Show visual feedback for field changes
     */
    showFieldFeedback(field) {
        // Add temporary highlight class
        field.classList.add('field-changed');
        
        setTimeout(() => {
            field.classList.remove('field-changed');
        }, 300);
    }

    /** Open manage presets modal and populate list */
    openManagePresets() {
        const modal = document.getElementById('managePresetsModal');
        const list = document.getElementById('presetsList');
        if (!modal || !list) return;

        // Clear list
        list.innerHTML = '';

        const presets = this.storage.loadPresets();
        if (!presets || presets.length === 0) {
            list.innerHTML = '<div style="padding:8px;color:var(--text-muted);">No saved presets</div>';
        } else {
            presets.forEach(p => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';
                row.style.padding = '6px 4px';

                const left = document.createElement('div');
                left.style.display = 'flex';
                left.style.flexDirection = 'column';
                const name = document.createElement('div');
                name.textContent = p.name;
                name.style.fontWeight = '600';
                const meta = document.createElement('div');
                meta.textContent = `${p.category || 'outfit'} • ${new Date(p.created).toLocaleString()}`;
                meta.style.fontSize = '0.8rem';
                meta.style.color = 'var(--text-muted)';
                left.appendChild(name);
                left.appendChild(meta);

                const actions = document.createElement('div');
                const loadBtn = document.createElement('button');
                loadBtn.textContent = 'Load';
                loadBtn.className = 'btn-secondary';
                loadBtn.style.marginRight = '8px';
                loadBtn.addEventListener('click', () => {
                    this.loadPreset(p.id);
                    // close modal
                    modal.style.display = 'none';
                });

                const delBtn = document.createElement('button');
                delBtn.textContent = 'Delete';
                delBtn.className = 'btn-secondary';
                delBtn.addEventListener('click', async () => {
                    const confirmed = confirm(`Delete preset "${p.name}"?`);
                    if (!confirmed) return;
                    const localOk = this.storage.deletePreset(p.id);
                    let serverOk = null;
                    if (this.isServerAvailable) {
                        try {
                            const sid = p.serverId || this._getServerIdForLocal(p.id) || p.id;
                            await this.apiClient.deletePreset(sid);
                            serverOk = true;
                        } catch (err) {
                            console.warn('Server delete failed:', err.message || err);
                            serverOk = false;
                        }
                    }

                    if (localOk) {
                        // remove row from UI
                        row.remove();
                        // refresh dropdown
                        this.loadDefaultPresets();
                    }

                    if (localOk && (serverOk === null || serverOk === true)) {
                        alert('Preset deleted');
                    } else if (localOk && serverOk === false) {
                        alert('Deleted locally but server delete failed');
                    } else {
                        alert('Failed to delete preset');
                    }
                });

                actions.appendChild(loadBtn);
                actions.appendChild(delBtn);

                row.appendChild(left);
                row.appendChild(actions);

                list.appendChild(row);
            });
        }

        modal.style.display = 'flex';
    }

    /**
     * Load default presets into UI
     */
    loadDefaultPresets() {
        const loadPreset = document.getElementById('loadPreset');
        if (!loadPreset) return;
        
        // Clear existing options (except first)
        while (loadPreset.children.length > 1) {
            loadPreset.removeChild(loadPreset.lastChild);
        }
        
        // Add outfit presets
        const outfitGroup = document.createElement('optgroup');
        outfitGroup.label = 'Outfits';
        
        defaultOutfits.forEach(outfit => {
            const option = document.createElement('option');
            option.value = outfit.id;
            option.textContent = outfit.name;
            outfitGroup.appendChild(option);
        });
        
        loadPreset.appendChild(outfitGroup);
        
        // Add appearance presets
        const appearanceGroup = document.createElement('optgroup');
        appearanceGroup.label = 'Appearance';
        
        defaultAppearancePresets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.id;
            option.textContent = preset.name;
            appearanceGroup.appendChild(option);
        });
        
        loadPreset.appendChild(appearanceGroup);
        
        // Add scene presets
        const sceneGroup = document.createElement('optgroup');
        sceneGroup.label = 'Scenes';
        
        defaultScenePresets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.id;
            option.textContent = preset.name;
            sceneGroup.appendChild(option);
        });
        
        loadPreset.appendChild(sceneGroup);
        
        // Load saved presets if available
        this.loadSavedPresets();
    }

    /**
     * Load saved presets from storage
     */
    loadSavedPresets() {
        const savedPresets = this.storage.loadPresets();
        if (savedPresets.length === 0) return;
        
        const loadPreset = document.getElementById('loadPreset');
        if (!loadPreset) return;
        
        // Add saved presets group
        const savedGroup = document.createElement('optgroup');
        savedGroup.label = 'Saved Presets';
        
        savedPresets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.id;
            option.textContent = preset.name;
            savedGroup.appendChild(option);
        });
        
        loadPreset.appendChild(savedGroup);
    }

    /** Associate a local preset id with the server id (store in presets_index metadata) */
    _associateLocalWithServer(localId, serverId) {
        try {
            const presets = this.storage.loadPresets();
            const updated = presets.map(p => {
                if (p.id === localId) {
                    return { ...p, serverId };
                }
                return p;
            });
            this.storage.save('presets_index', updated);
        } catch (e) {
            console.warn('Failed to associate local/server id:', e);
        }
    }

    /** Return serverId for a given local preset id if available */
    _getServerIdForLocal(localId) {
        const presets = this.storage.loadPresets();
        const found = presets.find(p => p.id === localId);
        return found ? (found.serverId || null) : null;
    }

    /**
     * Load a preset by ID
     */
    loadPreset(presetId) {
        try {
            // Find preset in default presets
            let preset = [...defaultOutfits, ...defaultAppearancePresets, ...defaultScenePresets]
                .find(p => p.id === presetId);
            
            // If not found, try storage
            if (!preset) {
                preset = this.storage.loadPreset(presetId);
            }
            
            if (!preset) {
                console.error('Preset not found:', presetId);
                return;
            }
            
            // Apply preset data to form
            this.applyPresetToForm(preset.data);
            
            // Update preview
            this.updatePreview();
            
            console.log('Loaded preset:', preset.name);
            
        } catch (error) {
            console.error('Error loading preset:', error);
        }
    }

    /**
     * Apply preset data to form fields
     */
    applyPresetToForm(data) {
        // Clear form first
        this.clearForm(false);
        
        // Apply data to each section
        Object.entries(data).forEach(([section, sectionData]) => {
            if (this.formData[section]) {
                Object.entries(sectionData).forEach(([field, value]) => {
                    // Update form data
                    this.formData[section][field] = value;
                    
                    // Update form field
                    const element = document.getElementById(field);
                    if (element) {
                        element.value = value;
                    }
                });
            }
        });
    }

    /**
     * Show save modal
     */
    showSaveModal() {
        const modal = document.getElementById('saveModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Focus on name field
            const nameField = document.getElementById('presetName');
            if (nameField) {
                nameField.focus();
            }
        }
    }

    /**
     * Hide save modal
     */
    hideSaveModal() {
        const modal = document.getElementById('saveModal');
        if (modal) {
            modal.style.display = 'none';
            
            // Clear form
            const nameField = document.getElementById('presetName');
            const categoryField = document.getElementById('presetCategory');
            const tagsField = document.getElementById('presetTags');
            
            if (nameField) nameField.value = '';
            if (categoryField) categoryField.value = 'outfit';
            if (tagsField) tagsField.value = '';
        }
    }

    /**
     * Confirm save operation
     */
    async confirmSave() {
        const nameField = document.getElementById('presetName');
        const categoryField = document.getElementById('presetCategory');
        const tagsField = document.getElementById('presetTags');
        
        const name = nameField?.value.trim();
        const category = categoryField?.value || 'outfit';
        const tagsString = tagsField?.value.trim() || '';
        
        if (!name) {
            alert('Please enter a preset name.');
            return;
        }
        
        const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
        
        try {
            // Save locally
            const presetId = this.storage.savePreset(name, this.formData, {
                category,
                tags
            });
            
            // Try to save to server if available
            if (this.isServerAvailable) {
                try {
                    const resp = await this.apiClient.createPreset({
                        name,
                        category,
                        data: this.formData,
                        tags
                    });
                    // resp may include { ok: true, id }
                    if (resp && (resp.id || resp.ok && resp.id === 0) ) {
                        const serverId = resp.id;
                        // Link local preset with server id for future deletes
                        this._associateLocalWithServer(presetId, serverId);
                    }
                    console.log('Preset saved to server');
                } catch (error) {
                    console.warn('Failed to save to server:', error);
                }
            }
            
            // Refresh preset dropdown
            this.loadDefaultPresets();
            
            // Hide modal
            this.hideSaveModal();
            
            console.log('Preset saved:', name);
            
        } catch (error) {
            console.error('Error saving preset:', error);
            alert('Failed to save preset. Please try again.');
        }
    }

    /**
     * Export current data
     */
    exportData() {
        try {
            const result = this.promptGenerator.generate(this.formData);
            
            const exportData = {
                version: '1.0',
                exported: new Date().toISOString(),
                formData: this.formData,
                generatedPrompt: result.prompt,
                clothingMap: result.clothingMap
            };
            
            // Create download link
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-prompt-${Date.now()}.json`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            console.log('Data exported successfully');
            
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Failed to export data. Please try again.');
        }
    }

    /**
     * Clear form data
     */
    clearForm(updatePreview = true) {
        // Clear form data
        this.formData = {
            identity: {},
            appearance: {},
            outfit: {},
            scene: {}
        };
        
        // Clear form fields
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0;
            } else {
                input.value = '';
            }
        });
        
        // Clear preset selection
        const loadPreset = document.getElementById('loadPreset');
        if (loadPreset) {
            loadPreset.selectedIndex = 0;
        }
        
        if (updatePreview) {
            this.updatePreview();
        }
        
        console.log('Form cleared');
    }

    /**
     * Toggle dark/light theme
     */
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (this.isDarkTheme) {
            body.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            body.removeAttribute('data-theme');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
        
        // Save theme preference
        this.storage.save('theme', this.isDarkTheme ? 'dark' : 'light');
        
        console.log('Theme toggled:', this.isDarkTheme ? 'dark' : 'light');
    }

    /**
     * Load theme preference
     */
    loadTheme() {
        const savedTheme = this.storage.load('theme', 'light');
        this.isDarkTheme = savedTheme === 'dark';
        
        if (this.isDarkTheme) {
            document.body.setAttribute('data-theme', 'dark');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) themeToggle.textContent = '☀️';
        }
    }

    /**
     * Load autosaved data
     */
    loadAutosavedData() {
        const autosaved = this.storage.loadAutosaved();
        if (autosaved) {
            this.formData = autosaved;
            this.applyPresetToForm(autosaved);
            console.log('Loaded autosaved data');
        }
    }

    /**
     * Autosave current data
     */
    autosave() {
        if (config.autosave.enabled) {
            this.storage.autosave(this.formData);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.appController = new AppController();
});

// Add some CSS classes for visual feedback
const style = document.createElement('style');
style.textContent = `
    .field-changed {
        animation: fieldHighlight 0.3s ease-out;
    }
    
    @keyframes fieldHighlight {
        0% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }
        100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    
    .clothing-item.empty {
        opacity: 0.5;
        font-style: italic;
    }
`;

document.head.appendChild(style);

export default AppController;
