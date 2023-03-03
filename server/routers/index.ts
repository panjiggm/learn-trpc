import { adminProcedure, t } from '../trpc';
import { usersRouter } from './users';

export const appRouter = t.router({
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
  secretData: adminProcedure.query(({ ctx }) => {
    console.log('ctx user', ctx.user);

    return 'Super secret admin data';
  }),
  users: usersRouter,
});
