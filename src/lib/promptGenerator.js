/**
 * PromptGenerator - Advanced clothing and appearance prompt generator for AI image models
 * Generates natural language prompts from structured form data
 */
import colorUtils from './colorUtils.js';

export class PromptGenerator {
    constructor(options = {}) {
        this.options = {
            includeSensitive: false,
            language: 'en',
            ...options
        };
    }

    /**
     * Generate complete prompt from form data
     * @param {Object} formData - Complete form data object
     * @returns {Object} { prompt: string, clothingMap: Array }
     */
    generate(formData) {
        const sections = this._buildSections(formData);
        let prompt = this._assemblePrompt(sections);
        // Ensure we always return a non-empty prompt (fallback for empty inputs)
        if (!prompt || !prompt.trim()) {
            prompt = 'portrait';
        }
        const clothingMap = this._generateClothingMap(formData);
        
        return {
            prompt: prompt.trim(),
            clothingMap
        };
    }

    /**
     * Generate preview patch for a specific field change
     * @param {string} fieldPath - Path to changed field (e.g., 'outfit.torso')
     * @param {Object} formData - Complete form data
     * @returns {Object} { fragment: string, clothingMap: Array }
     */
    generatePreviewPatch(fieldPath, formData) {
        const fullResult = this.generate(formData);
        
        // For now, return full result. Could be optimized to return only changed fragment
        return {
            fragment: fullResult.prompt,
            clothingMap: fullResult.clothingMap
        };
    }

    /**
     * Build sections from form data
     * @private
     */
    _buildSections(formData) {
        const sections = {};

        // Identity section
        sections.identity = this._buildIdentitySection(formData.identity || {});
        
        // Appearance section
        sections.appearance = this._buildAppearanceSection(formData.appearance || {});
        
        // Outfit section
        sections.outfit = this._buildOutfitSection(formData.outfit || {});
        
        // Scene section
        sections.scene = this._buildSceneSection(formData.scene || {});

        return sections;
    }

    /**
     * Build identity section
     * @private
     */
    _buildIdentitySection(identity) {
        const parts = [];

        if (identity.gender) {
            parts.push(this._normalizeValue(identity.gender));
        }

        if (identity.age) {
            parts.push(`${identity.age} years old`);
        }

        if (identity.ethnicity) {
            parts.push(this._normalizeValue(identity.ethnicity));
        }

        if (identity.profession) {
            parts.push(identity.profession);
        }

        // Handle sensitive fields
        if (this.options.includeSensitive) {
            if (identity.braCup) {
                parts.push(`${identity.braCup} cup`);
            }
            if (identity.bustSize) {
                parts.push(`${identity.bustSize} bust`);
            }
        }

        // Free-form notes should be appended to identity section so preview updates
        if (identity.notes) {
            parts.push(identity.notes);
        }

        return parts.filter(Boolean).join(', ');
    }

    /**
     * Build appearance section
     * @private
     */
    _buildAppearanceSection(appearance) {
        const parts = [];

        // Body description
        const bodyParts = [];
        if (appearance.height) {
            bodyParts.push(this._normalizeValue(appearance.height));
        }
        if (appearance.bodyType) {
            bodyParts.push(`${this._normalizeValue(appearance.bodyType)} build`);
        }
        if (bodyParts.length > 0) {
            parts.push(bodyParts.join(' '));
        }

        // Hair description
        const hairParts = [];
        if (appearance.hairLength) {
            hairParts.push(this._normalizeValue(appearance.hairLength));
        }
        if (appearance.hairStyle) {
            hairParts.push(this._normalizeValue(appearance.hairStyle));
        }
        if (appearance.hairColor) {
            hairParts.push(this._normalizeValue(appearance.hairColor));
        }
        if (hairParts.length > 0) {
            hairParts.push('hair');
            parts.push(hairParts.join(' '));
        }

        // Skin and eyes
        if (appearance.skinTone) {
            parts.push(`${this._normalizeValue(appearance.skinTone)} skin`);
        }
        if (appearance.eyeColor) {
            parts.push(`${this._normalizeValue(appearance.eyeColor)} eyes`);
        }

        // Makeup
        if (appearance.makeup && appearance.makeup !== 'none') {
            parts.push(`${this._normalizeValue(appearance.makeup)} makeup`);
        }

        // Breasts (sensitive) - include only if option enabled
        if (this.options.includeSensitive && appearance.braCup) {
            const breastParts = [];
            breastParts.push(`${appearance.braCup} cup`);
            if (appearance.bustSize) breastParts.push(`${this._normalizeValue(appearance.bustSize)} bust`);
            if (appearance.breastShape) breastParts.push(`${this._normalizeValue(appearance.breastShape)} shape`);
            if (appearance.cleavage) breastParts.push(`${this._normalizeValue(appearance.cleavage)} cleavage`);
            parts.push(breastParts.join(' '));
        }

        return parts.filter(Boolean).join(', ');
    }

    /**
     * Build outfit section
     * @private
     */
    _buildOutfitSection(outfit) {
        const parts = [];
        const wearingParts = [];

        // Head/face accessories (may be mentioned as part of wearing)
        if (outfit.headwear) wearingParts.push(this._normalizeValue(outfit.headwear));
        if (outfit.hairAccessories) wearingParts.push(this._normalizeValue(outfit.hairAccessories));
        if (outfit.faceAccessories) wearingParts.push(this._normalizeValue(outfit.faceAccessories));

        // Intimate or upper body main items (e.g., bralette)
        if (outfit.intimate) wearingParts.push(this._normalizeValue(outfit.intimate));

        // If there's no main torso item, include aliases (upperBodyMain, torsoGarment, torsoStyle)
        if (!outfit.torso) {
            if (outfit.upperBodyMain) wearingParts.push(this._normalizeValue(outfit.upperBodyMain));
            if (outfit.torsoGarment) wearingParts.push(this._normalizeValue(outfit.torsoGarment));
            if (outfit.torsoStyle) wearingParts.push(this._normalizeValue(outfit.torsoStyle));
            // If user selected a neckline without a main torso item, include it as an attribute
            if (outfit.neckline) wearingParts.push(`with ${this._normalizeValue(outfit.neckline)}`);
        }

        // Main torso item
        if (outfit.torso) {
            const torsoParts = [];
            // Support hex color values (from color picker) and named colors
            if (outfit.torsoColor) torsoParts.push(this._formatColorForPrompt(outfit.torsoColor));

            // If it's a dress, include length as attribute
            if (outfit.torsoLength && outfit.torso === 'dress') {
                torsoParts.push(this._normalizeValue(outfit.torsoLength));
            }

            // Include fit attribute if present
            if (outfit.torsoFit) torsoParts.push(this._normalizeValue(outfit.torsoFit));

            torsoParts.push(this._normalizeValue(outfit.torso));

            // Optional style/garment aliases
            if (outfit.torsoStyle) torsoParts.push(this._normalizeValue(outfit.torsoStyle));
            if (outfit.torsoGarment) torsoParts.push(this._normalizeValue(outfit.torsoGarment));

            if (outfit.neckline) torsoParts.push(`with ${this._normalizeValue(outfit.neckline)}`);

            wearingParts.push(torsoParts.join(' '));
        }

    // Lower garment (if torso doesn't cover lower or if explicitly specified)
        const torsoCoversLower = outfit.torso === 'dress' || outfit.torsoCoversLower;
        const lowerType = outfit.lower || outfit.bottomsType;
            // If no explicit lower but intimateLower is present, treat intimate as lower for description
            let effectiveLower = lowerType || null;
            let intimateUsedAsLower = false;
            if (!effectiveLower && outfit.intimateLower) {
                effectiveLower = outfit.intimateLower;
                intimateUsedAsLower = true;
            }

            if (effectiveLower && !torsoCoversLower) {
                const lowerParts = [];
                if (outfit.lowerColor) lowerParts.push(this._formatColorForPrompt(outfit.lowerColor));
                if (outfit.bottomsStyle) lowerParts.push(this._normalizeValue(outfit.bottomsStyle));
                // If intimate is used as lower, prefix to make intent clear
                if (intimateUsedAsLower) {
                    lowerParts.push(`intimate ${this._normalizeValue(effectiveLower)}`);
                } else {
                    lowerParts.push(this._normalizeValue(effectiveLower));
                }
                wearingParts.push(lowerParts.join(' '));
            }

        // Legwear / intimate lower
        if (outfit.legwear) {
            const legParts = [];
            if (outfit.legwearStyle) legParts.push(this._normalizeValue(outfit.legwearStyle));
            legParts.push(this._normalizeValue(outfit.legwear));
            wearingParts.push(legParts.filter(Boolean).join(' '));
        }
        // Only add intimateLower separately if it wasn't already used as the main lower
        if (outfit.intimateLower && !intimateUsedAsLower) wearingParts.push(this._normalizeValue(outfit.intimateLower));

        // Footwear (shoeType alias supported)
        const shoe = outfit.footwear || outfit.shoeType;
        if (shoe) {
            const footwearParts = [];
            if (outfit.footwearColor) footwearParts.push(this._formatColorForPrompt(outfit.footwearColor));
            footwearParts.push(this._normalizeValue(shoe));
            if (outfit.heelHeight && shoe === 'heels') footwearParts.push(`(${outfit.heelHeight})`);
            wearingParts.push(footwearParts.join(' '));
        }

        // Combine wearing parts into a single wearing phrase
        if (wearingParts.length > 0) {
            parts.push(`wearing ${wearingParts.join(', ')}`);
        }

        // Accessories: combine earrings, neckwear and free-text accessories
        const accessoriesParts = [];
        if (outfit.earrings) accessoriesParts.push(this._normalizeValue(outfit.earrings));
        if (outfit.neckwear) accessoriesParts.push(this._normalizeValue(outfit.neckwear));
    // belt as an accessory/waist detail
    if (outfit.belt) accessoriesParts.push(this._normalizeValue(outfit.belt));
        if (outfit.accessories) accessoriesParts.push(outfit.accessories);
        if (accessoriesParts.length > 0) parts.push(`and ${accessoriesParts.join(', ')}`);

        // Outerwear
        if (outfit.outerwear) parts.push(`with ${outfit.outerwear}`);

        return parts.filter(Boolean).join(' ');
    }

    /**
     * Build scene section
     * @private
     */
    _buildSceneSection(scene) {
        const parts = [];

        // Pose and location
        const poseParts = [];
        if (scene.pose) {
            // special-case back-facing pose for natural description
            if (scene.pose === 'back-facing') {
                // language-aware phrasing
                if (this.options.language && this.options.language.startsWith('it')) {
                    poseParts.push('girata di spalle');
                } else {
                    poseParts.push('facing away from the camera');
                }
            } else {
                poseParts.push(`posed ${this._normalizeValue(scene.pose)}`);
            }
        }
        if (scene.location) {
            poseParts.push(`in ${this._normalizeValue(scene.location)}`);
        }
        if (poseParts.length > 0) {
            parts.push(poseParts.join(' '));
        }

        // Time and weather
        const timeParts = [];
        if (scene.time) {
            timeParts.push(`at ${this._normalizeValue(scene.time)}`);
        }
        if (scene.weather) {
            timeParts.push(`${this._normalizeValue(scene.weather)} weather`);
        }
        if (timeParts.length > 0) {
            parts.push(timeParts.join(', '));
        }

        // Lighting and shot type
        const technicalParts = [];
        if (scene.lighting) {
            technicalParts.push(`${this._normalizeValue(scene.lighting)} lighting`);
        }
        if (scene.shotType) {
            technicalParts.push(`${this._normalizeValue(scene.shotType)} shot`);
        }
        if (technicalParts.length > 0) {
            parts.push(technicalParts.join(', '));
        }

        // Background and mood
        if (scene.background) {
            parts.push(`background: ${scene.background}`);
        }
        if (scene.mood) {
            parts.push(`${this._normalizeValue(scene.mood)} mood`);
        }

        return parts.filter(Boolean).join(', ');
    }

    /**
     * Assemble final prompt from sections
     * @private
     */
    _assemblePrompt(sections) {
        const parts = [];

        // Add sections in order
        if (sections.identity) parts.push(sections.identity);
        if (sections.appearance) parts.push(sections.appearance);
        if (sections.outfit) parts.push(sections.outfit);
        if (sections.scene) parts.push(sections.scene);

        return parts.join(', ');
    }

    /**
     * Generate clothing map for visual representation
     * @private
     */
    _generateClothingMap(formData) {
        const outfit = formData.outfit || {};
        const map = [];

        // Head area
        const headItems = [];
        if (outfit.headwear) headItems.push(outfit.headwear);
        if (outfit.hairAccessories) headItems.push(outfit.hairAccessories);
        if (outfit.faceAccessories) headItems.push(outfit.faceAccessories);
        map.push({
            area: 'head',
            items: headItems,
            display: `👤 HEAD: ${headItems.join(', ') || 'None'}`,
            colorMeta: null
        });

        // Upper body
        const upperItems = [];
        if (outfit.intimate) upperItems.push(outfit.intimate);
        if (outfit.upperBodyMain) upperItems.push(outfit.upperBodyMain);
        if (outfit.torsoGarment) upperItems.push(outfit.torsoGarment);
        if (outfit.torsoStyle) upperItems.push(outfit.torsoStyle);
        // Include sensitive breast info in upper map if present
        if (formData.appearance && this.options.includeSensitive) {
            const a = formData.appearance;
            const breastDesc = [];
            if (a.braCup) breastDesc.push(`${a.braCup} cup`);
            if (a.bustSize) breastDesc.push(a.bustSize);
            if (breastDesc.length > 0) upperItems.push(breastDesc.join(' '));
        }
        if (outfit.outerwear) upperItems.push(outfit.outerwear);
        map.push({
            area: 'upper',
            items: upperItems,
            display: `👔 UPPER: ${upperItems.join(', ') || 'None'}`,
            colorMeta: outfit.torsoColor || null
        });

        // Torso
        const torsoItems = [];
        if (outfit.torso) {
            const torsoDesc = [
                outfit.torsoColor,
                outfit.torsoLength,
                outfit.torso,
                outfit.torsoStyle,
                outfit.torsoFit ? `(${outfit.torsoFit})` : null,
                outfit.neckline ? `(${outfit.neckline})` : null
            ].filter(Boolean).join(' ');
            torsoItems.push(torsoDesc);
        }
    // include belt in torso/upper items for visual map if present
    if (outfit.belt) torsoItems.push(`belt: ${this._normalizeValue(outfit.belt)}`);
        map.push({
            area: 'torso',
            items: torsoItems,
            display: `👗 TORSO: ${torsoItems.join(', ') || 'None'}`,
            colorMeta: outfit.torsoColor || null
        });

        // Lower body
        const lowerItems = [];
        const torsoCoversLower = outfit.torso === 'dress' || outfit.torsoCoversLower;
        if (!torsoCoversLower) {
            const lowerType = outfit.lower || outfit.bottomsType;
            // If no explicit lower but intimate lower exists, treat intimate as lower
            const effectiveLower = lowerType || (outfit.intimateLower ? outfit.intimateLower : null);
            const intimateUsedAsLower = !lowerType && !!outfit.intimateLower;

            if (effectiveLower) {
                const lowerDesc = [
                    outfit.lowerColor,
                    outfit.bottomsStyle,
                    intimateUsedAsLower ? `intimate ${effectiveLower}` : effectiveLower
                ].filter(Boolean).join(' ');
                lowerItems.push(lowerDesc);
            }
            // store flag for later to avoid duplicating intimate in legs
            var _intimateUsedAsLower = intimateUsedAsLower;
        } else {
            var _intimateUsedAsLower = false;
        }
        map.push({
            area: 'lower',
            items: lowerItems,
            display: `👖 LOWER: ${lowerItems.join(', ') || 'None'}`,
            colorMeta: outfit.lowerColor || null
        });

        // Legs
    const legItems = [];
    if (outfit.legwear) legItems.push(outfit.legwear);
    if (outfit.legwearStyle) legItems.push(outfit.legwearStyle);
    // Only include intimateLower in legs if it wasn't used as the main lower
    if (outfit.intimateLower && !_intimateUsedAsLower) legItems.push(outfit.intimateLower);
        map.push({
            area: 'legs',
            items: legItems,
            display: `🦵 LEGS: ${legItems.join(', ') || 'None'}`,
            colorMeta: null
        });

        // Feet
        const feetItems = [];
        if (outfit.footwear) {
            const footwearDesc = [
                outfit.footwearColor,
                outfit.footwear,
                outfit.heelHeight && outfit.footwear === 'heels' ? `(${outfit.heelHeight})` : null
            ].filter(Boolean).join(' ');
            feetItems.push(footwearDesc);
        }
        // shoeType alias
        if (!feetItems.length && outfit.shoeType) {
            const shoeDesc = [outfit.footwearColor, outfit.shoeType, outfit.heelHeight ? `(${outfit.heelHeight})` : null].filter(Boolean).join(' ');
            feetItems.push(shoeDesc);
        }
        map.push({
            area: 'feet',
            items: feetItems,
            display: `👠 FEET: ${feetItems.join(', ') || 'None'}`,
            colorMeta: outfit.footwearColor || null
        });

        return map;
    }

    /**
     * Normalize values for consistent output
     * @private
     */
    _normalizeValue(value) {
        if (!value) return '';
        
        // Convert to lowercase and replace common separators
        return value.toString()
            .toLowerCase()
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .trim();
    }

    /**
     * Format color for prompt: accept named colors or hex values and produce friendly label
     */
    _formatColorForPrompt(color) {
        if (!color) return '';

        // If it's a hex color, try to return a friendly name (with hex fallback)
        try {
            if (typeof color === 'string' && color.trim().startsWith('#')) {
                const hex = color.trim();
                const friendly = colorUtils.hexToFriendlyName(hex);
                if (friendly && friendly !== hex) return `${friendly} (${hex})`;
                return hex;
            }
        } catch (e) {
            // ignore and fallback
        }

        return this._normalizeValue(color);
    }

    /**
     * Update options
     */
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }
}

export default PromptGenerator;
