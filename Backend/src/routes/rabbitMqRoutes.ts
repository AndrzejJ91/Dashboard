import { Router, Request, Response } from "express";
import rabbitMQModles from "../models/rabbitMQModles";
import authMiddleware from "../middleware/auth";

const router = Router();

// GET Endpoint - retrieves RabbitMQ messages by `queueName`
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { queueName } = req.query; // Retrieve filter from query parameters
        let query: any = {};

        if (queueName && queueName !== 'all') {
            query.queueName = queueName; // 🔥 Filtering by queue name
        }

        const messages = await rabbitMQModles.find(query).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error("❌ Error while fetching RabbitMQ messages:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
