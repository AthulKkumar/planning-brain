import mongoose from 'mongoose';
import { Ship, Voyage, Maintenance } from './src/models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function addSimpleData() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/planning-brain');

    // Clear all
    await Ship.deleteMany({});
    await Voyage.deleteMany({});
    await Maintenance.deleteMany({});

    // Add 1 ship
    const ship = await Ship.create({
        shipId: new mongoose.Types.ObjectId(),
        engineType: "diesel",
        capacity: 5000,
        status: "active"
    });

    // Add 1 voyage  
    const voyage = await Voyage.create({
        shipId: ship._id,
        origin: "Mumbai",
        destination: "Dubai",
        departureTime: new Date(),
        cargo: 3000,
        weather: { forecast: "clear" },
        status: "completed"
    });

    // Add 1 maintenance
    await Maintenance.create({
        shipId: ship._id,
        type: "routine",
        description: "Engine check",
        scheduledDate: new Date('2025-07-05'),
        estimatedDuration: 4,
        priority: "critical"
    });

    console.log(`✅ Simple data added!`);
    console.log(`Ship: ${ship._id}`);
    console.log(`Voyage: ${voyage._id}`);

    await mongoose.connection.close();
}

addSimpleData().catch(console.error); 