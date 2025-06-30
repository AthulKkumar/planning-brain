import mongoose from 'mongoose';

const shipSchema = new mongoose.Schema({
    shipId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    engineType: {
        type: String,
        required: true,
        enum: ['diesel', 'gas_turbine', 'electric', 'hybrid']
    },
    capacity: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'retired'],
        default: 'active'
    }
}, {
    timestamps: true
});

const Ship = mongoose.model('Ship', shipSchema);

export default Ship; 