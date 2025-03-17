import { Router, Request, Response } from "express";
import rabbitMQModles from "../models/rabbitMQModles";
import authMiddleware from "../middleware/auth";

const router = Router();

// Endpoint GET - pobiera wiadomości RabbitMQ według `queueName`
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { queueName } = req.query; // Pobieramy filtr z query params
        let query: any = {};

        if (queueName && queueName !== 'all') {
            query.queueName = queueName;  // 🔥 Filtrowanie po nazwie kolejki
        }

        const messages = await rabbitMQModles.find(query).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error("❌ Błąd pobierania wiadomości RabbitMQ:", error);
        res.status(500).json({ error: "Błąd serwera" });
    }
});

export default router;
