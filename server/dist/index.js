"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@trpc/server");
const express_2 = require("@trpc/server/adapters/express");
dotenv_1.default.config();
const t = server_1.initTRPC.create();
const appRouter = t.router({
    sayHi: t.procedure.query(() => {
        return 'hi';
    }),
    logToServer: t.procedure
        .input((v) => {
        if (typeof v === 'string')
            return v;
        throw new Error('Invalid type: Expected string');
    })
        .mutation(({ ctx, input }) => {
        console.log(`Client says: ${input}`);
        return true;
    }),
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: 'http://localhost:5173' }));
app.use('/trpc', (0, express_2.createExpressMiddleware)({ router: appRouter }));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
