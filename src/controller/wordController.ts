import { Request, Response} from 'express';
import { Router } from 'express';
import { queryWord } from '../service/wordService';
import { Word } from '../interface/word';

const routerWord = Router();
routerWord.get('/:word', (req: Request, res: Response) => {
    let word = req.params.word;
    queryWord(word).then((result: Word[]) => {
        if(result.length==0){
            res.status(404).send("No se encontraron resultados");
        }else{
            res.status(200).send(result);
        }
    }).catch((err: any) => {
        res.status(500).send("Error del servidor");
    });
});
export default routerWord;