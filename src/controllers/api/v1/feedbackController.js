import { Voyage } from '../../../models/index.js';

export const submitFeedback = async (req, res) => {
    try {
        const { voyageId, actualFuelUsed, actualArrival, actualSpeed, actualDuration, deviations } = req.body;

        // Validate voyage ID
        if (!voyageId) {
            return res.status(400).json({
                success: false,
                message: 'Voyage ID is required'
            });
        }

        const voyage = await Voyage.findById(voyageId);
        if (!voyage) {
            return res.status(404).json({
                success: false,
                message: 'Voyage not found'
            });
        }

        // Update voyage with actual data
        const actualData = {};

        if (actualFuelUsed) actualData.actualFuelUsed = actualFuelUsed;
        if (actualArrival) actualData.actualArrival = new Date(actualArrival);
        if (actualSpeed) actualData.actualSpeed = actualSpeed;
        if (actualDuration) actualData.actualDuration = actualDuration;
        if (deviations) actualData.deviations = Array.isArray(deviations) ? deviations : [deviations];

        voyage.actuals = { ...voyage.actuals, ...actualData };

        if (actualArrival) {
            voyage.status = 'completed';
        }

        await voyage.save();

        const performanceData = {
            voyage: {
                id: voyage._id,
                origin: voyage.origin,
                destination: voyage.destination,
                cargo: voyage.cargo,
                weather: voyage.weather
            },
            planned: voyage.plan,
            actuals: voyage.actuals,
            ship: voyage.shipId
        };

        // Get AI insights about performance
        const insights = await getPerformanceInsights(performanceData);

        res.json({
            success: true,
            message: 'Feedback submitted successfully',
            data: {
                voyageId: voyage._id,
                status: voyage.status,
                performance: calculateBasicPerformance(voyage.plan, voyage.actuals),
                insights: insights,
                dataStoredForLearning: true
            }
        });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
};

// Get performance insights from AI service
async function getPerformanceInsights(performanceData) {
    try {
        // TODO: Call external AI API for performance analysis
        // const aiInsights = await callExternalAI('/analyze-performance', performanceData);

        // For now, generate basic insights (replace with AI API response)
        return generateBasicInsights(performanceData);

    } catch (error) {
        console.error('Error getting AI insights:', error);
        return ['Performance data recorded for future analysis'];
    }
}

// Calculate basic performance metrics
function calculateBasicPerformance(planned, actuals) {
    if (!planned || !actuals) {
        return { status: 'incomplete_data' };
    }

    const performance = {};

    // Fuel efficiency comparison
    if (planned.expectedFuelUse && actuals.actualFuelUsed) {
        const fuelDiff = ((actuals.actualFuelUsed - planned.expectedFuelUse) / planned.expectedFuelUse * 100);
        performance.fuelEfficiency = {
            planned: planned.expectedFuelUse,
            actual: actuals.actualFuelUsed,
            variance: `${fuelDiff > 0 ? '+' : ''}${fuelDiff.toFixed(1)}%`,
            status: fuelDiff <= 5 ? 'good' : fuelDiff <= 15 ? 'acceptable' : 'poor'
        };
    }

    // Time performance comparison
    if (planned.estimatedDuration && actuals.actualDuration) {
        const timeDiff = ((actuals.actualDuration - planned.estimatedDuration) / planned.estimatedDuration * 100);
        performance.timeAccuracy = {
            planned: planned.estimatedDuration,
            actual: actuals.actualDuration,
            variance: `${timeDiff > 0 ? '+' : ''}${timeDiff.toFixed(1)}%`,
            status: Math.abs(timeDiff) <= 5 ? 'excellent' : Math.abs(timeDiff) <= 10 ? 'good' : 'needs_improvement'
        };
    }

    // Speed performance comparison
    if (planned.plannedSpeed && actuals.actualSpeed) {
        const speedDiff = ((actuals.actualSpeed - planned.plannedSpeed) / planned.plannedSpeed * 100);
        performance.speedAccuracy = {
            planned: planned.plannedSpeed,
            actual: actuals.actualSpeed,
            variance: `${speedDiff > 0 ? '+' : ''}${speedDiff.toFixed(1)}%`
        };
    }

    return performance;
}

// Generate basic insights (to be replaced by AI analysis)
function generateBasicInsights(performanceData) {
    const insights = [];
    const { planned, actuals } = performanceData;

    if (!planned || !actuals) {
        return ['Feedback recorded. Complete voyage data needed for detailed insights.'];
    }

    // Fuel analysis
    if (planned.expectedFuelUse && actuals.actualFuelUsed) {
        const fuelDiff = actuals.actualFuelUsed - planned.expectedFuelUse;
        const fuelPercent = (fuelDiff / planned.expectedFuelUse * 100);

        if (fuelPercent > 15) {
            insights.push(`Fuel consumption was ${fuelPercent.toFixed(1)}% higher than planned. Consider route optimization.`);
        } else if (fuelPercent < -5) {
            insights.push(`Excellent fuel efficiency! Used ${Math.abs(fuelPercent).toFixed(1)}% less fuel than planned.`);
        } else {
            insights.push('Fuel consumption was within expected range.');
        }
    }

    // Time analysis
    if (planned.estimatedDuration && actuals.actualDuration) {
        const timeDiff = actuals.actualDuration - planned.estimatedDuration;
        const timePercent = (timeDiff / planned.estimatedDuration * 100);

        if (timePercent > 10) {
            insights.push(`Journey took ${timePercent.toFixed(1)}% longer than planned. Weather or routing factors may need adjustment.`);
        } else if (timePercent < -5) {
            insights.push(`Journey completed ${Math.abs(timePercent).toFixed(1)}% faster than planned. Excellent performance!`);
        }
    }

    // Deviation analysis
    if (actuals.deviations && actuals.deviations.length > 0) {
        const weatherDeviations = actuals.deviations.filter(dev =>
            dev.toLowerCase().includes('weather') ||
            dev.toLowerCase().includes('storm') ||
            dev.toLowerCase().includes('wind')
        );

        if (weatherDeviations.length > 0) {
            insights.push('Weather-related deviations detected. This data improves future weather modeling.');
        }

        if (actuals.deviations.some(dev => dev.toLowerCase().includes('port'))) {
            insights.push('Port-related delays noted. Consider alternative scheduling for future voyages.');
        }
    }

    return insights.length > 0 ? insights : ['Voyage completed successfully. Data recorded for continuous learning.'];
} 