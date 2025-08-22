/**
 * Smoke Test - Database and API testing script
 * Tests basic functionality of the database and API endpoints
 */

import fetch from 'node-fetch';

class SmokeTest {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        this.testResults = [];
    }

    /**
     * Run all smoke tests
     */
    async runTests() {
        console.log('🧪 Starting smoke tests...\n');

        try {
            await this.testHealthEndpoint();
            await this.testCreatePreset();
            await this.testGetPresets();
            await this.testGetSinglePreset();
            await this.testUpdatePreset();
            await this.testDeletePreset();
            await this.testSearchPresets();
            await this.testBatchOperations();
            
            this.printResults();
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
            process.exit(1);
        }
    }

    /**
     * Test health endpoint
     */
    async testHealthEndpoint() {
        try {
            const response = await this.request('/api/health');
            
            if (response.status === 'OK') {
                this.addResult('Health Check', true, 'Server is healthy');
            } else {
                this.addResult('Health Check', false, 'Invalid health response');
            }
        } catch (error) {
            this.addResult('Health Check', false, error.message);
        }
    }

    /**
     * Test creating a preset
     */
    async testCreatePreset() {
        try {
            const testPreset = {
                name: 'Test Preset - Smoke Test',
                category: 'outfit',
                data: {
                    identity: { age: 25, gender: 'female' },
                    appearance: { bodyType: 'athletic', hairColor: 'brown' },
                    outfit: { torso: 'dress', torsoColor: 'red' },
                    scene: { pose: 'standing', location: 'studio' }
                },
                tags: ['test', 'smoke-test']
            };

            const response = await this.request('/api/presets', {
                method: 'POST',
                body: JSON.stringify(testPreset)
            });

            if (response.ok && response.id) {
                this.testPresetId = response.id;
                this.addResult('Create Preset', true, `Created preset with ID: ${response.id}`);
            } else {
                this.addResult('Create Preset', false, 'Failed to create preset');
            }
        } catch (error) {
            this.addResult('Create Preset', false, error.message);
        }
    }

    /**
     * Test getting all presets
     */
    async testGetPresets() {
        try {
            const response = await this.request('/api/presets');
            
            if (Array.isArray(response) && response.length >= 0) {
                this.addResult('Get Presets', true, `Retrieved ${response.length} presets`);
            } else {
                this.addResult('Get Presets', false, 'Invalid presets response');
            }
        } catch (error) {
            this.addResult('Get Presets', false, error.message);
        }
    }

    /**
     * Test getting a single preset
     */
    async testGetSinglePreset() {
        if (!this.testPresetId) {
            this.addResult('Get Single Preset', false, 'No test preset ID available');
            return;
        }

        try {
            const response = await this.request(`/api/presets/${this.testPresetId}`);
            
            if (response.id === this.testPresetId && response.name) {
                this.addResult('Get Single Preset', true, 'Retrieved preset successfully');
            } else {
                this.addResult('Get Single Preset', false, 'Invalid preset response');
            }
        } catch (error) {
            this.addResult('Get Single Preset', false, error.message);
        }
    }

    /**
     * Test updating a preset
     */
    async testUpdatePreset() {
        if (!this.testPresetId) {
            this.addResult('Update Preset', false, 'No test preset ID available');
            return;
        }

        try {
            const updatedPreset = {
                name: 'Updated Test Preset - Smoke Test',
                category: 'scene',
                data: {
                    identity: { age: 30, gender: 'female' },
                    appearance: { bodyType: 'slim', hairColor: 'blonde' },
                    outfit: { torso: 'blouse', torsoColor: 'blue' },
                    scene: { pose: 'sitting', location: 'office' }
                },
                tags: ['test', 'smoke-test', 'updated']
            };

            const response = await this.request(`/api/presets/${this.testPresetId}`, {
                method: 'PUT',
                body: JSON.stringify(updatedPreset)
            });

            if (response.ok) {
                this.addResult('Update Preset', true, 'Preset updated successfully');
            } else {
                this.addResult('Update Preset', false, 'Failed to update preset');
            }
        } catch (error) {
            this.addResult('Update Preset', false, error.message);
        }
    }

    /**
     * Test deleting a preset
     */
    async testDeletePreset() {
        if (!this.testPresetId) {
            this.addResult('Delete Preset', false, 'No test preset ID available');
            return;
        }

        try {
            const response = await this.request(`/api/presets/${this.testPresetId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.addResult('Delete Preset', true, 'Preset deleted successfully');
            } else {
                this.addResult('Delete Preset', false, 'Failed to delete preset');
            }
        } catch (error) {
            this.addResult('Delete Preset', false, error.message);
        }
    }

    /**
     * Test search functionality
     */
    async testSearchPresets() {
        try {
            const response = await this.request('/api/presets?search=test&limit=10');
            
            if (Array.isArray(response)) {
                this.addResult('Search Presets', true, `Search returned ${response.length} results`);
            } else {
                this.addResult('Search Presets', false, 'Invalid search response');
            }
        } catch (error) {
            this.addResult('Search Presets', false, error.message);
        }
    }

    /**
     * Test batch operations
     */
    async testBatchOperations() {
        try {
            // Test batch create
            const testPresets = [
                {
                    name: 'Batch Test 1',
                    category: 'outfit',
                    data: { identity: { age: 25 } },
                    tags: ['batch', 'test']
                },
                {
                    name: 'Batch Test 2',
                    category: 'scene',
                    data: { scene: { location: 'beach' } },
                    tags: ['batch', 'test']
                }
            ];

            const createResponse = await this.request('/api/presets/batch', {
                method: 'POST',
                body: JSON.stringify({ presets: testPresets })
            });

            if (createResponse.success >= 0) {
                this.addResult('Batch Create', true, `Created ${createResponse.success} presets`);
                
                // Test batch delete if we have IDs
                const successfulIds = createResponse.results
                    .filter(r => r.success)
                    .map(r => r.id);

                if (successfulIds.length > 0) {
                    const deleteResponse = await this.request('/api/presets/batch', {
                        method: 'DELETE',
                        body: JSON.stringify({ ids: successfulIds })
                    });

                    if (deleteResponse.success >= 0) {
                        this.addResult('Batch Delete', true, `Deleted ${deleteResponse.success} presets`);
                    } else {
                        this.addResult('Batch Delete', false, 'Batch delete failed');
                    }
                } else {
                    this.addResult('Batch Delete', false, 'No presets to delete');
                }
            } else {
                this.addResult('Batch Create', false, 'Batch create failed');
            }
        } catch (error) {
            this.addResult('Batch Operations', false, error.message);
        }
    }

    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const text = await response.text();
        
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }

    /**
     * Add test result
     */
    addResult(testName, success, message) {
        this.testResults.push({
            test: testName,
            success,
            message,
            timestamp: new Date().toISOString()
        });

        const icon = success ? '✅' : '❌';
        console.log(`${icon} ${testName}: ${message}`);
    }

    /**
     * Print test summary
     */
    printResults() {
        const passed = this.testResults.filter(r => r.success).length;
        const failed = this.testResults.filter(r => !r.success).length;
        const total = this.testResults.length;

        console.log('\n📊 Test Summary:');
        console.log(`   Total: ${total}`);
        console.log(`   Passed: ${passed}`);
        console.log(`   Failed: ${failed}`);
        console.log(`   Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(r => !r.success)
                .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
        }

        if (passed === total) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log('\n⚠️  Some tests failed. Check the server logs for details.');
            process.exit(1);
        }
    }
}

/**
 * Run smoke tests
 */
async function runSmokeTests() {
    const baseUrl = process.argv[2] || 'http://localhost:3000';
    
    console.log(`🎯 Running smoke tests against: ${baseUrl}`);
    console.log('⏱️  This may take a few seconds...\n');

    const smokeTest = new SmokeTest(baseUrl);
    await smokeTest.runTests();
}

// Run tests if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runSmokeTests().catch(error => {
        console.error('💥 Smoke tests failed:', error);
        process.exit(1);
    });
}

export default SmokeTest;
