import { Request, Response } from 'express';
import { Router } from 'express';
import { queryWord } from '../service/wordService';
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
routerWord.post('/words', (req: Request, res: Response) => {
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