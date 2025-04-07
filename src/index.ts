import express,{Express} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routerWordInfoInfo from './controller/wordController';
import {PORT} from './repository/wordRepository';

const app:Express = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routerWordInfoInfo);

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
}
);
