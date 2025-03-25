import { Request, Response } from 'express';	
import { Connection, Pool, RowDataPacket} from 'mysql2';
const mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;

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

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/:word', (req: Request, res: Response) => {
    let word=req.params.word;
    pool.query<RowDataPacket[]>('SELECT lexentry,translate,sense FROM translation_en_es w where w.word= ?',word, (err: any, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error del servidor")
        } else if(result.length==0){
			res.status(404).send("No existe palabra");
		}else{
            res.status(200).send(result);
		}
    });
});

app.listen(port, () => {
    console.log('Server started on port '+port);
}
);
