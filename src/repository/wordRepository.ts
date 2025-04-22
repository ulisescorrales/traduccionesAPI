# 0 "../backup/wordRepository.ts"
# 0 "<built-in>"
# 0 "<command-line>"
# 1 "/usr/include/stdc-predef.h" 1 3 4
# 0 "<command-line>" 2
# 1 "../backup/wordRepository.ts"
import mysql, { Pool, RowDataPacket } from 'mysql2';
import { Word } from '../interface/word';

const pool:Pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'traducciones',
    port: 3306,
 waitForConnections:true,
 connectionLimit:10,
 queueLimit:0
});

export function queryWordRepository(word:string):Promise<Word[]>{
    return new Promise((resolve, reject) => {
        pool.query<RowDataPacket[]>('SELECT lexentry,translate,sense FROM translation_en_es w where w.word= ?',word, (err: any, result:RowDataPacket[]) => {
            if (err) {
                reject(err);
            } else {
                resolve(result as Word[]);
            }
        });
    });
}
