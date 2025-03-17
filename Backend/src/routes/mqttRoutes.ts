import { Router, Request, Response } from "express";
import Mqtt from '../models/mqttModles';
import  authMiddleware  from "../middleware/auth";



const router = Router();


// Endpoint zwracający wszystkie wiadomości zapisane w MongoDB

router.get('/', authMiddleware, async (req: Request, res: Response) => {
       try{

                

               const message = await Mqtt.find().sort({createdAt: -1});
               res.json(message);
       
       
           }catch(error){
               console.error("Błąd podczas pobierania wiadomości:", error);
               res.status(500).json({message: "Błąd podczas pobierania wiadomości"});
           };

});


// Endpoint oznaczający wiadomość jako przeczytaną


router.patch('/:id/read',  async (req: Request, res: Response) => {

     try {
            const updatedMessage = await Mqtt.findByIdAndUpdate(
                req.params.id,
                {isRead:true},
                {new:true}
            );
            res.json(updatedMessage);
    
        }catch(error){
            console.error("Błąd podczas oznaczania wiadomości jako przeczytanej:", error);
            res.status(500).json({message: "Błąd podczas oznaczania wiadomości jako przeczytanej"});
    
      };

});


export default router;

