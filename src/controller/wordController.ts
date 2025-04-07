import { Request, Response } from 'express';
import { Router } from 'express';
import { deleteWordInfoInfoService, queryWordInfoInfo, saveWordInfoInfo } from '../service/wordService';
import { WordInfoInfo } from '../interface/wordInfo';
import jwt from 'jsonwebtoken';
const routerWordInfoInfo:Router = Router()
import dotEnv  from 'dotenv'
dotEnv.config();
// const token=jwt.sign({foo:'bar'},"secret",{expiresIn:"1h"});

function verifyJWT(req:Request,res:Response,next:any){
	if(req.body.jwt){
		try{
			jwt.verify(req.body.jwt,process.env.JWT_SECRET as string)
			next();
		}catch(err){
			res.status(401).send("401 Unauthorized")
		}
	}else{
		res.status(401).send("401 Unauthorized")
	}
}
function createJWT(req:Request,res:Response,next:any){
	
}

routerWordInfoInfo.get('/words/:word',(req: Request, res: Response) => {
    let word = req.params.word;
    queryWordInfoInfo(word).then((result: WordInfoInfo[]) => {
        if (result.length == 0) {
            res.status(404).send("No se encontraron resultados");
        } else {
            res.status(200).send(result);
        }
    }).catch((err: any) => {
		console.log(err);
        res.status(500).send("Error del servidor");
    });
});


routerWordInfoInfo.delete('/words/:idWordInfoInfo', (req: Request, res: Response) => {
    //Delete a word from the database
    let idWordInfoInfo = req.params.word;
    if (!/^\d+$/.test(idWordInfoInfo)){
        res.status(400).send("Invalid word id");
    }else{
        deleteWordInfoInfoService(idWordInfoInfo).then((result: boolean) => {
            if (result) {
                res.status(200).send("WordInfoInfo deleted successfully");
            } else {
                res.status(400).send("WordInfoInfo not found");
            }
        }).catch((err: any) => {
            res.status(500).send("Error accessing the database");
        });

    }
});
routerWordInfoInfo.post('/words', (req: Request, res: Response) => {
    //Receives a unique word to register
    let word: WordInfoInfo = req.body;
    //Check if the word is empty
    if (!word.word || !word.lexentry || !word.translate || !word.sense) {
        res.status(400).send("Missing data to register the word.");
    }
    
    saveWordInfoInfo(word).then((result: boolean) => {
        if (result) {
            res.status(200).send("WordInfoInfo registered successfully");
        } else {
            res.status(400).send("WordInfoInfo already registered");
        }
    }).catch((err: any) => {
        res.status(500).send("Error accessing the database");
    });
    //Check if the word is empty 
    //Check if the word is already registered
    
});

export default routerWordInfoInfo;
