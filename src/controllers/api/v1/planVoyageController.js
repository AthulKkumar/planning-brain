import { Ship, Voyage } from '../../../models/index.js';
import mongoose from 'mongoose';

export const planVoyage = async (req, res) => {
    try {
        let { origin, destination, departureTime, weatherForecast, cargoLoad, shipId } = req.body;

        // Validate required fields
        if (!origin || !destination || !departureTime || !weatherForecast || !cargoLoad || !shipId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        shipId = new mongoose.Types.ObjectId(shipId);

        // Fetch ship data from database
        const ship = await Ship.find(shipId);
        if (!ship) {
            return res.status(404).json({
                success: false,
                message: 'Ship not found'
            });
        }

        // Prepare data for AI optimization (external API call)
        const optimizationInput = {
            ship: {
                id: ship._id,
                engineType: ship.engineType,
                capacity: ship.capacity
            },
            voyage: {
                origin,
                destination,
                departureTime,
                cargoLoad,
                weatherForecast
            }
        };

        // TODO: Call external AI API for route optimization
        // const aiPlan = await callExternalAI('/optimize-route', optimizationInput);

        // For now, create a basic plan (replace this with AI API response)
        const plan = createBasicPlan(optimizationInput);

        const voyage = new Voyage({
            shipId,
            origin,
            destination,
            departureTime: new Date(departureTime),
            cargo: cargoLoad,
            weather: weatherForecast,
            plan: plan,
            status: 'planned'
        });

        await voyage.save();

        res.status(201).json({
            success: true,
            message: 'Voyage plan created successfully',
            data: {
                voyageId: voyage._id,
                ship: {
                    id: ship._id,
                    name: ship.name,
                    engineType: ship.engineType
                },
                plan: plan
            }
        });

    } catch (error) {
        console.error('Error creating voyage plan:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
};

// Basic plan creation (to be replaced by external AI API)
function createBasicPlan(input) {
    const { ship, voyage } = input;

    const estimatedDistance = 1000;
    const estimatedSpeed = getBasicSpeed(ship.engineType);
    const estimatedDuration = estimatedDistance / estimatedSpeed;
    const estimatedFuel = estimatedDuration * 45;

    const departureDate = new Date(voyage.departureTime);
    const arrivalDate = new Date(departureDate.getTime() + estimatedDuration * 60 * 60 * 1000);

    return {
        estimatedArrival: arrivalDate,
        plannedSpeed: estimatedSpeed,
        expectedFuelUse: Math.round(estimatedFuel * 10) / 10,
        estimatedDuration: Math.round(estimatedDuration * 10) / 10,
        route: [voyage.origin, `${voyage.origin}-waypoint`, voyage.destination],
        optimizationMethod: 'basic'
    };
}

// Basic speed lookup (this logic would be in AI service)
function getBasicSpeed(engineType) {
    const speeds = {
        'diesel': 25,
        'gas_turbine': 30,
        'electric': 20,
        'hybrid': 28
    };
    return speeds[engineType] || 25;
} 