import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Server Running');
});

app.listen(`${port}`, () => {
  console.log(`🚀 server started on  http://localhost:${port}`);
});
