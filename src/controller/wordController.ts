import { Request, Response } from 'express';
import { Router } from 'express';
import { deleteWordService, queryWord, saveWord } from '../service/wordService';
import { Word } from '../interface/word';

const routerWord = Router();
routerWord.get('/words/:word', (req: Request, res: Response) => {
    let word = req.params.word;
    queryWord(word).then((result: Word[]) => {
        if (result.length == 0) {
            res.status(404).send("No se encontraron resultados");
        } else {
            res.status(200).send(result);
        }
    }).catch((err: any) => {
        res.status(500).send("Error del servidor");
    });
});
routerWord.delete('/words/:idWord', (req: Request, res: Response) => {
    //Delete a word from the database
    let idWord = req.params.word;
    if (!/^\d+$/.test(idWord)){
        res.status(400).send("Invalid word id");
    }else{
        deleteWordService(idWord).then((result: boolean) => {
            if (result) {
                res.status(200).send("Word deleted successfully");
            } else {
                res.status(400).send("Word not found");
            }
        }).catch((err: any) => {
            res.status(500).send("Error accessing the database");
        });

    }
});
routerWord.post('/words', (req: Request, res: Response) => {
    //Receives a unique word to register
    let word: Word = req.body;
    //Check if the word is empty
    if (!word.word || !word.lexentry || !word.translate || !word.sense) {
        res.status(400).send("Missing data to register the word.");
    }
    
    saveWord(word).then((result: boolean) => {
        if (result) {
            res.status(200).send("Word registered successfully");
        } else {
            res.status(400).send("Word already registered");
        }
    }).catch((err: any) => {
        res.status(500).send("Error accessing the database");
    });
    //Check if the word is empty 
    //Check if the word is already registered
    
});

export default routerWord;