import mongoose from 'mongoose';

const voyageSchema = new mongoose.Schema({
    shipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ship',
        required: true
    },
    origin: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date
    },
    cargo: {
        type: Number,
        required: true,
        min: 0
    },
    weather: {
        forecast: {
            type: String,
            required: true
        },
        windSpeed: Number,
        temperature: Number,
        humidity: Number,
        visibility: Number
    },
    plan: {
        estimatedArrival: Date,
        plannedSpeed: Number,
        expectedFuelUse: Number,
        route: [String],
        estimatedDuration: Number // in hours
    },
    actuals: {
        actualArrival: Date,
        actualSpeed: Number,
        actualFuelUsed: Number,
        actualRoute: [String],
        actualDuration: Number,
        deviations: [String]
    },
    status: {
        type: String,
        enum: ['planned', 'in_progress', 'completed', 'cancelled'],
        default: 'planned'
    }
}, {
    timestamps: true
});

const Voyage = mongoose.model('Voyage', voyageSchema);

export default Voyage; 