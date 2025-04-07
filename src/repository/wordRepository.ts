import mysql, { Pool, ResultSetHeader, RowDataPacket } from 'mysql2';
import { WordInfoInfo } from '../interface/wordInfo';
import dotEnv  from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../interface/user'

dotEnv.config();
export const PORT=process.env.PORT ;
const salt=bcrypt.genSaltSync();

const pool:Pool=mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'playWordInfos',
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

export function queryWordInfoRepository(word:string):Promise<WordInfo[]>{
	return new Promise((resolve, reject) => {
		pool.query<RowDataPacket[]>('SELECT word,lexentry,translate,sense FROM translation_en_es w where w.word= ?',word, (err: any, result:RowDataPacket[]) => {
			if (err) {
				reject(err);
			} else {
				resolve(result as WordInfo[]);
			}
		});
	});
}
export function saveWordInfoRepository(word:WordInfo):Promise<number>{
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

export function deleteWordInfoRepository(word:string):Promise<number>{
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