import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import { Word } from '../interface/word';
import dotEnv  from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../interface/user'
import {ResultSetHeader} from 'mysql2'

dotEnv.config();
export const PORT=process.env.PORT ;
const salt=bcrypt.genSaltSync();

const pool:Pool=mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'playWords',
    port: 3306,
	waitForConnections:true,
	connectionLimit:10,
	queueLimit:0
});

export function saveUser(user:User):Promise<User[]>{
	const password=bcrypt.hashSync(user.password,salt);
	return new Promise((resolve,reject)=>{
		pool.query<RowDataPacket[]>('INSERT INTO user(username,password) VALUES (?,?)',[user.username,password],((err:any,result:RowDataPacket[])=>{
			if(err){
				reject(err);
			}else{
				resolve(result as User[]);
			}
		}))
	})
};

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
export function saveWordRepository(word:Word):Promise<number>{
    return new Promise((resolve, reject) => {
        pool.query<ResultSetHeader>('INSERT INTO translation_en_es (word, lexentry, translate, sense) VALUES (?, ?, ?, ?)', [word.word, word.lexentry, word.translate, word.sense], (err: any, result:ResultSetHeader) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows);
            }
        });
    });
}

export function deleteWordRepository(word:string):Promise<number>{
    return new Promise((resolve, reject) => {
        pool.query<ResultSetHeader>('DELETE FROM translation_en_es WHERE word = ?',word, (err: any, result:ResultSetHeader) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows);
            }
        });
    });
}