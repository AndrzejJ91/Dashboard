
import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config()

interface AuthRequest extends Request {
    user? : string | JwtPayload

}


const SECRET_KEY = process.env.SECRET_KEY
if (!SECRET_KEY) throw new Error("SECRET_KEY nie jest ustawiony w pliku .env");

 const authMiddleware =  (req: AuthRequest, res: Response, next: NextFunction): void => {
   
    const authHeader = req.header("Authorization");
   

    if(!authHeader) {

        res.status(401).json({error:"Brak nagłówka autoryzacji" });
        return;

    };

    const parts = authHeader.split(" ");

    if(parts?.length !== 2 || parts[0] !== "Bearer") {
        res.status(401).json({ error: "Nieprawidłowy format nagłówka autoryzacji: Oczekiwano: Bearer <token>"});

    };

    // ⬅️ Pobieramy istniejący token
    const token = parts[1];

    try {
         
        // ⬅️ Weryfikujemy token
       const decoded = jwt.verify(token, SECRET_KEY as string);
        req.user = decoded;
        next();

    }catch(error: any) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token wygasł" });
            return;
        } else if (error.name === "JsonWebTokenError") {
            res.status(401).json({ error: "Nieprawidłowy token" });
            return ;
        } else {
            res.status(500).json({ error: "Wystąpił błąd podczas weryfikacji tokena." });
            return;
        }
    }

    


};

export default authMiddleware