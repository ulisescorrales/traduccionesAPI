import mysql, { Pool, RowDataPacket } from 'mysql2';
import { Word } from '../interface/word';

const pool:Pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'foxy@lleN',
    database: 'playWords',
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
