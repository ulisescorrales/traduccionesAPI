import { Pool, RowDataPacket} from 'mysql2';
const mysql = require('mysql2');


const pool:Pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'playWords',
    port: 3306,
	waitForConnections:true,
	connectionLimit:10,
	queueLimit:0
});

function queryWordRepository(word:string){
    pool.query<RowDataPacket[]>('SELECT lexentry,translate,sense FROM translation_en_es w where w.word= ?',word, (err: any, result) => {
    });
}
import { Pool, RowDataPacket} from 'mysql2';
const mysql = require('mysql2');


const pool:Pool=mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'playWords',
    port: 3306,
	waitForConnections:true,
	connectionLimit:10,
	queueLimit:0
});

function queryWord(word:string){
    pool.query<RowDataPacket[]>('SELECT lexentry,translate,sense FROM translation_en_es w where w.word= ?',word, (err: any, result) => {
        
    });
}