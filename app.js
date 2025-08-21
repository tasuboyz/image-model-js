// =============================================================================
// IMAGE PROMPT BUILDER - JAVASCRIPT CORE
// Frontend ES6 per generazione prompt con outfit consistente
// =============================================================================

// -----------------------------------------------------------------------------
// CONFIGURAZIONE E COSTANTI
// -----------------------------------------------------------------------------

const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    STORAGE_KEY: 'promptBuilder_data',
    DEBOUNCE_DELAY: 300,
    MAX_CHARACTERS: 512,
    VERSION: '1.0.0'
};

// Configure ApiClient with our settings
if (typeof ApiClient !== 'undefined') {
    ApiClient.setBaseUrl(CONFIG.API_BASE_URL);
}

// Database degli outfit e colori
const OUTFIT_DATABASE = {
    presets: {
        professional: {
            name: "💼 Business Professional",
            gender: "female",
            age: 28,
            build: "athletic",
            hairColor: "brunette",
            hairLength: "shoulder",
            hairStyle: "sleek",
            skinTone: "fair",
            eyeColor: "brown",
            makeup: "light",
            neckwear: "none",
            upperBodyMain: "blazer",
            sleeves: "long",
            intimate: "none",
            outerwear: "none",
            bottomsType: "trousers",
            bottomsStyle: "fitted",
            intimateLower: "none",
            legwear: "pantyhose",
            legwearStyle: "sheer",
            shoeType: "pumps",
            heelHeight: "medium",
            primaryColor: "black",
            secondaryColor: "white",
            overallStyle: "business",
            location: "indoor-studio",
            lighting: "studio",
            photographyStyle: "portrait",
            shotType: "full-body",
            pose: "standing",
            mood: "professional"
        },
        casual: {
            name: "👕 Casual Everyday",
            gender: "female",
            age: 24,
            build: "average",
            hairColor: "blonde",
            hairLength: "long",
            hairStyle: "wavy",
            skinTone: "fair",
            eyeColor: "blue",
            makeup: "natural",
            neckwear: "none",
            upperBodyMain: "tshirt",
            sleeves: "short",
            intimate: "bra",
            outerwear: "denim-jacket",
            bottomsType: "jeans",
            bottomsStyle: "skinny",
            intimateLower: "panties",
            legwear: "none",
            legwearStyle: "none",
            shoeType: "sneakers",
            heelHeight: "flat",
            primaryColor: "blue",
            secondaryColor: "white",
            overallStyle: "casual",
            location: "outdoor-natural",
            lighting: "natural",
            photographyStyle: "portrait",
            shotType: "full-body",
            pose: "relaxed",
            mood: "casual"
        },
        evening: {
            name: "🌃 Elegant Evening",
            gender: "female",
            age: 26,
            build: "curvy",
            hairColor: "black",
            hairLength: "long",
            hairStyle: "updo",
            skinTone: "medium",
            eyeColor: "green",
            makeup: "dramatic",
            earrings: "dangling",
            neckwear: "necklace",
            upperBodyMain: "none",
            sleeves: "sleeveless",
            intimate: "none",
            outerwear: "none",
            bottomsType: "dress",
            bottomsStyle: "maxi",
            intimateLower: "none",
            legwear: "stockings",
            legwearStyle: "sheer",
            shoeType: "heels",
            heelHeight: "high",
            primaryColor: "black",
            secondaryColor: "gold",
            fabrics: "silk",
            overallStyle: "evening",
            location: "indoor-studio",
            lighting: "dramatic",
            photographyStyle: "fashion",
            shotType: "full-body",
            pose: "elegant",
            mood: "elegant"
        },
        beach: {
            name: "🏖️ Beach Casual",
            gender: "female",
            age: 23,
            build: "athletic",
            hairColor: "brunette",
            hairLength: "long",
            hairStyle: "wavy",
            skinTone: "tan",
            eyeColor: "hazel",
            makeup: "light",
            faceAccessories: "sunglasses",
            upperBodyMain: "tank",
            sleeves: "sleeveless",
            intimate: "bralette",
            outerwear: "none",
            bottomsType: "shorts",
            bottomsStyle: "mini",
            intimateLower: "none",
            legwear: "none",
            shoeType: "sandals",
            heelHeight: "flat",
            primaryColor: "white",
            secondaryColor: "blue",
            fabrics: "cotton",
            overallStyle: "casual",
            location: "beach",
            lighting: "natural",
            photographyStyle: "portrait",
            shotType: "full-body",
            pose: "relaxed",
            mood: "playful"
        },
        athletic: {
            name: "🏃‍♀️ Athletic Wear",
            gender: "female",
            age: 25,
            build: "athletic",
            hairColor: "brunette",
            hairLength: "shoulder",
            hairStyle: "ponytail",
            skinTone: "fair",
            eyeColor: "brown",
            makeup: "none",
            upperBodyMain: "tank",
            sleeves: "sleeveless",
            intimate: "bra",
            outerwear: "none",
            bottomsType: "leggings",
            bottomsStyle: "fitted",
            intimateLower: "none",
            legwear: "none",
            shoeType: "sneakers",
            heelHeight: "flat",
            primaryColor: "black",
            secondaryColor: "pink",
            fabrics: "mesh",
            overallStyle: "sporty",
            location: "outdoor-natural",
            lighting: "natural",
            photographyStyle: "portrait",
            shotType: "full-body",
            pose: "dynamic",
            mood: "energetic"
        },
        artistic: {
            name: "🎭 Artistic/Creative",
            gender: "female",
            age: 27,
            build: "slim",
            hairColor: "red",
            hairLength: "long",
            hairStyle: "wavy",
            skinTone: "pale",
            eyeColor: "green",
            makeup: "bold",
            hairAccessories: "flowers",
            neckwear: "choker",
            upperBodyMain: "blouse",
            sleeves: "three-quarter",
            intimate: "none",
            outerwear: "none",
            bottomsType: "skirt",
            bottomsStyle: "midi",
            intimateLower: "none",
            legwear: "tights",
            legwearStyle: "patterned",
            shoeType: "boots",
            heelHeight: "medium",
            primaryColor: "purple",
            secondaryColor: "black",
            fabrics: "velvet",
            overallStyle: "bohemian",
            location: "indoor-studio",
            lighting: "artistic",
            photographyStyle: "artistic",
            shotType: "three-quarter",
            pose: "artistic",
            mood: "artistic"
        }
    },

    colors: {
        black: "nero",
        white: "bianco",
        red: "rosso",
        blue: "blu",
        green: "verde",
        emerald: "smeraldo",
        yellow: "giallo",
        purple: "viola",
        pink: "rosa",
        gold: "oro",
        silver: "argento"
    },

    fabrics: {
        lace: "pizzo",
        silk: "seta",
        cotton: "cotone",
        leather: "pelle",
        satin: "raso",
        velvet: "velluto",
        mesh: "mesh",
        sequins: "paillettes"
    }
};

// -----------------------------------------------------------------------------
// STATO DELL'APPLICAZIONE
// -----------------------------------------------------------------------------

let appState = {
    currentTab: 'identity',
    formData: {},
    savedPrompts: [],
    isLoading: false,
    debounceTimer: null
};

// -----------------------------------------------------------------------------
// UTILITÀ GENERALI
// -----------------------------------------------------------------------------

const Utils = {
    // Debounce per evitare troppe chiamate
    debounce(func, delay) {
        clearTimeout(appState.debounceTimer);
        appState.debounceTimer = setTimeout(func, delay);
    },

    // Validazione età
    isValidAge(age) {
        return age >= 18 && age <= 65;
    },

    // Copia testo negli appunti
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback per browser più vecchi
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

    // Download file
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    // Capitalizza prima lettera
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Traduce valori da inglese a italiano per display
    translateValue(value, context = '') {
        const translations = {
            // Gender
            'female': 'femminile',
            'male': 'maschile',
            'non-binary': 'non-binary',
            
            // Build
            'slim': 'snella',
            'athletic': 'atletica',
            'curvy': 'formosa',
            'muscular': 'muscolosa',
            'average': 'media',
            
            // Hair colors
            'blonde': 'biondo',
            'brunette': 'castano',
            'black': 'nero',
            'red': 'rosso',
            'auburn': 'ramato',
            
            // Clothing items
            'bra': 'reggiseno',
            'panties': 'slip',
            'stockings': 'autoreggenti',
            'heels': 'tacchi',
            'dress': 'vestito'
        };
        
        return translations[value] || value;
    }
};

// PromptGenerator is provided by `promptGenerator.js` and loaded before `app.js`.
// Remove the in-file duplicate definition to avoid "Identifier already declared" errors.

// -----------------------------------------------------------------------------
// GESTIONE INTERFACCIA UTENTE
// -----------------------------------------------------------------------------

const UI = {
    // Inizializza interfaccia
    init() {
        this.setupTabs();
        this.setupFormHandlers();
        this.setupActionButtons();
        this.setupPresets();
        this.setupModals();
        this.updateGenderVisibility();
        this.loadAutoSave();
        // Try to sync saved prompts from server on init, then refresh UI
        try {
            Storage.syncFromServer(CONFIG.API_BASE_URL).then((prompts) => {
                // If server returned prompts, refresh the displayed list
                this.updateSavedPromptsList();
            }).catch(() => {
                // On error, just update with local data
                this.updateSavedPromptsList();
            });
        } catch (e) {
            this.updateSavedPromptsList();
        }
    },

    // Setup tabs
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Update button states
                tabButtons.forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                
                // Update content visibility
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                
                const targetContent = document.getElementById(`${tabId}Tab`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                    targetContent.classList.add('fade-in');
                }
                
                appState.currentTab = tabId;
            });
        });
    },

    // Setup form handlers
    setupFormHandlers() {
        const formElements = document.querySelectorAll('input, select');
        
        formElements.forEach(element => {
            element.addEventListener('change', () => {
                this.handleFormChange();
            });
            
            element.addEventListener('input', () => {
                this.handleFormChange();
            });
        });

        // Ensure torso selects specifically trigger immediate updates (works around any edge cases)
        ['torsoGarment', 'torsoStyle', 'torsoLength', 'neckline'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const handler = () => {
                    // Force immediate update path (non-debounced) for better responsiveness
                    this.collectFormData();
                    this.generateAndUpdatePreview();
                    this.updateClothingMap();
                    this.updateProgress();
                    this.updateGenderVisibility();
                    try { Storage.autoSave(appState.formData); } catch (e) {}
                };

                el.addEventListener('change', handler);
                el.addEventListener('input', handler);
            }
        });
    },

    // Gestisce cambiamenti nel form
    handleFormChange() {
        Utils.debounce(() => {
            this.collectFormData();
            this.generateAndUpdatePreview();
            this.updateProgress();
            this.updateClothingMap();
            this.updateGenderVisibility();
            Storage.autoSave(appState.formData);
        }, CONFIG.DEBOUNCE_DELAY);
    },

    // Raccoglie dati dal form
    collectFormData() {
        const formData = {};
        const inputs = document.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input.type === 'number') {
                formData[input.id] = parseInt(input.value) || 0;
            } else if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        });

        appState.formData = formData;
        return formData;
    },

    // Map flat form data (DOM ids) to nested structure expected by PromptGenerator
    mapToNested(flat) {
        if (!flat || typeof flat !== 'object') return {};

        const identity = {
            age: flat.age || undefined,
            gender: flat.gender || undefined,
            ethnicity: flat.ethnicity || undefined,
            profession: flat.profession || undefined
        };

        const appearance = {
            bodyType: flat.build || undefined,
            height: flat.height || undefined,
            hairColor: flat.hairColor || undefined,
            hairStyle: flat.hairStyle || undefined,
            hairLength: flat.hairLength || undefined,
            hairTexture: flat.hairTexture || undefined,
            eyeColor: flat.eyeColor || undefined,
            skinTone: flat.skinTone || undefined
        };

        // Build accessories string
        const accessoriesParts = [];
        if (flat.headwear && flat.headwear !== 'none') accessoriesParts.push(flat.headwear);
        if (flat.hairAccessories && flat.hairAccessories !== 'none') accessoriesParts.push(flat.hairAccessories);
        if (flat.faceAccessories && flat.faceAccessories !== 'none') accessoriesParts.push(flat.faceAccessories);
        if (flat.earrings && flat.earrings !== 'none') accessoriesParts.push(flat.earrings);
        if (flat.neckwear && flat.neckwear !== 'none') accessoriesParts.push(flat.neckwear);

        // Torso logic: prefer explicit torsoGarment, otherwise infer from bottomsType=dress
        let torsoVal = undefined;
        if (flat.torsoGarment && flat.torsoGarment !== 'none') {
            torsoVal = flat.torsoGarment;
        } else if (flat.bottomsType === 'dress') {
            // If bottomsStyle indicates maxi, prefer 'maxi dress' to match promptGenerator checks
            torsoVal = (flat.bottomsStyle === 'maxi') ? 'maxi dress' : 'dress';
        }

        const clothing = {
            torso: torsoVal,
            torsoColor: flat.primaryColor || undefined,
            torsoCoversLower: !!flat.torsoCoversLower,
            lower: (flat.bottomsType && flat.bottomsType !== 'dress') ? (flat.bottomsStyle ? `${flat.bottomsStyle} ${flat.bottomsType}` : flat.bottomsType) : undefined,
            lowerColor: flat.secondaryColor || undefined,
            footwear: flat.shoeType || undefined,
            footwearColor: flat.primaryColor || undefined,
            accessories: accessoriesParts.length > 0 ? accessoriesParts.join(', ') : undefined
        };

        const scene = {
            location: flat.location || undefined,
            time: flat.time || undefined,
            weather: flat.weather || undefined,
            mood: flat.mood || undefined,
            lighting: flat.lighting || undefined,
            background: flat.photographyStyle || undefined
        };

        return {
            identity,
            appearance,
            clothing,
            scene
        };
    },

    // Genera e aggiorna preview
    generateAndUpdatePreview() {
        try {
            // PromptGenerator expects a nested structure; keep flat appState.formData for UI but convert here
            const nested = this.mapToNested(appState.formData || {});
            const result = PromptGenerator.generate(nested);
            const prompt = (result && result.prompt) ? result.prompt : '';

            // Update preview
            const previewElement = document.getElementById('promptPreview');
            if (!previewElement) return;

            if (prompt && prompt.trim() && !prompt.includes('Compila il form')) {
                previewElement.textContent = prompt;
                previewElement.classList.remove('text-white/50', 'italic');
            } else {
                previewElement.innerHTML = '<span class="text-white/50 italic">Please fill the form to see the prompt preview...</span>';
            }

            // Update stats using the new module's metadata
            const charCountEl = document.getElementById('charCount');
            const complexityEl = document.getElementById('complexityLevel');
            if (charCountEl && typeof result.characterCount !== 'undefined') charCountEl.textContent = result.characterCount;
            if (complexityEl) complexityEl.textContent = result.complexity === 'simple' ? 'Bassa' : (result.complexity === 'medium' ? 'Media' : 'Alta');

            // Update progress color based on character count
            const progressElement = document.getElementById('charCount');
            if (progressElement && typeof result.characterCount !== 'undefined') {
                if (result.characterCount > CONFIG.MAX_CHARACTERS) {
                    progressElement.classList.add('text-red-400');
                } else if (result.characterCount > CONFIG.MAX_CHARACTERS * 0.8) {
                    progressElement.classList.add('text-yellow-400');
                } else {
                    progressElement.classList.remove('text-red-400', 'text-yellow-400');
                }
            }
        } catch (err) {
            console.error('generateAndUpdatePreview failed:', err);
            const previewElement = document.getElementById('promptPreview');
            if (previewElement) previewElement.innerHTML = '<span class="text-red-400">Errore generazione anteprima</span>';
        }
    },

    // Aggiorna progress bar
    updateProgress() {
        const requiredFields = ['age', 'gender', 'height', 'build', 'hairColor', 'skinTone'];
        const filledFields = requiredFields.filter(field => 
            appState.formData[field] && appState.formData[field] !== ''
        ).length;
        
        const progress = Math.round((filledFields / requiredFields.length) * 100);
        
        document.getElementById('progressBar').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${progress}%`;
    },

    // Aggiorna mappa clothing
    updateClothingMap() {
        const mapElements = {
            mapHead: this.getHeadDescription(),
            mapUpper: this.getUpperDescription(),
            mapTorso: this.getTorsoDescription(),
            mapLower: this.getLowerDescription(),
            mapLegs: this.getLegsDescription(),
            mapFeet: this.getFeetDescription()
        };        Object.entries(mapElements).forEach(([elementId, description]) => {
            const element = document.getElementById(elementId);
            const span = element.querySelector('span:last-child');
            
            if (description) {
                span.textContent = description;
                span.classList.remove('text-white/60');
                span.classList.add('text-white');
                element.classList.add('has-item');
            } else {
                span.textContent = 'Nessuno';
                span.classList.add('text-white/60');
                span.classList.remove('text-white');
                element.classList.remove('has-item');
            }
        });
    },

    // Descrizioni per mappa clothing
    getHeadDescription() {
        const parts = [];
        if (appState.formData.headwear && appState.formData.headwear !== 'none') {
            parts.push(appState.formData.headwear);
        }
        if (appState.formData.faceAccessories && appState.formData.faceAccessories !== 'none') {
            parts.push(appState.formData.faceAccessories);
        }
        return parts.join(', ') || null;
    },

    getUpperDescription() {
        const parts = [];
        if (appState.formData.intimate && appState.formData.intimate !== 'none') {
            parts.push(appState.formData.intimate);
        }
        if (appState.formData.upperBodyMain && appState.formData.upperBodyMain !== 'none') {
            parts.push(appState.formData.upperBodyMain);
        }
        if (appState.formData.outerwear && appState.formData.outerwear !== 'none') {
            parts.push(appState.formData.outerwear);
        }
        return parts.join(', ') || null;
    },

    getTorsoDescription() {
        if (appState.formData.torsoGarment && appState.formData.torsoGarment !== 'none') {
            let desc = appState.formData.torsoGarment;
            if (appState.formData.torsoStyle) {
                desc = `${appState.formData.torsoStyle} ${desc}`;
            }
            if (appState.formData.torsoLength) {
                desc += ` (${appState.formData.torsoLength})`;
            }
            return desc;
        }

        // Fallback for backwards compatibility with old dress logic
        // Controlled by user setting `torsoCoversLower` (default true in UI)
        if (appState.formData.torsoCoversLower && appState.formData.bottomsType === 'dress') {
            return `${appState.formData.bottomsStyle || ''} dress`.trim();
        }

        return null;
    },

    getLowerDescription() {
        const parts = [];
        if (appState.formData.bottomsType && appState.formData.bottomsType !== 'none' && appState.formData.bottomsType !== 'dress') {
            parts.push(appState.formData.bottomsType);
        }
        if (appState.formData.intimateLower && appState.formData.intimateLower !== 'none') {
            parts.push(appState.formData.intimateLower);
        }
        return parts.join(', ') || null;
    },

    getLegsDescription() {
        if (appState.formData.legwear && appState.formData.legwear !== 'none') {
            return `${appState.formData.legwearStyle || ''} ${appState.formData.legwear}`.trim();
        }
        return null;
    },

    getFeetDescription() {
        if (appState.formData.shoeType && appState.formData.shoeType !== 'none') {
            return `${appState.formData.shoeType} ${appState.formData.heelHeight || ''}`.trim();
        }
        return null;
    },

    // Gestisce visibilità opzioni femminili
    updateGenderVisibility() {
        const femaleOptions = document.getElementById('femaleOptions');
        const isFemale = appState.formData.gender === 'female';
        
        if (femaleOptions) {
            femaleOptions.style.display = isFemale ? 'block' : 'none';
        }
    },

    // Setup azioni
    setupActionButtons() {
        // Copy button
        document.getElementById('copyBtn').addEventListener('click', async () => {
            const prompt = document.getElementById('promptPreview').textContent;
            if (prompt && !prompt.includes('Please fill the form')) {
                const success = await Utils.copyToClipboard(prompt);
                if (success) {
                    this.showToast('Prompt copiato negli appunti!', 'success');
                }
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            const prompt = document.getElementById('promptPreview').textContent;
            if (prompt && !prompt.includes('Please fill the form')) {
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                Utils.downloadFile(prompt, `prompt_${timestamp}.txt`);
                this.showToast('Prompt esportato!', 'success');
            }
        });

        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveCurrentPrompt();
        });

        // Random button
        document.getElementById('randomBtn').addEventListener('click', () => {
            this.applyRandomPreset();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearForm();
        });

        // Load saved button
        document.getElementById('loadSavedBtn').addEventListener('click', () => {
            this.showSavedPromptsModal();
        });

        // Sync prompts button
        document.getElementById('syncPromptsBtn').addEventListener('click', () => {
            this.syncPrompts();
        });

        // Sidebar toggle (collapse/expand)
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                if (!sidebar) return;
                const isHidden = sidebar.classList.toggle('hidden');
                // update icon
                const icon = sidebarToggle.querySelector('i');
                if (icon) {
                    icon.className = isHidden ? 'fas fa-sliders-h' : 'fas fa-sliders-h';
                }
            });
        }
    },

    // Setup presets
    setupPresets() {
        // Preset selector (native) - kept for logic/accessibility

        document.getElementById('presetSelector').addEventListener('change', (e) => {
        if (e.target.value) {
                    this.applyPreset(e.target.value);
                    e.target.value = ''; // Reset selector
            }
        });
        const nativeSelect = document.getElementById('presetSelector');
        if (nativeSelect) {
            nativeSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.applyPreset(e.target.value);
                    e.target.value = ''; // Reset selector
                }
            });

            // Build custom dropdown from native select options (if element exists)
            const dropdown = document.getElementById('presetDropdown');
            if (dropdown) {
                try {
                    const list = dropdown.querySelector('.custom-select-list');
                    const toggle = dropdown.querySelector('.custom-select-toggle');

                // populate options
                Array.from(nativeSelect.options).forEach(opt => {
                    if (!opt.value) return; // skip empty placeholder
                    const li = document.createElement('li');
                    li.setAttribute('role', 'option');
                    li.dataset.value = opt.value;
                    li.textContent = opt.text;
                    list.appendChild(li);
                });

                // open/close with positioning to avoid stacking-context issues
                const positionList = () => {
                    const rect = toggle.getBoundingClientRect();
                    // position list as fixed so it escapes any ancestor stacking context
                    list.style.position = 'fixed';
                    list.style.top = `${rect.bottom + window.scrollY}px`;
                    list.style.left = `${rect.left + window.scrollX}px`;
                    list.style.minWidth = `${rect.width}px`;
                    list.style.right = 'auto';
                    list.style.zIndex = '9999';
                };

                const setExpanded = (v) => {
                    dropdown.setAttribute('aria-expanded', String(v));
                    if (v) {
                        positionList();
                        list.hidden = false;
                        // reposition on scroll/resize while open
                        window.addEventListener('scroll', positionList);
                        window.addEventListener('resize', positionList);
                    } else {
                        list.hidden = true;
                        window.removeEventListener('scroll', positionList);
                        window.removeEventListener('resize', positionList);
                    }
                };

                toggle.addEventListener('click', (ev) => {
                    const expanded = dropdown.getAttribute('aria-expanded') === 'true';
                    setExpanded(!expanded);
                });

                // option click
                list.addEventListener('click', (ev) => {
                    const li = ev.target.closest('li');
                    if (!li) return;
                    const val = li.dataset.value;
                    // sync to native select and fire change
                    nativeSelect.value = val;
                    nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    // update label
                    toggle.querySelector('#presetDropdownLabel').textContent = li.textContent;
                    setExpanded(false);
                });

                // keyboard support
                dropdown.addEventListener('keydown', (ev) => {
                    if (ev.key === 'Escape') setExpanded(false);
                    if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        const expanded = dropdown.getAttribute('aria-expanded') === 'true';
                        setExpanded(!expanded);
                    }
                });

                // close on outside click
                document.addEventListener('click', (ev) => {
                    if (!dropdown.contains(ev.target)) setExpanded(false);
                });
                } catch (err) {
                    console.warn('Custom preset dropdown failed to initialize', err);
                }
            }
        }

        // Quick preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                this.applyPreset(preset);
            });
        });
    },

    // Applica preset
    applyPreset(presetName) {
        const preset = OUTFIT_DATABASE.presets[presetName];
        if (!preset) return;

        // Apply preset data to form
        Object.entries(preset).forEach(([key, value]) => {
            if (key === 'name') return; // Skip name
            
            const element = document.getElementById(key);
            if (element) {
                element.value = value;
            }
        });

        // Update app state and UI
        this.handleFormChange();
        this.showToast(`Preset "${preset.name}" applicato!`, 'success');
    },

    // Applica preset casuale
    applyRandomPreset() {
        const presetNames = Object.keys(OUTFIT_DATABASE.presets);
        const randomPreset = presetNames[Math.floor(Math.random() * presetNames.length)];
        this.applyPreset(randomPreset);
    },

    // Pulisce form
    clearForm() {
        if (confirm('Sei sicuro di voler cancellare tutti i dati?')) {
            document.querySelectorAll('input, select').forEach(element => {
                if (element.type === 'number') {
                    element.value = element.id === 'age' ? '24' : '0';
                } else {
                    element.selectedIndex = 0;
                }
            });
            
            appState.formData = {};
            this.handleFormChange();
            Storage.clear();
            this.showToast('Form pulito!', 'info');
        }
    },

    // Salva prompt corrente
    async saveCurrentPrompt() {
        const prompt = document.getElementById('promptPreview').textContent;
        if (!prompt || prompt.includes('Please fill the form')) {
            this.showToast('Nessun prompt da salvare', 'warning');
            return;
        }

        // Show title modal
        this.showTitleModal(prompt);
    },

    // Show title modal for prompt saving
    showTitleModal(prompt) {
        const modal = document.getElementById('titleModal');
        const titleInput = document.getElementById('promptTitle');
        const confirmBtn = document.getElementById('confirmSave');
        const cancelBtn = document.getElementById('cancelSave');
        const closeBtn = document.getElementById('closeTitleModal');

        // Pre-fill with prompt preview
        titleInput.value = prompt.substring(0, 50) + (prompt.length > 50 ? '...' : '');
        titleInput.focus();
        titleInput.select();

        // Show modal
        modal.classList.remove('hidden');

        // Handle save confirmation
        const handleSave = async () => {
            const name = titleInput.value.trim() || (prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''));
            
            const payload = {
                name: name,
                prompt: prompt,
                form_data: appState.formData
            };

            // Try saving to server first using ApiClient
            try {
                const result = await ApiClient.savePrompt(payload);
                if (result.success) {
                    // Save returned id into local copy for consistency
                    const savedLocal = Storage.load() || {};
                    if (!Array.isArray(savedLocal.prompts)) savedLocal.prompts = [];
                    savedLocal.prompts.unshift({
                        id: String(result.id),
                        name: name,
                        prompt: prompt,
                        formData: appState.formData,
                        timestamp: new Date().toISOString()
                    });
                    Storage.save(savedLocal);
                    this.updateSavedPromptsList();
                    this.showToast('Prompt salvato sul server!', 'success');
                } else {
                    throw new Error(result.error || 'Server save failed');
                }
            } catch (err) {
                console.warn('Server save failed, falling back to localStorage:', err);
                Storage.savePrompt({ name: name, prompt: prompt, formData: appState.formData });
                this.updateSavedPromptsList();
                this.showToast('Server non disponibile: salvato localmente', 'warning');
            }

            this.closeTitleModal();
        };

        // Handle cancel
        const handleCancel = () => {
            this.closeTitleModal();
        };

        // Add event listeners
        confirmBtn.addEventListener('click', handleSave, { once: true });
        cancelBtn.addEventListener('click', handleCancel, { once: true });
        closeBtn.addEventListener('click', handleCancel, { once: true });

        // Handle Enter key
        titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSave();
            }
        }, { once: true });

        // Handle Escape key
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        }, { once: true });
    },

    // Close title modal
    closeTitleModal() {
        const modal = document.getElementById('titleModal');
        modal.classList.add('hidden');
    },

    // Auto-save
    loadAutoSave() {
        const autoSaved = Storage.loadAutoSave();
        if (autoSaved) {
            Object.entries(autoSaved).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = value;
                }
            });
            this.handleFormChange();
        }
    },

    // Aggiorna lista prompt salvati
    updateSavedPromptsList() {
        const savedPrompts = Storage.getSavedPrompts();
        const container = document.getElementById('savedPrompts');
        
        if (savedPrompts.length === 0) {
            container.innerHTML = '<div class="text-white/50 italic text-center py-4">Nessun prompt salvato</div>';
            return;
        }
        
        container.innerHTML = savedPrompts.slice(0, 3).map(prompt => `
            <div class="glass p-3 rounded-lg flex items-center justify-between">
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate">${prompt.name}</div>
                    <div class="text-xs text-white/60">${new Date(prompt.timestamp).toLocaleDateString()}</div>
                </div>
                <div class="flex space-x-2 ml-2">
                    <button class="btn-secondary px-2 py-1 rounded text-xs load-prompt-btn" data-id="${prompt.id}">
                        <i class="fas fa-upload"></i>
                    </button>
                    <button class="btn-secondary px-2 py-1 rounded text-xs delete-prompt-btn" data-id="${prompt.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        if (savedPrompts.length > 3) {
            container.innerHTML += `
                <button id="viewAllBtn" class="btn-secondary w-full p-2 rounded-lg text-sm">
                    + Visualizza tutti (${savedPrompts.length})
                </button>
            `;
            document.getElementById('viewAllBtn').addEventListener('click', () => {
                this.showSavedPromptsModal();
            });
        }
        
        // Add event listeners
        container.querySelectorAll('.load-prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadPrompt(btn.dataset.id);
            });
        });
        
        container.querySelectorAll('.delete-prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.deletePrompt(btn.dataset.id);
            });
        });
    },

    // Carica prompt
    loadPrompt(id) {
        const savedPrompts = Storage.getSavedPrompts();
        const prompt = savedPrompts.find(p => p.id === id);
        
        if (prompt && prompt.formData) {
            Object.entries(prompt.formData).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = value;
                }
            });
            
            this.handleFormChange();
            this.showToast('Prompt caricato!', 'success');
        }
    },

    // Elimina prompt
    deletePrompt(id) {
        if (confirm('Sei sicuro di voler eliminare questo prompt?')) {
            Storage.deletePrompt(id);
            this.updateSavedPromptsList();
            this.showToast('Prompt eliminato!', 'info');
        }
    },

    // Setup modals
    setupModals() {
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('savedPromptsModal').classList.add('hidden');
        });
        
        document.getElementById('savedPromptsModal').addEventListener('click', (e) => {
            if (e.target.id === 'savedPromptsModal') {
                document.getElementById('savedPromptsModal').classList.add('hidden');
            }
        });
    },

    // Sync prompts with server
    async syncPrompts() {
        const syncBtn = document.getElementById('syncPromptsBtn');
        const originalIcon = syncBtn.querySelector('i').className;
        
        // Show loading state
        syncBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
        syncBtn.disabled = true;
        
        try {
            // Check server health first
            const healthCheck = await ApiClient.checkHealth();
            if (!healthCheck.success) {
                throw new Error('Server non disponibile');
            }

            // Get local prompts
            const localData = Storage.load();
            const localPrompts = localData?.prompts || [];
            
            // Get server prompts
            const serverResponse = await ApiClient.getPrompts();
            if (!serverResponse.success) {
                throw new Error('Impossibile recuperare prompt dal server');
            }
            
            const serverPrompts = serverResponse.prompts || [];
            
            // Merge prompts (server prompts take precedence, then local-only prompts)
            const mergedPrompts = [];
            const serverIds = new Set(serverPrompts.map(p => p.id));
            
            // Add all server prompts
            mergedPrompts.push(...serverPrompts);
            
            // Add local prompts that don't exist on server
            const localOnlyPrompts = localPrompts.filter(p => !serverIds.has(p.id));
            
            // Try to upload local-only prompts to server
            for (const localPrompt of localOnlyPrompts) {
                try {
                    const uploadResult = await ApiClient.savePrompt({
                        name: localPrompt.name,
                        prompt: localPrompt.prompt,
                        form_data: localPrompt.formData
                    });
                    
                    if (uploadResult.success) {
                        // Update local prompt with server ID
                        localPrompt.id = String(uploadResult.id);
                        mergedPrompts.push(localPrompt);
                    } else {
                        // Keep local prompt if upload fails
                        mergedPrompts.push(localPrompt);
                    }
                } catch (err) {
                    console.warn('Failed to upload local prompt:', localPrompt.name, err);
                    // Keep local prompt if upload fails
                    mergedPrompts.push(localPrompt);
                }
            }
            
            // Sort by timestamp (newest first)
            mergedPrompts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Update local storage with merged data
            Storage.save({ prompts: mergedPrompts });
            
            // Update UI
            this.updateSavedPromptsList();
            
            this.showToast('Sincronizzazione completata!', 'success');
            
        } catch (err) {
            console.error('Sync failed:', err);
            this.showToast(`Errore sincronizzazione: ${err.message}`, 'error');
        } finally {
            // Restore button state
            syncBtn.querySelector('i').className = originalIcon;
            syncBtn.disabled = false;
        }
    },

    // Mostra modal prompt salvati
    showSavedPromptsModal() {
        const savedPrompts = Storage.getSavedPrompts();
        const modalList = document.getElementById('modalPromptsList');
        
        if (savedPrompts.length === 0) {
            modalList.innerHTML = '<div class="text-white/50 italic text-center py-8">Nessun prompt salvato</div>';
        } else {
            modalList.innerHTML = savedPrompts.map(prompt => `
                <div class="glass p-4 rounded-lg">
                    <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-medium mb-2">${prompt.name}</h4>
                            <p class="text-sm text-white/70 mb-2 line-clamp-2">${prompt.prompt}</p>
                            <div class="text-xs text-white/50">${new Date(prompt.timestamp).toLocaleString()}</div>
                        </div>
                        <div class="flex space-x-2 ml-4">
                            <button class="btn-secondary px-3 py-2 rounded-lg text-sm load-prompt-btn" data-id="${prompt.id}">
                                <i class="fas fa-upload mr-1"></i>Carica
                            </button>
                            <button class="btn-secondary px-3 py-2 rounded-lg text-sm delete-prompt-btn" data-id="${prompt.id}">
                                <i class="fas fa-trash mr-1"></i>Elimina
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners
            modalList.querySelectorAll('.load-prompt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.loadPrompt(btn.dataset.id);
                    document.getElementById('savedPromptsModal').classList.add('hidden');
                });
            });
            
            modalList.querySelectorAll('.delete-prompt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.deletePrompt(btn.dataset.id);
                    this.showSavedPromptsModal(); // Refresh modal
                });
            });
        }
        
        document.getElementById('savedPromptsModal').classList.remove('hidden');
    },

    // Mostra toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `glass p-4 rounded-lg text-white flex items-center space-x-3 fade-in`;
        
        const icons = {
            success: 'fas fa-check-circle text-green-400',
            error: 'fas fa-exclamation-circle text-red-400',
            warning: 'fas fa-exclamation-triangle text-yellow-400',
            info: 'fas fa-info-circle text-blue-400'
        };
        
        toast.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
};

// -----------------------------------------------------------------------------
// INIZIALIZZAZIONE APPLICAZIONE
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Image Prompt Builder v' + CONFIG.VERSION);
    
    // Inizializza interfaccia
    UI.init();
    
    // Set default values
    document.getElementById('age').value = '24';
    document.getElementById('height').value = '170cm';
    document.getElementById('build').value = 'athletic';
    document.getElementById('gender').value = 'female';
    document.getElementById('hairColor').value = 'red';
    document.getElementById('hairLength').value = 'long';
    document.getElementById('hairStyle').value = 'wavy';
    document.getElementById('skinTone').value = 'fair';
    document.getElementById('eyeColor').value = 'green';
    document.getElementById('braCup').value = 'C';
    document.getElementById('intimate').value = 'bra';
    document.getElementById('primaryColor').value = 'black';
    document.getElementById('secondaryColor').value = 'emerald';
    document.getElementById('fabrics').value = 'lace';
    document.getElementById('intimateLower').value = 'panties';
    document.getElementById('legwear').value = 'stockings';
    document.getElementById('legwearStyle').value = 'sheer';
    document.getElementById('shoeType').value = 'heels';
    document.getElementById('earrings').value = 'dangling';
    document.getElementById('neckwear').value = 'necklace';
    document.getElementById('overallStyle').value = 'lingerie';
    document.getElementById('location').value = 'near-window';
    document.getElementById('lighting').value = 'natural';
    document.getElementById('photographyStyle').value = 'cinematic';
    document.getElementById('shotType').value = 'full-body';
    document.getElementById('pose').value = 'standing';
    document.getElementById('mood').value = 'elegant';
    
    // Initial form processing
    UI.handleFormChange();
    
    console.log('✅ Applicazione inizializzata con successo');
});

// Gestione errori globali
window.addEventListener('error', (e) => {
    console.error('Errore globale:', e.error);
    UI.showToast('Si è verificato un errore', 'error');
});

// Esporta per debugging
window.PromptBuilder = {
    appState,
    Utils,
    Storage,
    PromptGenerator,
    UI,
    CONFIG,
    OUTFIT_DATABASE
};
