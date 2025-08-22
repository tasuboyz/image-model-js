/**
 * I18n - Internationalization and value normalization helper
 * Handles translation and consistent formatting of form values
 */
export class I18n {
    constructor(locale = 'en') {
        this.locale = locale;
        this.translations = this._getTranslations();
        this.colorMap = this._getColorMap();
        this.valueNormalizations = this._getValueNormalizations();
    }

    /**
     * Get translation dictionaries
     * @private
     */
    _getTranslations() {
        return {
            en: {
                // Gender translations
                'female': 'female',
                'male': 'male',
                'non-binary': 'non-binary',
                
                // Ethnicity translations
                'caucasian': 'caucasian',
                'asian': 'asian',
                'african': 'african',
                'hispanic': 'hispanic',
                'middle-eastern': 'middle eastern',
                
                // Body types
                'slim': 'slim',
                'athletic': 'athletic',
                'curvy': 'curvy',
                'petite': 'petite',
                'plus-size': 'plus size',
                
                // Heights
                'short': 'short',
                'average': 'average height',
                'tall': 'tall',
                
                // Hair lengths
                'very-short': 'very short',
                'short': 'short',
                'medium': 'medium length',
                'long': 'long',
                'very-long': 'very long',
                
                // Hair styles
                'straight': 'straight',
                'wavy': 'wavy',
                'curly': 'curly',
                'braided': 'braided',
                'ponytail': 'ponytail',
                'bun': 'bun',
                
                // Clothing lengths
                'mini': 'mini',
                'short': 'short',
                'midi': 'midi',
                'long': 'long',
                'maxi': 'maxi',
                
                // Necklines
                'crew': 'crew neck',
                'v-neck': 'v-neck',
                'scoop': 'scoop neck',
                'off-shoulder': 'off-shoulder',
                'strapless': 'strapless',
                'halter': 'halter neck',
                
                // Poses
                'standing': 'standing',
                'sitting': 'sitting',
                'reclining': 'reclining',
                'walking': 'walking',
                'dynamic': 'dynamic pose',
                'relaxed': 'relaxed pose',
                'editorial': 'editorial pose',
                
                // Shot types
                'full-body': 'full body',
                'three-quarter': 'three quarter',
                'bust': 'bust shot',
                'close-up': 'close up',
                'face-only': 'face only'
            },
            it: {
                // Italian translations (example)
                'female': 'femmina',
                'male': 'maschio',
                'standing': 'in piedi',
                'sitting': 'seduta',
                // ... more Italian translations
            }
        };
    }

    /**
     * Get color mapping for consistent color names
     * @private
     */
    _getColorMap() {
        return {
            // Basic colors
            'white': 'white',
            'black': 'black',
            'red': 'red',
            'blue': 'blue',
            'green': 'green',
            'yellow': 'yellow',
            'pink': 'pink',
            'purple': 'purple',
            'brown': 'brown',
            'gray': 'gray',
            'grey': 'gray', // Normalize to gray
            
            // Extended colors
            'navy': 'navy blue',
            'maroon': 'maroon',
            'olive': 'olive',
            'lime': 'lime green',
            'aqua': 'aqua',
            'teal': 'teal',
            'silver': 'silver',
            'gold': 'gold',
            'orange': 'orange',
            'magenta': 'magenta',
            'cyan': 'cyan',
            
            // Skin tones
            'fair': 'fair',
            'light': 'light',
            'medium': 'medium',
            'tan': 'tan',
            'dark': 'dark',
            
            // Hair colors
            'blonde': 'blonde',
            'brunette': 'brown',
            'auburn': 'auburn',
            'ginger': 'red',
            'platinum': 'platinum blonde'
        };
    }

    /**
     * Get value normalization rules
     * @private
     */
    _getValueNormalizations() {
        return {
            // Convert various formats to standard format
            separators: {
                '-': ' ',
                '_': ' ',
                '.': ' '
            },
            
            // Common abbreviations
            abbreviations: {
                'prof': 'professional',
                'biz': 'business',
                'med': 'medical',
                'tech': 'technical',
                'mgmt': 'management'
            },
            
            // Clothing size normalizations
            sizes: {
                'xs': 'extra small',
                'sm': 'small',
                'md': 'medium',
                'lg': 'large',
                'xl': 'extra large',
                'xxl': 'extra extra large'
            }
        };
    }

    /**
     * Translate a value
     * @param {string} key - Key to translate
     * @param {string} locale - Target locale (optional)
     * @returns {string} Translated value
     */
    translate(key, locale = null) {
        const targetLocale = locale || this.locale;
        const translations = this.translations[targetLocale] || this.translations.en;
        
        // Normalize key
        const normalizedKey = this.normalizeValue(key, false);
        
        return translations[normalizedKey] || normalizedKey;
    }

    /**
     * Normalize a value for consistent output
     * @param {string} value - Value to normalize
     * @param {boolean} translate - Whether to apply translations
     * @returns {string} Normalized value
     */
    normalizeValue(value, translate = true) {
        if (!value || typeof value !== 'string') return '';
        
        let normalized = value.toLowerCase().trim();
        
        // Apply separator normalizations
        Object.entries(this.valueNormalizations.separators).forEach(([from, to]) => {
            normalized = normalized.replace(new RegExp(from, 'g'), to);
        });
        
        // Apply abbreviation expansions
        Object.entries(this.valueNormalizations.abbreviations).forEach(([abbr, full]) => {
            const regex = new RegExp(`\\b${abbr}\\b`, 'g');
            normalized = normalized.replace(regex, full);
        });
        
        // Apply size normalizations
        Object.entries(this.valueNormalizations.sizes).forEach(([size, full]) => {
            const regex = new RegExp(`\\b${size}\\b`, 'g');
            normalized = normalized.replace(regex, full);
        });
        
        // Normalize colors
        if (this.colorMap[normalized]) {
            normalized = this.colorMap[normalized];
        }
        
        // Clean up extra spaces
        normalized = normalized.replace(/\s+/g, ' ').trim();
        
        // Apply translations if requested
        if (translate) {
            normalized = this.translate(normalized);
        }
        
        return normalized;
    }

    /**
     * Normalize color specifically
     * @param {string} color - Color value
     * @returns {string} Normalized color name
     */
    normalizeColor(color) {
        if (!color) return '';
        
        const normalized = this.normalizeValue(color, false);
        return this.colorMap[normalized] || normalized;
    }

    /**
     * Format a list of values
     * @param {Array} values - Array of values
     * @param {string} conjunction - Conjunction word ('and', 'or')
     * @returns {string} Formatted list
     */
    formatList(values, conjunction = 'and') {
        if (!Array.isArray(values) || values.length === 0) return '';
        
        const normalizedValues = values
            .filter(Boolean)
            .map(v => this.normalizeValue(v));
        
        if (normalizedValues.length === 0) return '';
        if (normalizedValues.length === 1) return normalizedValues[0];
        if (normalizedValues.length === 2) {
            return `${normalizedValues[0]} ${conjunction} ${normalizedValues[1]}`;
        }
        
        const last = normalizedValues.pop();
        return `${normalizedValues.join(', ')}, ${conjunction} ${last}`;
    }

    /**
     * Format age with proper suffix
     * @param {number|string} age - Age value
     * @returns {string} Formatted age
     */
    formatAge(age) {
        if (!age) return '';
        
        const numAge = parseInt(age, 10);
        if (isNaN(numAge)) return age.toString();
        
        return `${numAge} years old`;
    }

    /**
     * Format height description
     * @param {string} height - Height value
     * @param {string} bodyType - Body type for context
     * @returns {string} Formatted height description
     */
    formatHeight(height, bodyType = '') {
        if (!height) return '';
        
        const normalizedHeight = this.normalizeValue(height);
        const normalizedBodyType = this.normalizeValue(bodyType);
        
        if (normalizedBodyType) {
            return `${normalizedHeight} ${normalizedBodyType}`;
        }
        
        return normalizedHeight;
    }

    /**
     * Format clothing item with color and attributes
     * @param {Object} item - Clothing item object
     * @returns {string} Formatted clothing description
     */
    formatClothingItem(item) {
        if (!item || !item.type) return '';
        
        const parts = [];
        
        if (item.color) {
            parts.push(this.normalizeColor(item.color));
        }
        
        if (item.length && item.type !== 'accessories') {
            parts.push(this.normalizeValue(item.length));
        }
        
        parts.push(this.normalizeValue(item.type));
        
        if (item.style) {
            parts.push(`with ${this.normalizeValue(item.style)}`);
        }
        
        if (item.attributes && Array.isArray(item.attributes)) {
            const attrs = item.attributes
                .filter(Boolean)
                .map(attr => this.normalizeValue(attr));
            if (attrs.length > 0) {
                parts.push(`(${attrs.join(', ')})`);
            }
        }
        
        return parts.join(' ');
    }

    /**
     * Get locale-specific formatting options
     * @returns {Object} Formatting options
     */
    getFormattingOptions() {
        return {
            locale: this.locale,
            dateFormat: this.locale === 'en' ? 'MM/DD/YYYY' : 'DD/MM/YYYY',
            numberFormat: this.locale === 'en' ? 'en-US' : this.locale,
            currency: this.locale === 'en' ? 'USD' : 'EUR'
        };
    }

    /**
     * Set locale
     * @param {string} locale - New locale
     */
    setLocale(locale) {
        this.locale = locale;
    }

    /**
     * Get available locales
     * @returns {Array<string>} Available locale codes
     */
    getAvailableLocales() {
        return Object.keys(this.translations);
    }

    /**
     * Add custom translations
     * @param {string} locale - Locale code
     * @param {Object} translations - Translation object
     */
    addTranslations(locale, translations) {
        if (!this.translations[locale]) {
            this.translations[locale] = {};
        }
        
        Object.assign(this.translations[locale], translations);
    }

    /**
     * Add custom color mappings
     * @param {Object} colors - Color mapping object
     */
    addColors(colors) {
        Object.assign(this.colorMap, colors);
    }

    /**
     * Validate and suggest corrections for common typos
     * @param {string} value - Input value
     * @param {string} category - Value category (color, clothing, etc.)
     * @returns {Object} Validation result with suggestions
     */
    validateAndSuggest(value, category = 'general') {
        if (!value) return { valid: true, suggestions: [] };
        
        const normalized = this.normalizeValue(value, false);
        const suggestions = [];
        
        // Check for close matches in relevant dictionaries
        let dictionary = [];
        
        switch (category) {
            case 'color':
                dictionary = Object.keys(this.colorMap);
                break;
            case 'translation':
                dictionary = Object.keys(this.translations[this.locale] || {});
                break;
            default:
                dictionary = [
                    ...Object.keys(this.colorMap),
                    ...Object.keys(this.translations[this.locale] || {})
                ];
        }
        
        // Simple fuzzy matching for suggestions
        dictionary.forEach(key => {
            if (key !== normalized && this._similarity(normalized, key) > 0.6) {
                suggestions.push(key);
            }
        });
        
        return {
            valid: dictionary.includes(normalized) || suggestions.length === 0,
            normalized,
            suggestions: suggestions.slice(0, 3) // Top 3 suggestions
        };
    }

    /**
     * Calculate string similarity (simple implementation)
     * @private
     */
    _similarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this._levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    /**
     * Calculate Levenshtein distance
     * @private
     */
    _levenshteinDistance(str1, str2) {
        const matrix = Array(str2.length + 1).fill(null).map(() => 
            Array(str1.length + 1).fill(null)
        );
        
        for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
        
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + substitutionCost
                );
            }
        }
        
        return matrix[str2.length][str1.length];
    }
}

export default I18n;
