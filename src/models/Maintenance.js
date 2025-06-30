import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
    shipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ship',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['routine', 'preventive', 'corrective', 'emergency', 'overhaul']
    },
    description: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    completedDate: {
        type: Date
    },
    estimatedDuration: {
        type: Number,
        required: true
    },
    actualDuration: {
        type: Number
    },
    cost: {
        type: Number,
        min: 0
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'overdue'],
        default: 'scheduled'
    },
    aiRecommended: {
        type: Boolean,
        default: false
    },
    aiReasonCode: {
        type: String,
        enum: ['usage_threshold', 'time_based', 'performance_degradation', 'failure_prediction'],
        default: 'usage_threshold'
    }
}, {
    timestamps: true
});

maintenanceSchema.index({ shipId: 1, scheduledDate: 1 });
maintenanceSchema.index({ status: 1, priority: -1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance; 