import express from 'express';
import dotenv from 'dotenv';
import { AddressInfo } from 'net';
import { userRouter } from './routes/userRouter';
import { postsRouter } from './routes/postsRouter';
import { likesRouter } from './routes/likesRouter';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/user', userRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
