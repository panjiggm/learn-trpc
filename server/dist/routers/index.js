"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("../trpc");
const users_1 = require("./users");
exports.appRouter = trpc_1.t.router({
    sayHi: trpc_1.t.procedure.query(() => {
        return 'hi';
    }),
    logToServer: trpc_1.t.procedure
        .input((v) => {
        if (typeof v === 'string')
            return v;
        throw new Error('Invalid type: Expected string');
    })
        .mutation(({ ctx, input }) => {
        console.log(`Client says: ${input}`);
        return true;
    }),
    secretData: trpc_1.adminProcedure.query(({ ctx }) => {
        console.log('ctx user', ctx.user);
        return 'Super secret admin data';
    }),
    users: users_1.usersRouter,
});
