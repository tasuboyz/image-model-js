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

    // Genera ID univoco
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

// -----------------------------------------------------------------------------
// GESTIONE STORAGE
// -----------------------------------------------------------------------------

const Storage = {
    // Salva dati nel localStorage
    save(data) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            return false;
        }
    },

    // Carica dati dal localStorage
    load() {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Errore nel caricamento:', error);
            return null;
        }
    },

    // Pulisce il storage
    clear() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Errore nella pulizia:', error);
            return false;
        }
    },

    // Salva prompt
    savePrompt(promptData) {
    const saved = this.load() || {};
    if (!Array.isArray(saved.prompts)) saved.prompts = [];
        const newPrompt = {
            id: Utils.generateId(),
            name: promptData.name || `Prompt ${saved.prompts.length + 1}`,
            prompt: promptData.prompt,
            formData: promptData.formData,
            timestamp: new Date().toISOString()
        };
        
    saved.prompts.unshift(newPrompt);
        
        // Mantieni solo gli ultimi 20 prompt
        if (saved.prompts.length > 20) {
            saved.prompts = saved.prompts.slice(0, 20);
        }
        
        this.save(saved);
        return newPrompt;
    },

    // Sincronizza i prompt dal server e li salva nel localStorage
    async syncFromServer() {
        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/prompts/saved`);
            if (!res.ok) throw new Error('Server returned ' + res.status);
            const data = await res.json();
            if (data && data.success && Array.isArray(data.prompts)) {
                // Trasforma il payload nel formato locale
                const saved = { prompts: data.prompts.map(p => ({
                    id: String(p.id),
                    name: p.name,
                    prompt: p.prompt,
                    formData: p.form_data || p.formData || {},
                    timestamp: p.created_at || p.timestamp || new Date().toISOString()
                })) };

                // Mantieni massimo 50 lato client
                saved.prompts = saved.prompts.slice(0, 50);
                this.save(saved);
                return saved.prompts;
            }
            return null;
        } catch (err) {
            console.warn('Failed to sync prompts from server:', err);
            return null;
        }
    },

    // Carica prompt salvati
    getSavedPrompts() {
        const saved = this.load();
        return saved?.prompts || [];
    },

    // Elimina prompt
    deletePrompt(id) {
        const saved = this.load();
        if (saved?.prompts) {
            saved.prompts = saved.prompts.filter(p => p.id !== id);
            this.save(saved);
            return true;
        }
        return false;
    },

    // Auto-save del form corrente
    autoSave(formData) {
        const saved = this.load() || {};
        saved.currentForm = formData;
        this.save(saved);
    },

    // Carica auto-save
    loadAutoSave() {
        const saved = this.load();
        return saved?.currentForm || null;
    }
};

// -----------------------------------------------------------------------------
// GENERATORE DI PROMPT
// -----------------------------------------------------------------------------

const PromptGenerator = {
    // Genera prompt completo
    generate(formData) {
        const parts = [];
        
        // 1. Identità base
        parts.push(this.generateIdentity(formData));
        
        // 2. Aspetto fisico
        parts.push(this.generateAppearance(formData));
        
        // 3. Outfit (head-to-toe)
        const outfitParts = this.generateOutfit(formData);
        if (outfitParts.length > 0) {
            parts.push(`wearing ${outfitParts.join(', ')}`);
        }
        
        // 4. Scena e fotografia
        parts.push(this.generateScene(formData));
        
        // Unisci tutto
        return parts.filter(p => p.trim()).join(', ') + '.';
    },

    // Genera parte identità
    generateIdentity(data) {
        const parts = [];
        
        // Genere e età
        const gender = data.gender === 'female' ? 'Woman' : 
                      data.gender === 'male' ? 'Man' : 'Person';
        
        if (data.age) {
            parts.push(`${gender}, ${data.age} years old`);
        } else {
            parts.push(gender);
        }
        
        // Altezza e costituzione
        if (data.height) {
            parts.push(`height ${data.height}`);
        }
        
        if (data.build) {
            const buildMap = {
                'slim': 'slim build',
                'athletic': 'athletic build with toned abs and long legs',
                'curvy': 'curvy figure with natural curves',
                'muscular': 'muscular build',
                'average': 'average build'
            };
            parts.push(buildMap[data.build] || `${data.build} build`);
        }
        
        // Dettagli femminili
        if (data.gender === 'female') {
            if (data.braCup && data.bustSize) {
                const bustMap = {
                    'petite': 'petite bust',
                    'average': 'average bust',
                    'full': 'full bust',
                    'very-full': 'very full bust'
                };
                parts.push(`${data.braCup}-cup ${bustMap[data.bustSize] || 'bust'}`);
            }
        }
        
        return parts.join(', ');
    },

    // Genera aspetto fisico
    generateAppearance(data) {
        const parts = [];
        
        // Capelli
        const hairParts = [];
        if (data.hairLength && data.hairStyle && data.hairColor) {
            const hairMap = {
                'pixie': 'pixie cut',
                'short': 'short',
                'shoulder': 'shoulder-length',
                'long': 'long',
                'very-long': 'very long'
            };
            
            const styleMap = {
                'straight': 'straight',
                'wavy': 'wavy',
                'curly': 'curly',
                'braided': 'braided',
                'updo': 'styled in an updo',
                'ponytail': 'in a ponytail'
            };
            
            const colorMap = {
                'blonde': 'blonde',
                'brunette': 'brunette',
                'black': 'black',
                'red': 'auburn',
                'gray': 'gray',
                'silver': 'silver'
            };
            
            hairParts.push(hairMap[data.hairLength] || data.hairLength);
            hairParts.push(styleMap[data.hairStyle] || data.hairStyle);
            hairParts.push(colorMap[data.hairColor] || data.hairColor);
            
            parts.push(`${hairParts.join(', ')} hair`);
        }
        
        // Pelle e occhi
        if (data.skinTone) {
            const skinMap = {
                'pale': 'pale skin',
                'fair': 'fair skin with warm undertones',
                'medium': 'medium skin tone',
                'olive': 'olive skin',
                'tan': 'tanned skin',
                'dark': 'dark skin'
            };
            parts.push(skinMap[data.skinTone] || `${data.skinTone} skin`);
        }
        
        if (data.eyeColor) {
            parts.push(`${data.eyeColor} eyes`);
        }
        
        return parts.join(', ');
    },

    // Genera outfit (head-to-toe)
    generateOutfit(data) {
        const outfitParts = [];
        
        // Head accessories
        if (data.headwear && data.headwear !== 'none') {
            outfitParts.push(data.headwear);
        }
        
        if (data.faceAccessories && data.faceAccessories !== 'none') {
            outfitParts.push(data.faceAccessories);
        }
        
        // Jewelry
        if (data.earrings && data.earrings !== 'none') {
            const earringMap = {
                'studs': 'stud earrings',
                'hoops': 'hoop earrings',
                'dangling': 'dangling earrings'
            };
            outfitParts.push(earringMap[data.earrings] || data.earrings);
        }
        
        if (data.neckwear && data.neckwear !== 'none') {
            if (data.secondaryColor && data.secondaryColor !== 'none') {
                outfitParts.push(`${data.secondaryColor} ${data.neckwear}`);
            } else {
                outfitParts.push(data.neckwear);
            }
        }
        
        // Upper body - Intimate first
        if (data.intimate && data.intimate !== 'none') {
            let intimateDesc = '';
            
            if (data.primaryColor) {
                intimateDesc += `${data.primaryColor} `;
            }
            
            if (data.fabrics && data.fabrics !== 'none') {
                intimateDesc += `${data.fabrics} `;
            }
            
            if (data.intimate === 'bra') {
                intimateDesc += 'balconette bra';
                
                if (data.secondaryColor && data.secondaryColor !== 'none') {
                    intimateDesc += ` with ${data.secondaryColor} centerpiece`;
                }
            } else {
                intimateDesc += data.intimate;
            }
            
            outfitParts.push(intimateDesc);
        }
        
        // Torso / Full body garments (takes priority over separate pieces)
        if (data.torsoGarment && data.torsoGarment !== 'none') {
            let torsoDesc = '';
            
            if (data.primaryColor) {
                torsoDesc += `${data.primaryColor} `;
            }
            
            if (data.torsoStyle) {
                torsoDesc += `${data.torsoStyle} `;
            }
            
            if (data.torsoGarment === 'dress') {
                torsoDesc += 'dress';
            } else {
                torsoDesc += data.torsoGarment;
            }
            
            if (data.torsoLength) {
                torsoDesc += ` (${data.torsoLength})`;
            }
            
            outfitParts.push(torsoDesc);
        } else {
            // Upper body main (only if no torso garment)
            if (data.upperBodyMain && data.upperBodyMain !== 'none') {
                let upperDesc = '';
                
                if (data.primaryColor && data.intimate === 'none') {
                    upperDesc += `${data.primaryColor} `;
                }
                
                upperDesc += data.upperBodyMain;
                
                if (data.sleeves && data.sleeves !== 'sleeveless') {
                    upperDesc += ` with ${data.sleeves} sleeves`;
                }
                
                outfitParts.push(upperDesc);
            }
        }
        
        // Outerwear
        if (data.outerwear && data.outerwear !== 'none') {
            outfitParts.push(`${data.outerwear}`);
        }
        
        // Lower body (only if no full-body torso garment)
        if (!data.torsoGarment || data.torsoGarment === 'none') {
            if (data.bottomsType && data.bottomsType !== 'none') {
                let lowerDesc = '';
                
                if (data.primaryColor && !data.intimate) {
                    lowerDesc += `${data.primaryColor} `;
                }
                
                if (data.bottomsType === 'dress') {
                    lowerDesc += `${data.bottomsStyle || ''} dress`.trim();
                } else {
                    lowerDesc += data.bottomsType;
                    if (data.bottomsStyle) {
                        lowerDesc += ` (${data.bottomsStyle})`;
                    }
                }
                
                outfitParts.push(lowerDesc);
            }
        }
        
        // Lower intimate
        if (data.intimateLower && data.intimateLower !== 'none') {
            let intimateLowerDesc = '';
            
            if (data.primaryColor) {
                intimateLowerDesc += `matching ${data.primaryColor} `;
            }
            
            if (data.fabrics) {
                intimateLowerDesc += `${data.fabrics} `;
            }
            
            intimateLowerDesc += data.intimateLower;
            
            if (data.intimateLower === 'panties' && data.legwear === 'stockings') {
                intimateLowerDesc += ' with garter straps';
            }
            
            outfitParts.push(intimateLowerDesc);
        }
        
        // Legwear
        if (data.legwear && data.legwear !== 'none') {
            let legwearDesc = '';
            
            if (data.legwearStyle) {
                legwearDesc += `${data.legwearStyle} `;
            }
            
            if (data.primaryColor && data.legwearStyle === 'sheer') {
                legwearDesc += `${data.primaryColor} `;
            }
            
            legwearDesc += data.legwear;
            
            outfitParts.push(legwearDesc);
        }
        
        // Footwear
        if (data.shoeType && data.shoeType !== 'none') {
            let shoeDesc = '';
            
            if (data.primaryColor) {
                shoeDesc += `${data.primaryColor} `;
            }
            
            shoeDesc += data.shoeType;
            
            if (data.heelHeight && data.heelHeight !== 'flat') {
                const heelMap = {
                    'low': '(2")',
                    'medium': '(3")',
                    'high': '(4")',
                    'very-high': '(5")'
                };
                shoeDesc += ` ${heelMap[data.heelHeight] || ''}`;
            }
            
            outfitParts.push(shoeDesc);
        }
        
        return outfitParts;
    },

    // Genera scena e fotografia
    generateScene(data) {
        const parts = [];
        
        // Pose
        if (data.pose) {
            const poseMap = {
                'standing': 'standing',
                'sitting': 'sitting',
                'reclining': 'reclining',
                'walking': 'walking',
                'dynamic': 'in dynamic pose',
                'relaxed': 'in relaxed pose',
                'editorial': 'in editorial pose'
            };
            parts.push(poseMap[data.pose] || data.pose);
        }
        
        // Location
        if (data.location) {
            const locationMap = {
                'indoor-studio': 'in a studio',
                'near-window': 'near a window with soft daylight filtering in',
                'bedroom': 'in a bedroom',
                'outdoor-natural': 'in natural outdoor setting',
                'urban': 'in urban environment',
                'beach': 'on the beach',
                'forest': 'in the forest'
            };
            parts.push(locationMap[data.location] || data.location);
        }
        
        // Photography style
        const styleParts = [];
        
        if (data.photographyStyle) {
            styleParts.push(`${data.photographyStyle} photography`);
        }
        
        if (data.lighting) {
            const lightMap = {
                'natural': 'natural lighting',
                'studio': 'studio lighting',
                'golden-hour': 'golden hour lighting',
                'dramatic': 'dramatic lighting',
                'soft': 'warm soft lighting',
                'warm': 'warm lighting'
            };
            styleParts.push(lightMap[data.lighting] || `${data.lighting} lighting`);
        }
        
        if (data.shotType) {
            const shotMap = {
                'full-body': 'full body view',
                'three-quarter': '3/4 body shot',
                'half-body': 'half body shot',
                'bust': 'bust shot',
                'close-up': 'close-up',
                'face-only': 'face shot'
            };
            styleParts.push(shotMap[data.shotType] || data.shotType);
        }
        
        if (styleParts.length > 0) {
            parts.push(styleParts.join(', '));
        }
        
        return parts.join(', ');
    },

    // Calcola statistiche del prompt
    getStats(prompt) {
        const charCount = prompt.length;
        const complexity = this.calculateComplexity(prompt);
        const layers = this.countClothingLayers(prompt);
        
        return {
            characterCount: charCount,
            complexity: complexity,
            clothingLayers: layers,
            complexityLevel: complexity < 0.3 ? 'Bassa' : 
                           complexity < 0.7 ? 'Media' : 'Alta'
        };
    },

    // Calcola complessità (0-1)
    calculateComplexity(prompt) {
        const factors = [
            prompt.includes('with') ? 0.1 : 0,
            prompt.includes('wearing') ? 0.1 : 0,
            prompt.includes('lace') ? 0.1 : 0,
            prompt.includes('emerald') || prompt.includes('gold') ? 0.1 : 0,
            prompt.includes('centerpiece') ? 0.1 : 0,
            prompt.includes('matching') ? 0.1 : 0,
            prompt.includes('garter') ? 0.1 : 0,
            prompt.includes('fishnet') ? 0.1 : 0,
            prompt.includes('cinematic') || prompt.includes('dramatic') ? 0.1 : 0,
            prompt.length > 200 ? 0.1 : 0
        ];
        
        return Math.min(factors.reduce((a, b) => a + b, 0), 1);
    },

    // Conta layers dell'outfit
    countClothingLayers(prompt) {
        const layers = [
            prompt.includes('bra') || prompt.includes('corset'),
            prompt.includes('blouse') || prompt.includes('shirt') || prompt.includes('top'),
            prompt.includes('jacket') || prompt.includes('coat'),
            prompt.includes('panties') || prompt.includes('thong'),
            prompt.includes('pants') || prompt.includes('skirt') || prompt.includes('dress'),
            prompt.includes('stockings') || prompt.includes('tights'),
            prompt.includes('heels') || prompt.includes('shoes') || prompt.includes('boots')
        ];
        
        return layers.filter(Boolean).length;
    }
};

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
            Storage.syncFromServer().then((prompts) => {
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
                    // Debug: log the change event and new value
                    try { console.debug('TORSO CHANGE:', id, el.value); } catch (e) {}

                    // Force immediate update path (non-debounced) for troubleshooting
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
        
        // Lightweight debug: ensure torso values are collected
        // (removed in production) -- logs only when console is open
        try {
            console.debug('collectFormData torso:', {
                torsoGarment: formData.torsoGarment,
                torsoStyle: formData.torsoStyle,
                torsoLength: formData.torsoLength,
                neckline: formData.neckline
            });
        } catch (e) {}

        appState.formData = formData;
        return formData;
    },

    // Genera e aggiorna preview
    generateAndUpdatePreview() {
        const prompt = PromptGenerator.generate(appState.formData);
    try { console.debug('GENERATED PROMPT:', prompt); } catch (e) {}
        const stats = PromptGenerator.getStats(prompt);
        
        // Update preview
        const previewElement = document.getElementById('promptPreview');
        if (prompt.trim()) {
            previewElement.textContent = prompt;
            previewElement.classList.remove('text-white/50', 'italic');
        } else {
            previewElement.innerHTML = '<span class="text-white/50 italic">Compila il form per vedere l\'anteprima del prompt...</span>';
        }
        
        // Update stats
        document.getElementById('charCount').textContent = stats.characterCount;
        document.getElementById('complexityLevel').textContent = stats.complexityLevel;
        
        // Update progress color based on character count
        const progressElement = document.getElementById('charCount');
        if (stats.characterCount > CONFIG.MAX_CHARACTERS) {
            progressElement.classList.add('text-red-400');
        } else if (stats.characterCount > CONFIG.MAX_CHARACTERS * 0.8) {
            progressElement.classList.add('text-yellow-400');
        } else {
            progressElement.classList.remove('text-red-400', 'text-yellow-400');
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
        };
    try { console.debug('CLOTHING MAP DESCRIPTIONS:', mapElements); } catch (e) {}
        
        Object.entries(mapElements).forEach(([elementId, description]) => {
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
            if (prompt && !prompt.includes('Compila il form')) {
                const success = await Utils.copyToClipboard(prompt);
                if (success) {
                    this.showToast('Prompt copiato negli appunti!', 'success');
                }
            }
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            const prompt = document.getElementById('promptPreview').textContent;
            if (prompt && !prompt.includes('Compila il form')) {
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

            // Build custom dropdown from native select options
            try {
                const dropdown = document.getElementById('presetDropdown');
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
    saveCurrentPrompt() {
        const prompt = document.getElementById('promptPreview').textContent;
        if (!prompt || prompt.includes('Compila il form')) {
            this.showToast('Nessun prompt da salvare', 'warning');
            return;
        }

        // Ask user for a title
        let name = window.prompt('Inserisci un titolo per il prompt:', prompt.substring(0, 50));
        if (name === null) return; // cancelled
        name = name.trim() || (prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''));

        const payload = {
            name: name,
            prompt: prompt,
            form_data: appState.formData
        };

        // Try saving to server first
        fetch(`${CONFIG.API_BASE_URL}/prompts/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(data => {
            if (data && data.success) {
                // Save returned id into local copy for consistency
                const savedLocal = Storage.load() || {};
                if (!Array.isArray(savedLocal.prompts)) savedLocal.prompts = [];
                savedLocal.prompts.unshift({
                    id: String(data.id),
                    name: name,
                    prompt: prompt,
                    formData: appState.formData,
                    timestamp: new Date().toISOString()
                });
                Storage.save(savedLocal);
                this.updateSavedPromptsList();
                this.showToast('Prompt salvato sul server!', 'success');
            } else {
                throw new Error('Server save failed');
            }
        }).catch(err => {
            console.warn('Server save failed, falling back to localStorage:', err);
            Storage.savePrompt({ name: name, prompt: prompt, formData: appState.formData });
            this.updateSavedPromptsList();
            this.showToast('Server non disponibile: salvato localmente', 'warning');
        });
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
