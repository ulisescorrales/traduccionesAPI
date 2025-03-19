// server.mjs
//import { createServer } from 'http';
// const http = require('http');
import { Request, Response } from 'express';	
import { Connection } from 'mysql';
const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;


const connection:Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
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

// const server: Server = http.createServer((req: ClientRequest, res: ServerResponse) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World!\n');
// });



// starts a simple http server locally on port 3000
// server.listen(port, '127.0.0.1', () => {
//     console.log('Listening on 127.0.0.1:3000');
// });

app.get('/api/:word', (req: Request, res: Response) => {
    let word=req.params.word;
    connection.query('SELECT word,translation FROM words w where w.word='+ connection.escape(word), (err: any, result:any) => {
        if (err) {
            console.log(err);
            res.status(404).send("Palabra no encontrada")
        } else {
            res.status(200).send(result);
        }
    });
});

app.listen(port, () => {
    console.log('Server started on port ${port}');
}
);