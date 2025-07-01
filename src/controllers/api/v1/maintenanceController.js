import { Maintenance, Ship, FuelLogs } from '../../../models/index.js';
import mongoose from 'mongoose';


export const getMaintenanceAlerts = async (req, res) => {
    try {
        let { shipId, timeframe = 30 } = req.query;

        shipId = new mongoose.Types.ObjectId(shipId);

        // Build filter for scheduled maintenance
        const filter = {
            scheduledDate: {
                $lte: new Date(Date.now() + parseInt(timeframe) * 24 * 60 * 60 * 1000)
            }
        };

        if (shipId) {
            filter.shipId = shipId;
        }

        // Get scheduled maintenance from database
        const scheduledMaintenance = await Maintenance.find(filter)
            .populate('shipId', 'name engineType capacity')
            .sort({ scheduledDate: 1 });

        const alerts = organizeAlerts(scheduledMaintenance);

        let aiRecommendations = [];
        if (shipId) {
            aiRecommendations = await getAIMaintenanceRecommendations(shipId);
        }

        const summary = {
            totalScheduled: scheduledMaintenance.length,
            criticalCount: alerts.critical.length,
            upcomingCount: alerts.upcoming.length,
            overdueCount: alerts.overdue.length,
            aiRecommendations: aiRecommendations.length
        };

        res.json({
            success: true,
            message: 'Maintenance alerts retrieved successfully',
            data: {
                scheduledAlerts: alerts,
                aiRecommendations: aiRecommendations,
                summary: summary,
                timeframe: parseInt(timeframe)
            }
        });

    } catch (error) {
        console.error('Error getting maintenance alerts:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
};

// Organize scheduled maintenance by priority and timing
function organizeAlerts(maintenanceList) {
    const alerts = {
        critical: [],
        upcoming: [],
        overdue: []
    };

    const now = new Date();

    maintenanceList.forEach(maintenance => {
        const scheduledDate = new Date(maintenance.scheduledDate);
        const daysUntil = Math.ceil((scheduledDate - now) / (1000 * 60 * 60 * 24));

        const alert = {
            id: maintenance._id,
            ship: maintenance.shipId,
            type: maintenance.type,
            component: maintenance.component,
            description: maintenance.description,
            scheduledDate: maintenance.scheduledDate,
            priority: maintenance.priority,
            daysUntil: daysUntil
        };

        if (daysUntil < 0) {
            alerts.overdue.push(alert);
        } else if (maintenance.priority === 'critical' || daysUntil <= 3) {
            alerts.critical.push(alert);
        } else {
            alerts.upcoming.push(alert);
        }
    });

    return alerts;
}

// Get AI maintenance recommendations (calls external AI service)
async function getAIMaintenanceRecommendations(shipId) {
    try {
        const ship = await Ship.findById(shipId);
        if (!ship) return [];

        const recentUsageData = await FuelLogs.find({
            shipId: shipId,
            timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ timestamp: -1 }).limit(50);

        const aiInput = {
            ship: {
                id: ship._id,
                engineType: ship.engineType,
                capacity: ship.capacity,
                name: ship.name
            },
            usageData: recentUsageData,
            timeframe: 90
        };

        // TODO: Call external AI API for maintenance predictions
        // const aiRecommendations = await callExternalAI('/predict-maintenance', aiInput);

        // For now, return basic recommendations (replace with AI API response)
        const recommendations = generateBasicRecommendations(ship, recentUsageData);

        return recommendations;

    } catch (error) {
        console.error('Error getting AI maintenance recommendations:', error);
        return [];
    }
}

// Basic maintenance recommendations (to be replaced by AI API)
function generateBasicRecommendations(ship, usageData) {
    const recommendations = [];

    if (usageData.length > 10) {
        const avgEfficiency = usageData.reduce((sum, log) =>
            sum + (log.fuelEfficiency || 0), 0) / usageData.length;

        if (avgEfficiency < 15) {
            recommendations.push({
                ship: ship,
                component: 'Engine',
                description: 'Engine efficiency below optimal range',
                priority: 'medium',
                suggestedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                reason: 'Performance degradation detected',
                aiConfidence: 0.7,
                source: 'basic_analysis'
            });
        }
    }

    // Time-based maintenance check
    const lastMaintenance = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);
    recommendations.push({
        ship: ship,
        component: 'General Systems',
        description: 'Routine maintenance cycle due',
        priority: 'low',
        suggestedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        reason: 'Time-based maintenance schedule',
        aiConfidence: 0.9,
        source: 'basic_analysis'
    });

    return recommendations;
} 