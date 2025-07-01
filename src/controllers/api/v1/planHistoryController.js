import { Voyage } from '../../../models/index.js';
import mongoose from 'mongoose';

export const getPlanHistory = async (req, res) => {
    try {
        let { shipId, page = 1, limit = 10 } = req.query;

        shipId = new mongoose.Types.ObjectId(shipId);

        // Build search filter
        const filter = {};
        if (shipId) {
            filter.shipId = shipId;
        }


        // Get voyages from database
        const voyages = await Voyage.find(filter)
            .populate('shipId', 'name engineType capacity')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        const total = await Voyage.countDocuments(filter);

        const history = voyages.map(voyage => {
            const result = {
                voyageId: voyage._id,
                ship: voyage.shipId,
                route: {
                    origin: voyage.origin,
                    destination: voyage.destination
                },
                departureTime: voyage.departureTime,
                status: voyage.status,
                cargo: voyage.cargo,

                planned: {
                    speed: voyage.plan?.plannedSpeed || 'N/A',
                    fuel: voyage.plan?.expectedFuelUse || 'N/A',
                    duration: voyage.plan?.estimatedDuration || 'N/A',
                    arrival: voyage.plan?.estimatedArrival || 'N/A'
                },

                actuals: {
                    speed: voyage.actuals?.actualSpeed || 'N/A',
                    fuel: voyage.actuals?.actualFuelUsed || 'N/A',
                    duration: voyage.actuals?.actualDuration || 'N/A',
                    arrival: voyage.actuals?.actualArrival || 'N/A'
                }
            };

            if (voyage.plan && voyage.actuals) {
                result.performance = calculatePerformance(voyage.plan, voyage.actuals);
            }

            return result;
        });

        res.json({
            success: true,
            message: 'History retrieved successfully',
            data: history,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total
            }
        });

    } catch (error) {
        console.error('Error getting history:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
};

// Simple function to calculate performance differences
function calculatePerformance(planned, actuals) {
    const performance = {};

    // Calculate fuel efficiency
    if (planned.expectedFuelUse && actuals.actualFuelUsed) {
        const fuelDiff = ((actuals.actualFuelUsed - planned.expectedFuelUse) / planned.expectedFuelUse * 100);
        performance.fuelEfficiency = `${fuelDiff > 0 ? '+' : ''}${fuelDiff.toFixed(1)}%`;
    }

    // Calculate speed accuracy
    if (planned.plannedSpeed && actuals.actualSpeed) {
        const speedDiff = ((actuals.actualSpeed - planned.plannedSpeed) / planned.plannedSpeed * 100);
        performance.speedAccuracy = `${speedDiff > 0 ? '+' : ''}${speedDiff.toFixed(1)}%`;
    }

    // Calculate time accuracy
    if (planned.estimatedDuration && actuals.actualDuration) {
        const timeDiff = ((actuals.actualDuration - planned.estimatedDuration) / planned.estimatedDuration * 100);
        performance.timeAccuracy = `${timeDiff > 0 ? '+' : ''}${timeDiff.toFixed(1)}%`;
    }

    return performance;
} 