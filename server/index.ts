import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { appRouter } from './routers';
import { createContext } from './context';
import ws from 'ws';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

const server = app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}`
  );
});

applyWSSHandler({
  wss: new ws.Server({ server }),
  router: appRouter,
  createContext,
});

export type AppRouter = typeof appRouter;
