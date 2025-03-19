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
               console.error("Error while fetching messages:", error);
               res.status(500).json({message: "Error while fetching messages"});
           };

});


// Endpoint marking a message as read


router.patch('/:id/read',  async (req: Request, res: Response) => {

     try {
            const updatedMessage = await Mqtt.findByIdAndUpdate(
                req.params.id,
                {isRead:true},
                {new:true}
            );
            res.json(updatedMessage);
    
        }catch(error){
            console.error("Error while marking the message as read:", error);
            res.status(500).json({message: "Error while marking the message as read"});
    
      };

});


export default router;

