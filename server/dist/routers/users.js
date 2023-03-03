"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const trpc_1 = require("../trpc");
const zod_1 = __importDefault(require("zod"));
const observable_1 = require("@trpc/server/dist/observable");
const stream_1 = require("stream");
const userProcedure = trpc_1.t.procedure.input(zod_1.default.object({ userId: zod_1.default.string() }));
const eventEmitter = new stream_1.EventEmitter();
exports.usersRouter = trpc_1.t.router({
    getUser: userProcedure.query(({ input }) => {
        return { id: input.userId };
    }),
    update: userProcedure
        .input(zod_1.default.object({ name: zod_1.default.string() }))
        .mutation((req) => {
        console.log(`Updating user ${req.input.userId} and name to ${req.input.name}`);
        eventEmitter.emit('update', req.input.userId);
        return { id: req.input.userId, name: req.input.name };
    }),
    onUpdate: trpc_1.t.procedure.subscription(() => {
        return (0, observable_1.observable)((emit) => {
            eventEmitter.on('update', emit.next);
            return () => {
                eventEmitter.off('update', emit.next);
            };
        });
    }),
});
