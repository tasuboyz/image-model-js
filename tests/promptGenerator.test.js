/**
 * PromptGenerator Unit Tests
 * Comprehensive tests for the prompt generation functionality
 */

import PromptGenerator from '../src/lib/promptGenerator.js';

class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    /**
     * Add a test case
     */
    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    /**
     * Assert function for tests
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    /**
     * Assert equality
     */
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    /**
     * Assert that value contains substring
     */
    assertContains(haystack, needle, message) {
        if (!haystack.includes(needle)) {
            throw new Error(message || `Expected "${haystack}" to contain "${needle}"`);
        }
    }

    /**
     * Assert that array includes value
     */
    assertIncludes(array, value, message) {
        if (!array.includes(value)) {
            throw new Error(message || `Expected array to include ${value}`);
        }
    }

    /**
     * Run all tests
     */
    async run() {
        console.log(`🧪 Running ${this.tests.length} tests...\n`);

        for (const { name, testFunction } of this.tests) {
            try {
                await testFunction();
                this.results.push({ name, success: true });
                console.log(`✅ ${name}`);
            } catch (error) {
                this.results.push({ name, success: false, error: error.message });
                console.log(`❌ ${name}: ${error.message}`);
            }
        }

        this.printSummary();
    }

    /**
     * Print test summary
     */
    printSummary() {
        const passed = this.results.filter(r => r.success).length;
        const failed = this.results.filter(r => !r.success).length;

        console.log('\n📊 Test Summary:');
        console.log(`   Passed: ${passed}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Total: ${this.results.length}`);

        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results
                .filter(r => !r.success)
                .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
            
            process.exit(1);
        } else {
            console.log('\n🎉 All tests passed!');
        }
    }
}

// Test suite
const runner = new TestRunner();

// Basic prompt generation tests
runner.test('Should generate basic prompt with minimal data', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: { age: 25, gender: 'female' },
        appearance: {},
        outfit: {},
        scene: {}
    };

    const result = generator.generate(formData);
    
    runner.assert(result.prompt, 'Should return a prompt');
    runner.assertContains(result.prompt, 'female', 'Should include gender');
    runner.assertContains(result.prompt, '25 years old', 'Should include formatted age');
});

runner.test('Should generate comprehensive prompt with all sections', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: {
            age: 28,
            gender: 'female',
            ethnicity: 'asian',
            profession: 'doctor'
        },
        appearance: {
            bodyType: 'slim',
            height: 'tall',
            hairLength: 'long',
            hairStyle: 'wavy',
            hairColor: 'black',
            eyeColor: 'brown',
            skinTone: 'fair',
            makeup: 'natural'
        },
        outfit: {
            torso: 'dress',
            torsoColor: 'red',
            torsoLength: 'midi',
            neckline: 'v-neck',
            footwear: 'heels',
            footwearColor: 'black',
            heelHeight: '4"',
            accessories: 'pearl necklace'
        },
        scene: {
            pose: 'standing',
            location: 'office',
            time: 'morning',
            mood: 'professional',
            lighting: 'natural',
            shotType: 'full-body'
        }
    };

    const result = generator.generate(formData);
    
    // Check identity section
    runner.assertContains(result.prompt, 'female', 'Should include gender');
    runner.assertContains(result.prompt, '28 years old', 'Should include age');
    runner.assertContains(result.prompt, 'asian', 'Should include ethnicity');
    runner.assertContains(result.prompt, 'doctor', 'Should include profession');
    
    // Check appearance section
    runner.assertContains(result.prompt, 'tall slim build', 'Should include body description');
    runner.assertContains(result.prompt, 'long wavy black hair', 'Should include hair description');
    runner.assertContains(result.prompt, 'brown eyes', 'Should include eye color');
    runner.assertContains(result.prompt, 'fair skin', 'Should include skin tone');
    
    // Check outfit section
    runner.assertContains(result.prompt, 'wearing', 'Should include wearing');
    runner.assertContains(result.prompt, 'red midi dress', 'Should include dress description');
    runner.assertContains(result.prompt, 'v neck', 'Should include neckline');
    runner.assertContains(result.prompt, 'black heels', 'Should include footwear');
    runner.assertContains(result.prompt, 'pearl necklace', 'Should include accessories');
    
    // Check scene section
    runner.assertContains(result.prompt, 'standing', 'Should include pose');
    runner.assertContains(result.prompt, 'office', 'Should include location');
    runner.assertContains(result.prompt, 'morning', 'Should include time');
    runner.assertContains(result.prompt, 'professional', 'Should include mood');
});

runner.test('Should handle dress that covers lower body', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: { gender: 'female' },
        appearance: {},
        outfit: {
            torso: 'dress',
            torsoColor: 'blue',
            lower: 'pants', // Should be ignored since dress covers lower
            lowerColor: 'black'
        },
        scene: {}
    };

    const result = generator.generate(formData);
    
    runner.assertContains(result.prompt, 'blue dress', 'Should include dress');
    runner.assert(!result.prompt.includes('pants'), 'Should not include pants when wearing dress');
});

runner.test('Should generate clothing map correctly', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: {},
        appearance: {},
        outfit: {
            torso: 'blouse',
            torsoColor: 'white',
            lower: 'pants',
            lowerColor: 'black',
            footwear: 'heels',
            footwearColor: 'red',
            heelHeight: '3"'
        },
        scene: {}
    };

    const result = generator.generate(formData);
    
    runner.assert(Array.isArray(result.clothingMap), 'Should return clothing map array');
    runner.assert(result.clothingMap.length === 6, 'Should have 6 clothing areas');
    
    // Check specific areas
    const torsoArea = result.clothingMap.find(area => area.area === 'torso');
    runner.assert(torsoArea, 'Should have torso area');
    runner.assertContains(torsoArea.display, 'white blouse', 'Should include torso item');
    
    const lowerArea = result.clothingMap.find(area => area.area === 'lower');
    runner.assert(lowerArea, 'Should have lower area');
    runner.assertContains(lowerArea.display, 'black pants', 'Should include lower item');
    
    const feetArea = result.clothingMap.find(area => area.area === 'feet');
    runner.assert(feetArea, 'Should have feet area');
    runner.assertContains(feetArea.display, 'red heels (3")', 'Should include footwear with heel height');
});

runner.test('Should handle sensitive fields when includeSensitive is false', () => {
    const generator = new PromptGenerator({ includeSensitive: false });
    const formData = {
        identity: {
            age: 25,
            gender: 'female',
            braCup: 'C',
            bustSize: 'large'
        },
        appearance: {},
        outfit: {},
        scene: {}
    };

    const result = generator.generate(formData);
    
    runner.assertContains(result.prompt, 'female', 'Should include gender');
    runner.assert(!result.prompt.includes('C cup'), 'Should not include bra cup');
    runner.assert(!result.prompt.includes('large bust'), 'Should not include bust size');
});

runner.test('Should include sensitive fields when includeSensitive is true', () => {
    const generator = new PromptGenerator({ includeSensitive: true });
    const formData = {
        identity: {
            age: 25,
            gender: 'female',
            braCup: 'C',
            bustSize: 'large'
        },
        appearance: {},
        outfit: {},
        scene: {}
    };

    const result = generator.generate(formData);
    
    runner.assertContains(result.prompt, 'C cup', 'Should include bra cup');
    runner.assertContains(result.prompt, 'large bust', 'Should include bust size');
});

runner.test('Should normalize values correctly', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: { gender: 'female' },
        appearance: {
            bodyType: 'plus-size', // Should be normalized to "plus size"
            hairStyle: 'pony-tail' // Should be normalized to "pony tail"
        },
        outfit: {
            torso: 't-shirt', // Should be normalized to "t shirt"
            neckline: 'v-neck' // Should be normalized to "v neck"
        },
        scene: {
            shotType: 'full-body' // Should be normalized to "full body"
        }
    };

    const result = generator.generate(formData);
    
    runner.assertContains(result.prompt, 'plus size', 'Should normalize plus-size');
    runner.assertContains(result.prompt, 'pony tail', 'Should normalize pony-tail');
    runner.assertContains(result.prompt, 't shirt', 'Should normalize t-shirt');
    runner.assertContains(result.prompt, 'v neck', 'Should normalize v-neck');
    runner.assertContains(result.prompt, 'full body', 'Should normalize full-body');
});

runner.test('Should handle empty or null values gracefully', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: { age: null, gender: '', profession: undefined },
        appearance: { bodyType: '', hairColor: null },
        outfit: { torso: '', accessories: null },
        scene: { pose: '', background: undefined }
    };

    const result = generator.generate(formData);
    
    runner.assert(result.prompt, 'Should return a prompt even with empty values');
    runner.assert(result.clothingMap, 'Should return clothing map even with empty values');
    runner.assert(Array.isArray(result.clothingMap), 'Clothing map should be an array');
});

runner.test('Should generate preview patch for field changes', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: { age: 25, gender: 'female' },
        appearance: { hairColor: 'brown' },
        outfit: { torso: 'dress', torsoColor: 'red' },
        scene: { pose: 'standing' }
    };

    const result = generator.generatePreviewPatch('outfit.torsoColor', formData);
    
    runner.assert(result.fragment, 'Should return fragment');
    runner.assert(result.clothingMap, 'Should return clothing map');
    runner.assertContains(result.fragment, 'red dress', 'Should include updated color');
});

runner.test('Should update options correctly', () => {
    const generator = new PromptGenerator({ includeSensitive: false });
    
    runner.assertEqual(generator.options.includeSensitive, false, 'Initial option should be false');
    
    generator.updateOptions({ includeSensitive: true, language: 'it' });
    
    runner.assertEqual(generator.options.includeSensitive, true, 'Should update includeSensitive');
    runner.assertEqual(generator.options.language, 'it', 'Should update language');
});

runner.test('Should handle complex outfit combinations', () => {
    const generator = new PromptGenerator();
    const formData = {
        identity: { gender: 'female' },
        appearance: {},
        outfit: {
            torso: 'blouse',
            torsoColor: 'white',
            neckline: 'v-neck',
            lower: 'skirt',
            lowerColor: 'black',
            footwear: 'heels',
            footwearColor: 'red',
            heelHeight: '4"',
            accessories: 'pearl necklace, designer bag',
            outerwear: 'blazer'
        },
        scene: {}
    };

    const result = generator.generate(formData);
    
    runner.assertContains(result.prompt, 'wearing white blouse with v neck, black skirt, red heels (4")', 'Should combine outfit pieces correctly');
    runner.assertContains(result.prompt, 'and pearl necklace, designer bag', 'Should include accessories');
    runner.assertContains(result.prompt, 'with blazer', 'Should include outerwear');
});

// Run tests
runner.run();
