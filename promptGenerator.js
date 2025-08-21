// =============================================================================
// PROMPT GENERATOR MODULE - Client-side prompt generation logic
// =============================================================================

const PromptGenerator = {
    // Main generation method
    generate(formData) {
        try {
            const sections = this._buildSections(formData);
            const prompt = this._assembleFinalPrompt(sections);
            const metadata = this._calculateMetadata(prompt, sections);
            
            return {
                prompt: prompt,
                characterCount: metadata.characterCount,
                complexity: metadata.complexity,
                layers: metadata.layers,
                sections: sections
            };
        } catch (error) {
            console.error('Prompt generation failed:', error);
            return {
                prompt: 'Error generating prompt. Please check your input data.',
                characterCount: 0,
                complexity: 'unknown',
                layers: 0,
                sections: {},
                error: error.message
            };
        }
    },

    // Build individual sections
    _buildSections(formData) {
        const sections = {};
        
        // Identity section
        sections.identity = this._buildIdentitySection(formData.identity || {});
        
        // Appearance section  
        sections.appearance = this._buildAppearanceSection(formData.appearance || {});
        
        // Clothing section (with torso/dress logic)
        sections.clothing = this._buildClothingSection(formData.clothing || {});
        
        // Scene section
        sections.scene = this._buildSceneSection(formData.scene || {});
        
        return sections;
    },

    // Build identity section
    _buildIdentitySection(identity) {
        const parts = [];
        
        if (identity.age) parts.push(`${identity.age} years old`);
        if (identity.gender) parts.push(identity.gender);
        if (identity.ethnicity) parts.push(`${identity.ethnicity} ethnicity`);
        if (identity.profession) parts.push(`${identity.profession}`);
        
        return parts.length > 0 ? parts.join(', ') : '';
    },

    // Build appearance section
    _buildAppearanceSection(appearance) {
        const parts = [];
        
        if (appearance.bodyType) parts.push(`${appearance.bodyType} build`);
        if (appearance.height) parts.push(`${appearance.height} height`);

        // Build a consolidated hair description if any hair fields exist
        const hairParts = [];
        if (appearance.hairLength) hairParts.push(appearance.hairLength);
        if (appearance.hairStyle) hairParts.push(appearance.hairStyle);
        if (appearance.hairTexture) hairParts.push(appearance.hairTexture);
        if (appearance.hairColor) hairParts.push(appearance.hairColor);
        if (hairParts.length > 0) {
            parts.push(`${hairParts.join(' ')} hair`);
        }

        if (appearance.eyeColor) {
            const colorEng = appearance.eyeColor; // Keep original English colors
            parts.push(`${colorEng} eyes`);
        }

        if (appearance.skinTone) parts.push(`${appearance.skinTone} skin`);

        // Makeup
        if (appearance.makeup) parts.push(`${appearance.makeup} makeup`);
        
        return parts.length > 0 ? parts.join(', ') : '';
    },

    // Build clothing section with torso/dress logic
    _buildClothingSection(clothing) {
        const parts = [];
        const isDress = clothing.torso === 'dress' || clothing.torso === 'maxi dress';
        
        // Handle torso/dress logic
        if (clothing.torso) {
            let torsoText = clothing.torso;
            if (clothing.torsoColor) {
                const colorEng = clothing.torsoColor; // Keep original English colors
                torsoText = `${colorEng} ${torsoText}`;
            }
            parts.push(torsoText);
        }
        
        // Lower body (skip if dress and torsoCoversLower is true)
        if (clothing.lower && !(isDress && clothing.torsoCoversLower)) {
            let lowerText = clothing.lower;
            if (clothing.lowerColor) {
                const colorEng = clothing.lowerColor; // Keep original English colors
                lowerText = `${colorEng} ${lowerText}`;
            }
            parts.push(lowerText);
        }
        
        // Footwear
        if (clothing.footwear) {
            let footwearText = clothing.footwear;
            if (clothing.footwearColor) {
                const colorEng = clothing.footwearColor; // Keep original English colors
                footwearText = `${colorEng} ${footwearText}`;
            }
            parts.push(footwearText);
        }
        
        // Accessories
        if (clothing.accessories) {
            parts.push(clothing.accessories);
        }
        
        return parts.length > 0 ? `wearing ${parts.join(', ')}` : '';
    },

    // Build scene section
    _buildSceneSection(scene) {
        const parts = [];
        
        if (scene.location) parts.push(scene.location);
        if (scene.time) parts.push(scene.time);
        if (scene.weather) parts.push(scene.weather);
        if (scene.mood) parts.push(`${scene.mood} mood`);
        if (scene.lighting) parts.push(`${scene.lighting} lighting`);
        if (scene.background) parts.push(scene.background);
        
        return parts.length > 0 ? parts.join(', ') : '';
    },

    // Assemble final prompt
    _assembleFinalPrompt(sections) {
        const parts = [];
        
        // Add non-empty sections
        if (sections.identity) parts.push(sections.identity);
        if (sections.appearance) parts.push(sections.appearance);
        if (sections.clothing) parts.push(sections.clothing);
        if (sections.scene) parts.push(sections.scene);
        
        if (parts.length === 0) {
            return 'Please fill the form to generate a custom prompt';
        }
        
        return parts.join(', ') + '.';
    },

    // Calculate metadata
    _calculateMetadata(prompt, sections) {
        const characterCount = prompt.length;
        
        // Calculate complexity based on sections and content
        let complexity = 'simple';
        const sectionCount = Object.values(sections).filter(s => s && s.length > 0).length;
        
        if (sectionCount >= 3 && characterCount > 150) {
            complexity = 'complex';
        } else if (sectionCount >= 2 || characterCount > 100) {
            complexity = 'medium';
        }
        
        // Count layers (sections with content)
        const layers = sectionCount;
        
        return {
            characterCount,
            complexity,
            layers
        };
    },

    // Utility method to validate form data structure
    validateFormData(formData) {
        const errors = [];
        
        if (!formData || typeof formData !== 'object') {
            errors.push('Form data must be an object');
            return errors;
        }
        
        // Check if at least one section has content
        const sections = ['identity', 'appearance', 'clothing', 'scene'];
        const hasContent = sections.some(section => {
            const sectionData = formData[section];
            if (!sectionData || typeof sectionData !== 'object') return false;
            return Object.values(sectionData).some(value => value && value.toString().trim().length > 0);
        });
        
        if (!hasContent) {
            errors.push('At least one section must have content');
        }
        
        return errors;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptGenerator;
}
