// server.mjs
//import { createServer } from 'http';
// const http = require('http');
import { Request, Response } from 'express';	
import { Connection } from 'mysql2';
const mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;


const connection:Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'foxy@lleN',
    database: 'playWords',
    port: 3306
});

connection.connect((err: any) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/:word', (req: Request, res: Response) => {
    let word=req.params.word;
    connection.query('SELECT lexentry,translate,sense FROM translation_en_es w where w.word='+ connection.escape(word), (err: any, result:any) => {
        if (err) {
            console.log(err);
            res.status(404).send("Palabra no encontrada")
        } else {
            res.status(200).send(result);
        }
    });
});

app.listen(port, () => {
    console.log('Server started on port '+port);
}
);
