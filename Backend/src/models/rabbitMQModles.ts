import mongoose, { Schema, model, Document } from "mongoose";

interface IRabbitMQ extends Document {
    topic: string;
    message: string;
    queueName: string;
    status: 'pending' | 'processed' | 'failed';
    attempts: number;
    scheduledAt?: Date;
}

const RabbitMQSchema = new Schema<IRabbitMQ>(
    {
        topic: {
            type: String,
            required: true,
            index: true,
        },
        message: {
            type: String,
            required: true,
            default: "Brak treści"
        },
        queueName: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['pending', 'processed', 'failed'],
            default: 'pending',
        },
        attempts: {
            type: Number,
            default: 0,
        },
        scheduledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

RabbitMQSchema.index({createdAt: 1}, {expireAfterSeconds: 3600})

export default mongoose.model<IRabbitMQ>("RabbitMQ", RabbitMQSchema);
