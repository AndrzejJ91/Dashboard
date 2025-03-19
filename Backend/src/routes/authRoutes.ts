import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import bcrypt from 'bcryptjs';
import User from '../models/User';

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY as string;



// Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100,
  message: "Too many login attempts, please try again later.",
});



// ✅ Login handling
router.post('/login', loginLimiter, [
  body('email').isEmail().withMessage("Invalid email format."),
  body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
], async (req: Request, res: Response) => {

 


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return;
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
       res.status(401).json({ error: "Invalid email or password." });
       return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
       res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "2h" });

     res.status(200).json({ token });

  } catch (error) {
    console.error(error);
     res.status(500).json({ error: "Server error." });
  }
});

export default router;





