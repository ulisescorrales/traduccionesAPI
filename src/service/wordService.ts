import { queryWordRepository } from '../repository/wordRepository';
import { Word } from '../interface/word';

export function queryWord(word: string): Promise<Word[]> {
    return new Promise<Word[]>((resolve, reject) =>
        queryWordRepository(word).then((result: Word[]) => {
            resolve(result);
        }).catch((err: any) => {
			console.log(err)
            reject("Error accediendo a la base de datos")
        })
    );
}
