// AI Service - Handles external AI API calls

const AI_API_BASE_URL = process.env.AI_API_URL || 'https://your-ai-service.com/api';
const AI_API_KEY = process.env.AI_API_KEY || 'your-api-key';

// Route Optimization AI Service
export async function optimizeRoute(inputData) {
    try {
        const response = await fetch(`${AI_API_BASE_URL}/optimize-route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Route optimization AI call failed:', error);

        // Fallback to basic calculation
        return createFallbackPlan(inputData);
    }
}

// Fuel Prediction AI Service
export async function predictFuelUsage(shipData, routeData, weatherData) {
    try {
        const inputData = {
            ship: shipData,
            route: routeData,
            weather: weatherData
        };

        const response = await fetch(`${AI_API_BASE_URL}/predict-fuel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
        }

        const result = await response.json();
        return result.fuelPrediction;

    } catch (error) {
        console.error('Fuel prediction AI call failed:', error);

        // Fallback calculation
        return calculateBasicFuel(shipData, routeData);
    }
}

// Maintenance Prediction AI Service
export async function predictMaintenance(shipData, usageData) {
    try {
        const inputData = {
            ship: shipData,
            usageHistory: usageData,
            analysisType: 'predictive_maintenance'
        };

        const response = await fetch(`${AI_API_BASE_URL}/predict-maintenance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify(inputData)
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
        }

        const result = await response.json();
        return result.recommendations;

    } catch (error) {
        console.error('Maintenance prediction AI call failed:', error);

        // Fallback to basic analysis
        return createBasicMaintenanceRecommendations(shipData, usageData);
    }
}

// Performance Analysis AI Service
export async function analyzePerformance(voyageData) {
    try {
        const response = await fetch(`${AI_API_BASE_URL}/analyze-performance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`
            },
            body: JSON.stringify(voyageData)
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
        }

        const result = await response.json();
        return result.insights;

    } catch (error) {
        console.error('Performance analysis AI call failed:', error);

        // Fallback to basic analysis
        return generateBasicInsights(voyageData);
    }
}

// Fallback Functions (when AI service is unavailable)

function createFallbackPlan(inputData) {
    const { ship, voyage } = inputData;

    return {
        estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000),
        plannedSpeed: 25,
        expectedFuelUse: 1000,
        estimatedDuration: 24,
        route: [voyage.origin, voyage.destination],
        optimizationMethod: 'fallback',
        confidence: 0.6
    };
}

// Basic fuel calculation
function calculateBasicFuel(shipData, routeData) {
    const baseFuelRate = 50;
    const estimatedHours = 24;

    return {
        estimatedFuel: baseFuelRate * estimatedHours,
        confidence: 0.5,
        method: 'basic_calculation'
    };
}

function createBasicMaintenanceRecommendations(shipData, usageData) {
    return [
        {
            component: 'Engine',
            priority: 'medium',
            description: 'Routine engine check recommended',
            suggestedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            confidence: 0.6,
            method: 'time_based'
        }
    ];
}

function generateBasicInsights(voyageData) {
    return [
        'Voyage completed successfully',
        'Performance data recorded for future optimization'
    ];
}

// Helper function for API health check
export async function checkAIServiceHealth() {
    try {
        const response = await fetch(`${AI_API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AI_API_KEY}`
            }
        });

        return {
            status: response.ok ? 'healthy' : 'unhealthy',
            responseTime: Date.now(),
            aiServiceAvailable: response.ok
        };

    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message,
            aiServiceAvailable: false
        };
    }
} 