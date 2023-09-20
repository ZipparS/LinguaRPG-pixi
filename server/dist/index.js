"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
const WebSocketControls_1 = require("./WebSocketControls/WebSocketControls");
const Model_1 = require("./Model");
const mongodb_1 = require("./mongodb");
const signIn_1 = require("./WebSocketControls/Events/signIn");
const requestSession_1 = require("./WebSocketControls/Events/requestSession");
const keyholding_1 = require("./WebSocketControls/Events/keyholding");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.WEBSOCKER_SERVER_PORT;
const server = http_1.default.createServer(app);
const webSocketServer = new ws_1.default.Server({ server });
const WSC = new WebSocketControls_1.WebSocketControls(webSocketServer);
WSC.addEventListener('requestSession', requestSession_1.requestSessionEventCallback);
WSC.addEventListener('signIn', signIn_1.signInEventCallback);
WSC.addEventListener('keyholding', keyholding_1.keyholdingEventCallback);
let oldTime = Date.now();
setInterval(() => {
    const newTime = Date.now();
    const previousInGameTime = WSC.clock.getInGameTime();
    WSC.clock.setInGameTime(new Date().getSeconds() + (new Date().getMinutes() * 60));
    WSC.clock.setDeltaFrame(newTime - oldTime);
    oldTime = newTime;
    if (WSC.clock.getInGameTime() !== previousInGameTime) {
        WSC.broadcast(JSON.stringify({ updatedInGameTime: WSC.clock.getInGameTime() }));
    }
    WSC.clients.forEach(client => client.ws.send(JSON.stringify({ updatedActors: Model_1.Store.locations[client.location].actors })));
}, 15);
const writeClientsProgress = () => {
    mongodb_1.Progress.bulkWrite(Array.from(WSC.clients).map(({ username, location, x, y, questsCompleted }) => Object({
        updateOne: {
            filter: { username },
            update: { $set: { questsCompleted, location, x, y } }
        }
    })));
    WSC.clients.forEach(client => {
        if (client.connectionLost) {
            delete WSC.activeSessions[client.sessionId];
            delete Model_1.Store.locations[client.location].actors[client.name];
            WSC.clients.delete(client);
        }
    });
};
setInterval(writeClientsProgress, 15000);
mongoose_1.default.connect('mongodb://localhost:27017/LinguaRPG').then(() => {
    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}).catch(reason => {
    throw new Error(reason);
});
