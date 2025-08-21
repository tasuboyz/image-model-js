// =============================================================================
// PROMPT GENERATOR TESTS - Unit tests for the PromptGenerator module
// =============================================================================

// Import the module (for Node.js environment)
let PromptGenerator;
if (typeof require !== 'undefined') {
    PromptGenerator = require('../promptGenerator.js');
} else {
    // For browser environment, PromptGenerator should be globally available
    if (typeof window !== 'undefined' && window.PromptGenerator) {
        PromptGenerator = window.PromptGenerator;
    }
}

// Simple test runner
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    run() {
        console.log('='.repeat(60));
        console.log('RUNNING PROMPT GENERATOR TESTS');
        console.log('='.repeat(60));

        for (const test of this.tests) {
            try {
                test.fn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}`);
                console.log(`   Error: ${error.message}`);
                this.failed++;
            }
        }

        console.log('='.repeat(60));
        console.log(`RESULTS: ${this.passed} passed, ${this.failed} failed`);
        console.log('='.repeat(60));

        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected "${expected}", got "${actual}"`);
        }
    }

    assertContains(text, substring, message) {
        if (!text.includes(substring)) {
            throw new Error(message || `Expected "${text}" to contain "${substring}"`);
        }
    }

    assertNotContains(text, substring, message) {
        if (text.includes(substring)) {
            throw new Error(message || `Expected "${text}" to not contain "${substring}"`);
        }
    }
}

// Create test runner instance
const runner = new TestRunner();

// Test basic functionality
runner.test('should generate basic prompt with identity only', () => {
    const formData = {
        identity: {
            age: '25',
            gender: 'female'
        }
    };
    
    const result = PromptGenerator.generate(formData);
    runner.assertContains(result.prompt, '25 years old');
    runner.assertContains(result.prompt, 'female');
    runner.assert(result.characterCount > 0, 'Should have character count');
});

// Test appearance generation
runner.test('should generate appearance with color mapping', () => {
    const formData = {
        appearance: {
            hairColor: 'black',
            eyeColor: 'blue',
            skinTone: 'fair'
        }
    };
    
    const result = PromptGenerator.generate(formData);
    runner.assertContains(result.prompt, 'black hair'); // English colors now
    runner.assertContains(result.prompt, 'blue eyes');  // English colors now
    runner.assertContains(result.prompt, 'fair');
});

// Test dress/torso logic
runner.test('should handle dress without lower when torsoCoversLower is true', () => {
    const formData = {
        clothing: {
            torso: 'dress',
            torsoColor: 'red',
            lower: 'pants',
            lowerColor: 'blue',
            torsoCoversLower: true
        }
    };
    
    const result = PromptGenerator.generate(formData);
    runner.assertContains(result.prompt, 'dress');
    runner.assertContains(result.prompt, 'red dress'); // English colors now
    runner.assertNotContains(result.prompt, 'pants');
    runner.assertNotContains(result.prompt, 'blue');
});

// Test dress/torso logic - should include lower when torsoCoversLower is false
runner.test('should include lower clothing when dress does not cover', () => {
    const formData = {
        clothing: {
            torso: 'dress',
            torsoColor: 'red',
            lower: 'pants',
            lowerColor: 'blue',
            torsoCoversLower: false
        }
    };
    
    const result = PromptGenerator.generate(formData);
    runner.assertContains(result.prompt, 'dress');
    runner.assertContains(result.prompt, 'pants');
});

// Test maxi dress logic
runner.test('should handle maxi dress as covering lower', () => {
    const formData = {
        clothing: {
            torso: 'maxi dress',
            lower: 'leggings',
            torsoCoversLower: true
        }
    };
    
    const result = PromptGenerator.generate(formData);
    runner.assertContains(result.prompt, 'maxi dress');
    runner.assertNotContains(result.prompt, 'leggings');
});

// Test complete outfit
runner.test('should generate complete outfit with all elements', () => {
    const formData = {
        identity: {
            age: '30',
            gender: 'female'
        },
        appearance: {
            hairColor: 'brown',
            eyeColor: 'green'
        },
        clothing: {
            torso: 'blouse',
            torsoColor: 'white',
            lower: 'skirt',
            lowerColor: 'black',
            footwear: 'heels',
            footwearColor: 'red',
            accessories: 'pearl necklace'
        },
        scene: {
            location: 'office',
            lighting: 'natural'
        }
    };
    
    const result = PromptGenerator.generate(formData);
    runner.assertContains(result.prompt, '30 years old');
    runner.assertContains(result.prompt, 'brown hair'); // English colors now
    runner.assertContains(result.prompt, 'green eyes');   // English colors now
    runner.assertContains(result.prompt, 'blouse');
    runner.assertContains(result.prompt, 'white blouse');  // English colors now
    runner.assertContains(result.prompt, 'skirt');
    runner.assertContains(result.prompt, 'black skirt');    // English colors now
    runner.assertContains(result.prompt, 'office');
    runner.assert(result.layers >= 3, 'Should have multiple layers');
});

// Test empty form data
runner.test('should handle empty form data gracefully', () => {
    const formData = {};
    
    const result = PromptGenerator.generate(formData);
    runner.assertContains(result.prompt, 'Please fill the form');
    runner.assertEqual(result.characterCount, result.prompt.length);
    runner.assertEqual(result.layers, 0);
});

// Test complexity calculation
runner.test('should calculate complexity correctly', () => {
    const simpleFormData = {
        identity: { gender: 'male' }
    };
    
    const complexFormData = {
        identity: { age: '25', gender: 'female', profession: 'doctor' },
        appearance: { hairColor: 'black', eyeColor: 'blue', skinTone: 'fair' },
        clothing: { 
            torso: 'dress', 
            torsoColor: 'red',
            footwear: 'heels',
            accessories: 'jewelry'
        },
        scene: { 
            location: 'office',
            lighting: 'dramatic',
            mood: 'professional'
        }
    };
    
    const simpleResult = PromptGenerator.generate(simpleFormData);
    const complexResult = PromptGenerator.generate(complexFormData);
    
    // Debug output
    console.log('Simple result:', simpleResult.prompt, 'Length:', simpleResult.characterCount, 'Complexity:', simpleResult.complexity);
    console.log('Complex result:', complexResult.prompt, 'Length:', complexResult.characterCount, 'Complexity:', complexResult.complexity);
    
    runner.assert(simpleResult.complexity === 'simple', `Simple data should have simple complexity, got ${simpleResult.complexity}`);
    runner.assert(complexResult.complexity === 'complex' || complexResult.complexity === 'medium', `Complex data should have complex or medium complexity, got ${complexResult.complexity}`);
    runner.assert(complexResult.characterCount > simpleResult.characterCount, 'Complex prompt should be longer');
});

// Test color mapping - now tests English colors
runner.test('should use English colors correctly', () => {
    const colors = [
        'black',
        'white', 
        'red',
        'blue',
        'green',
        'yellow'
    ];
    
    for (const color of colors) {
        const formData = {
            clothing: {
                torso: 'shirt',
                torsoColor: color
            }
        };
        
        const result = PromptGenerator.generate(formData);
        runner.assertContains(result.prompt, `${color} shirt`, `Color ${color} should appear in English`);
    }
});

// Test validation
runner.test('should validate form data structure', () => {
    const validData = {
        identity: { age: '25' }
    };
    
    const invalidData = null;
    const emptyData = {};
    
    const validErrors = PromptGenerator.validateFormData(validData);
    const invalidErrors = PromptGenerator.validateFormData(invalidData);
    const emptyErrors = PromptGenerator.validateFormData(emptyData);
    
    runner.assertEqual(validErrors.length, 0, 'Valid data should have no errors');
    runner.assert(invalidErrors.length > 0, 'Invalid data should have errors');
    runner.assert(emptyErrors.length > 0, 'Empty data should have errors');
});

// Test supported colors - remove this test since we removed getSupportedColors()
// runner.test('should provide supported colors list', () => {
//     const colors = PromptGenerator.getSupportedColors();
//     runner.assert(Array.isArray(colors), 'Should return an array');
//     runner.assert(colors.length > 0, 'Should have supported colors');
//     runner.assert(colors.includes('black'), 'Should include black');
//     runner.assert(colors.includes('white'), 'Should include white');
// });

// Run all tests
if (typeof module !== 'undefined' && require.main === module) {
    // Running in Node.js
    const success = runner.run();
    process.exit(success ? 0 : 1);
} else if (typeof window !== 'undefined') {
    // Running in browser
    window.runTests = () => runner.run();
    console.log('Tests loaded. Run window.runTests() to execute.');
} else {
    // Default run
    runner.run();
}

// Export for use in other modules
if (typeof module !== 'undefined') {
    module.exports = { TestRunner, runner };
}
