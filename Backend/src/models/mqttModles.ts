import { Schema, model, Document } from 'mongoose';

interface IMqtt extends Document {
  topic: string;
  message: string;
  category: string;
  status?: string;
  sender?: string;
  qos?: number;
  retain?: boolean;
  received?: boolean;
  isRead?: boolean; 
}

const MqttSchema = new Schema<IMqtt>(
  {
    topic: {
      type: String,
      required: true,
      index: true,
    },
    category: { 
      type: String, 
      required: true
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
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

MqttSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export default model<IMqtt>('Mqtt', MqttSchema, 'mqtts');

