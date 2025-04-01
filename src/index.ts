import { Request, Response } from 'express';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;

const wordController=require('./controller/wordController');

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/:word', (req: Request, res: Response) => {
    let word = req.params.word;
    wordController.queryWord(word).then((result: any) => {
        res.status(200).send(result);
    }).catch((err: any) => {
        res.status(500).send("Error del servidor");
    });
});

app.listen(port, () => {
    console.log('Server started on port ' + port);
}
);
