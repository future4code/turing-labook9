import express from 'express';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import { userRouter } from './routes/userRouter';
import { postsRouter } from './routes/postsRouter';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/user', userRouter);
app.use('/posts', postsRouter);
//primeiro parametro: caminho da rota para entidade
//segundo parametro: a variavel do router

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
