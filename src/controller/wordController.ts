import { Request, Response } from 'express';
import { Router } from 'express';
import { queryWord } from '../service/wordService';
import { Word } from '../interface/word';
import jwt from 'jsonwebtoken';
const routerWord:Router = Router()
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

routerWord.get('/words/:word',verifyJWT,(req: Request, res: Response) => {
    let word = req.params.word;
    queryWord(word).then((result: Word[]) => {
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


routerWord.post('/words',verifyJWT ,(req: Request, res: Response) => {
    //Receives a unique word to register
    let word: Word = req.body;
    //Check if the word is empty
    if (!word.word || !word.lexentry || !word.translate || !word.sense) {
        res.status(400).send("Missing data to register the word.");
    }
    //Check if the word is already registered
    queryWord(word.word).then((result: Word[]) => {
    });
});

export default routerWord;
