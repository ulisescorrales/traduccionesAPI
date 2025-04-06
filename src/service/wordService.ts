import { deleteWordRepository, queryWordRepository, saveWordRepository } from '../repository/wordRepository';
import { Word } from '../interface/word';

export function queryWord(word: string): Promise<Word[]> {
    return new Promise<Word[]>((resolve, reject) =>
        queryWordRepository(word).then((result: Word[]) => {
            resolve(result);
        }).catch((err: any) => {
            reject("Error accediendo a la base de datos")
        })
    );
}
export function saveWord(word:Word): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) =>{
        saveWordRepository(word).then((result: number) => {
            if (result == 0) {
                reject("No se pudo registrar la palabra");
            }else {
                resolve(true);
            }
        }).catch((err: any) => {
            reject("Error accediendo a la base de datos")
        })
    })
};
export function deleteWordService(word: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        deleteWordRepository(word).then((result: number) => {
            if (result == 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        }).catch((err: any) => {
            reject("Error accediendo a la base de datos")
        });
    });
}