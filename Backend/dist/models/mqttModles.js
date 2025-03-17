"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MqttSchema = new mongoose_1.Schema({
    topic: {
        type: String,
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'OK',
    },
    sender: {
        type: String,
        default: 'unknown',
    },
    qos: {
        type: Number,
        default: 0,
    },
    retain: {
        type: Boolean,
        default: false,
    },
    received: {
        type: Boolean,
        default: false,
    },
    isRead: {
        type: Boolean,
        default: false, // domyślnie wiadomość jest nieprzeczytana
    },
}, {
    timestamps: true,
});
MqttSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
exports.default = (0, mongoose_1.model)('Mqtt', MqttSchema);
