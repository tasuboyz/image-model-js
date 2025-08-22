/**
 * Outfits Database - Seed presets and default configurations
 * Contains default outfit presets and configuration data
 */

export const defaultOutfits = [
    {
        id: 'casual_everyday',
        name: 'Casual Everyday',
        category: 'outfit',
        tags: ['casual', 'everyday', 'comfortable'],
        data: {
            identity: {
                age: 25,
                gender: 'female'
            },
            appearance: {
                bodyType: 'slim',
                height: 'average',
                hairLength: 'medium',
                hairStyle: 'wavy',
                hairColor: 'brown',
                eyeColor: 'brown',
                skinTone: 'fair',
                makeup: 'natural'
            },
            outfit: {
                torso: 't-shirt',
                torsoColor: 'white',
                lower: 'jeans',
                lowerColor: 'blue',
                footwear: 'sneakers',
                footwearColor: 'white',
                accessories: 'simple necklace'
            },
            scene: {
                pose: 'standing',
                location: 'park',
                time: 'afternoon',
                weather: 'sunny',
                mood: 'casual',
                lighting: 'natural',
                shotType: 'full-body'
            }
        }
    },
    {
        id: 'business_professional',
        name: 'Business Professional',
        category: 'outfit',
        tags: ['business', 'professional', 'office', 'formal'],
        data: {
            identity: {
                age: 30,
                gender: 'female',
                profession: 'business executive'
            },
            appearance: {
                bodyType: 'athletic',
                height: 'tall',
                hairLength: 'medium',
                hairStyle: 'straight',
                hairColor: 'black',
                eyeColor: 'brown',
                skinTone: 'medium',
                makeup: 'moderate'
            },
            outfit: {
                torso: 'blouse',
                torsoColor: 'white',
                neckline: 'crew',
                lower: 'pants',
                lowerColor: 'black',
                footwear: 'heels',
                footwearColor: 'black',
                heelHeight: '3"',
                outerwear: 'blazer',
                accessories: 'pearl earrings, watch'
            },
            scene: {
                pose: 'standing',
                location: 'office',
                time: 'morning',
                mood: 'professional',
                lighting: 'natural',
                shotType: 'three-quarter'
            }
        }
    },
    {
        id: 'evening_elegant',
        name: 'Evening Elegant',
        category: 'outfit',
        tags: ['evening', 'elegant', 'formal', 'dinner'],
        data: {
            identity: {
                age: 28,
                gender: 'female'
            },
            appearance: {
                bodyType: 'curvy',
                height: 'average',
                hairLength: 'long',
                hairStyle: 'curly',
                hairColor: 'auburn',
                eyeColor: 'green',
                skinTone: 'fair',
                makeup: 'dramatic'
            },
            outfit: {
                torso: 'dress',
                torsoColor: 'red',
                torsoLength: 'midi',
                neckline: 'v-neck',
                footwear: 'heels',
                footwearColor: 'black',
                heelHeight: '4"',
                accessories: 'pearl necklace, elegant earrings'
            },
            scene: {
                pose: 'standing',
                location: 'restaurant',
                time: 'evening',
                mood: 'romantic',
                lighting: 'dramatic',
                shotType: 'full-body'
            }
        }
    },
    {
        id: 'summer_beach',
        name: 'Summer Beach',
        category: 'outfit',
        tags: ['summer', 'beach', 'casual', 'vacation'],
        data: {
            identity: {
                age: 24,
                gender: 'female'
            },
            appearance: {
                bodyType: 'athletic',
                height: 'average',
                hairLength: 'long',
                hairStyle: 'wavy',
                hairColor: 'blonde',
                eyeColor: 'blue',
                skinTone: 'tan',
                makeup: 'light'
            },
            outfit: {
                torso: 'tank-top',
                torsoColor: 'yellow',
                lower: 'shorts',
                lowerColor: 'white',
                footwear: 'sandals',
                footwearColor: 'tan',
                accessories: 'sunglasses, sun hat'
            },
            scene: {
                pose: 'relaxed',
                location: 'beach',
                time: 'afternoon',
                weather: 'sunny',
                mood: 'playful',
                lighting: 'natural',
                shotType: 'three-quarter',
                background: 'ocean view'
            }
        }
    },
    {
        id: 'winter_cozy',
        name: 'Winter Cozy',
        category: 'outfit',
        tags: ['winter', 'cozy', 'casual', 'warm'],
        data: {
            identity: {
                age: 26,
                gender: 'female'
            },
            appearance: {
                bodyType: 'petite',
                height: 'short',
                hairLength: 'medium',
                hairStyle: 'straight',
                hairColor: 'brown',
                eyeColor: 'hazel',
                skinTone: 'fair',
                makeup: 'natural'
            },
            outfit: {
                torso: 'sweater',
                torsoColor: 'gray',
                lower: 'leggings',
                lowerColor: 'black',
                footwear: 'boots',
                footwearColor: 'brown',
                outerwear: 'coat',
                accessories: 'scarf, gloves'
            },
            scene: {
                pose: 'standing',
                location: 'city',
                time: 'evening',
                weather: 'snowy',
                mood: 'cozy',
                lighting: 'soft',
                shotType: 'full-body',
                background: 'winter street'
            }
        }
    },
    {
        id: 'sporty_active',
        name: 'Sporty Active',
        category: 'outfit',
        tags: ['sporty', 'active', 'fitness', 'athletic'],
        data: {
            identity: {
                age: 23,
                gender: 'female',
                profession: 'fitness trainer'
            },
            appearance: {
                bodyType: 'athletic',
                height: 'tall',
                hairLength: 'medium',
                hairStyle: 'ponytail',
                hairColor: 'black',
                eyeColor: 'brown',
                skinTone: 'olive',
                makeup: 'none'
            },
            outfit: {
                torso: 'tank-top',
                torsoColor: 'pink',
                lower: 'leggings',
                lowerColor: 'black',
                footwear: 'sneakers',
                footwearColor: 'white',
                accessories: 'fitness tracker, water bottle'
            },
            scene: {
                pose: 'dynamic',
                location: 'park',
                time: 'morning',
                weather: 'sunny',
                mood: 'energetic',
                lighting: 'natural',
                shotType: 'full-body'
            }
        }
    }
];

export const defaultAppearancePresets = [
    {
        id: 'classic_beauty',
        name: 'Classic Beauty',
        category: 'appearance',
        tags: ['classic', 'beauty', 'elegant'],
        data: {
            appearance: {
                bodyType: 'slim',
                height: 'tall',
                hairLength: 'long',
                hairStyle: 'wavy',
                hairColor: 'brown',
                eyeColor: 'brown',
                skinTone: 'fair',
                makeup: 'moderate'
            }
        }
    },
    {
        id: 'natural_look',
        name: 'Natural Look',
        category: 'appearance',
        tags: ['natural', 'minimal', 'fresh'],
        data: {
            appearance: {
                bodyType: 'athletic',
                height: 'average',
                hairLength: 'medium',
                hairStyle: 'straight',
                hairColor: 'blonde',
                eyeColor: 'blue',
                skinTone: 'fair',
                makeup: 'light'
            }
        }
    },
    {
        id: 'dramatic_glamour',
        name: 'Dramatic Glamour',
        category: 'appearance',
        tags: ['dramatic', 'glamour', 'bold'],
        data: {
            appearance: {
                bodyType: 'curvy',
                height: 'tall',
                hairLength: 'long',
                hairStyle: 'curly',
                hairColor: 'red',
                eyeColor: 'green',
                skinTone: 'fair',
                makeup: 'dramatic'
            }
        }
    }
];

export const defaultScenePresets = [
    {
        id: 'studio_portrait',
        name: 'Studio Portrait',
        category: 'scene',
        tags: ['studio', 'portrait', 'professional'],
        data: {
            scene: {
                pose: 'standing',
                location: 'studio',
                lighting: 'dramatic',
                shotType: 'bust',
                background: 'neutral backdrop'
            }
        }
    },
    {
        id: 'outdoor_natural',
        name: 'Outdoor Natural',
        category: 'scene',
        tags: ['outdoor', 'natural', 'environmental'],
        data: {
            scene: {
                pose: 'relaxed',
                location: 'park',
                time: 'afternoon',
                weather: 'sunny',
                lighting: 'natural',
                shotType: 'full-body',
                background: 'trees and grass'
            }
        }
    },
    {
        id: 'urban_lifestyle',
        name: 'Urban Lifestyle',
        category: 'scene',
        tags: ['urban', 'lifestyle', 'city'],
        data: {
            scene: {
                pose: 'walking',
                location: 'city',
                time: 'evening',
                lighting: 'dramatic',
                shotType: 'three-quarter',
                background: 'city lights'
            }
        }
    }
];

// Form field options and configurations
export const formOptions = {
    gender: [
        { value: '', label: 'Select...' },
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
        { value: 'non-binary', label: 'Non-binary' }
    ],
    
    ethnicity: [
        { value: '', label: 'Select...' },
        { value: 'caucasian', label: 'Caucasian' },
        { value: 'asian', label: 'Asian' },
        { value: 'african', label: 'African' },
        { value: 'hispanic', label: 'Hispanic' },
        { value: 'middle-eastern', label: 'Middle Eastern' }
    ],
    
    bodyType: [
        { value: '', label: 'Select...' },
        { value: 'slim', label: 'Slim' },
        { value: 'athletic', label: 'Athletic' },
        { value: 'curvy', label: 'Curvy' },
        { value: 'petite', label: 'Petite' },
        { value: 'plus-size', label: 'Plus Size' }
    ],
    
    height: [
        { value: '', label: 'Select...' },
        { value: 'short', label: 'Short' },
        { value: 'average', label: 'Average' },
        { value: 'tall', label: 'Tall' }
    ],
    
    hairLength: [
        { value: '', label: 'Select...' },
        { value: 'very-short', label: 'Very Short' },
        { value: 'short', label: 'Short' },
        { value: 'medium', label: 'Medium' },
        { value: 'long', label: 'Long' },
        { value: 'very-long', label: 'Very Long' }
    ],
    
    hairStyle: [
        { value: '', label: 'Select...' },
        { value: 'straight', label: 'Straight' },
        { value: 'wavy', label: 'Wavy' },
        { value: 'curly', label: 'Curly' },
        { value: 'braided', label: 'Braided' },
        { value: 'ponytail', label: 'Ponytail' },
        { value: 'bun', label: 'Bun' }
    ],
    
    colors: [
        { value: '', label: 'Select...' },
        { value: 'white', label: 'White' },
        { value: 'black', label: 'Black' },
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'yellow', label: 'Yellow' },
        { value: 'pink', label: 'Pink' },
        { value: 'purple', label: 'Purple' },
        { value: 'brown', label: 'Brown' },
        { value: 'gray', label: 'Gray' },
        { value: 'orange', label: 'Orange' },
        { value: 'navy', label: 'Navy' },
        { value: 'gold', label: 'Gold' },
        { value: 'silver', label: 'Silver' }
    ],
    
    clothing: {
        torso: [
            { value: '', label: 'Select...' },
            { value: 'dress', label: 'Dress' },
            { value: 'blouse', label: 'Blouse' },
            { value: 'shirt', label: 'Shirt' },
            { value: 't-shirt', label: 'T-Shirt' },
            { value: 'tank-top', label: 'Tank Top' },
            { value: 'sweater', label: 'Sweater' },
            { value: 'jacket', label: 'Jacket' }
        ],
        
        lower: [
            { value: '', label: 'Select...' },
            { value: 'pants', label: 'Pants' },
            { value: 'jeans', label: 'Jeans' },
            { value: 'skirt', label: 'Skirt' },
            { value: 'shorts', label: 'Shorts' },
            { value: 'leggings', label: 'Leggings' }
        ],
        
        footwear: [
            { value: '', label: 'Select...' },
            { value: 'heels', label: 'Heels' },
            { value: 'sneakers', label: 'Sneakers' },
            { value: 'boots', label: 'Boots' },
            { value: 'flats', label: 'Flats' },
            { value: 'sandals', label: 'Sandals' }
        ]
    },
    
    scene: {
        pose: [
            { value: '', label: 'Select...' },
            { value: 'standing', label: 'Standing' },
            { value: 'sitting', label: 'Sitting' },
            { value: 'reclining', label: 'Reclining' },
            { value: 'walking', label: 'Walking' },
            { value: 'dynamic', label: 'Dynamic' },
            { value: 'relaxed', label: 'Relaxed' },
            { value: 'editorial', label: 'Editorial' }
        ],
        
        location: [
            { value: '', label: 'Select...' },
            { value: 'studio', label: 'Studio' },
            { value: 'office', label: 'Office' },
            { value: 'beach', label: 'Beach' },
            { value: 'city', label: 'City' },
            { value: 'park', label: 'Park' },
            { value: 'home', label: 'Home' },
            { value: 'restaurant', label: 'Restaurant' }
        ],
        
        shotType: [
            { value: '', label: 'Select...' },
            { value: 'full-body', label: 'Full Body' },
            { value: 'three-quarter', label: 'Three Quarter' },
            { value: 'bust', label: 'Bust' },
            { value: 'close-up', label: 'Close Up' },
            { value: 'face-only', label: 'Face Only' }
        ]
    }
};

// Configuration settings
export const config = {
    autosave: {
        enabled: true,
        delay: 1000 // ms
    },
    
    ui: {
        showSensitiveFields: false,
        defaultTheme: 'light',
        showPreviewPatch: true
    },
    
    api: {
        baseUrl: '',
        timeout: 10000
    },
    
    storage: {
        keyPrefix: 'aiPrompt_',
        maxPresets: 100
    },
    
    validation: {
        enabled: true,
        showSuggestions: true
    }
};

export default {
    defaultOutfits,
    defaultAppearancePresets,
    defaultScenePresets,
    formOptions,
    config
};
