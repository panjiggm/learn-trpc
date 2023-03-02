import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initTRPC } from '@trpc/server';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

dotenv.config();

const t = initTRPC.create();

const appRouter = t.router({
  sayHi: t.procedure.query(() => {
    return 'hi';
  }),
  logToServer: t.procedure
    .input((v) => {
      if (typeof v === 'string') return v;

      throw new Error('Invalid type: Expected string');
    })
    .mutation(({ ctx, input }) => {
      console.log(`Client says: ${input}`);
      return true;
    }),
});

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/trpc', createExpressMiddleware({ router: appRouter }));

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port}`
  );
});

export type AppRouter = typeof appRouter;
