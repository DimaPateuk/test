import express from 'express';
import cors from 'cors';
import { api } from './routes';

const app = express();
const port = 3000;
const corsOptions = {
    origin: 'http://localhost',
};

app.use(cors(corsOptions));
app.use('/api', api);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));