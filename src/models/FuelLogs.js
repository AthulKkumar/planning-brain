import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema({
    shipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ship',
        required: true
    },
    voyageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voyage',
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    fuelConsumption: {
        type: Number,
        required: true,
        min: 0
    },
    fuelEfficiency: {
        type: Number,
        min: 0
    },
    engineLoad: {
        type: Number,
        min: 0,
        max: 100
    },
    speed: {
        type: Number,
        min: 0
    },
    location: {
        latitude: Number,
        longitude: Number
    },
    weather: {
        windSpeed: Number,
        temperature: Number,
        seaState: String
    }
}, {
    timestamps: true
});

fuelLogSchema.index({ shipId: 1, timestamp: -1 });
fuelLogSchema.index({ voyageId: 1, timestamp: -1 });

const FuelLogs = mongoose.model('FuelLogs', fuelLogSchema);

export default FuelLogs; 