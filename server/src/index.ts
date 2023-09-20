import mongoose from 'mongoose';
import http from "http";
import express, { Express } from 'express';
import WebSocket from 'ws';
import dotenv from 'dotenv';

import { WebSocketControls } from "./WebSocketControls/WebSocketControls";
import { Store } from "./Model";
import { Progress, progressSchema } from './mongodb';
import { signInEventCallback } from './WebSocketControls/Events/signIn';
import { requestSessionEventCallback } from './WebSocketControls/Events/requestSession';
import { keyholdingEventCallback } from './WebSocketControls/Events/keyholding';

dotenv.config();

const app: Express = express();
const port = process.env.WEBSOCKER_SERVER_PORT;

const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server });

const WSC = new WebSocketControls(webSocketServer);

WSC.addEventListener('requestSession', requestSessionEventCallback)

WSC.addEventListener('signIn', signInEventCallback);

WSC.addEventListener('keyholding', keyholdingEventCallback)

let oldTime = Date.now();
setInterval(() => {
    const newTime = Date.now();
    const previousInGameTime = WSC.clock.getInGameTime();

    WSC.clock.setInGameTime(new Date().getSeconds() + (new Date().getMinutes() * 60));
    WSC.clock.setDeltaFrame(newTime - oldTime); oldTime = newTime;

    if (WSC.clock.getInGameTime() !== previousInGameTime) {
        WSC.broadcast(JSON.stringify({ updatedInGameTime: WSC.clock.getInGameTime() }))
    }

    WSC.clients.forEach(client => client.ws.send(
        JSON.stringify({ updatedActors: Store.locations[client.location].actors })
    ))
}, 15);

const writeClientsProgress = () => {
    Progress.bulkWrite<typeof progressSchema>(
        Array.from(WSC.clients).map(({ username, location, x, y, questsCompleted }) => Object({
            updateOne: {
                filter: { username },
                update: { $set: { questsCompleted, location, x, y } }
            }
        }))
    );

    WSC.clients.forEach(client => {
        if (client.connectionLost) {
            delete WSC.activeSessions[client.sessionId];
            delete Store.locations[client.location].actors[client.name];
            WSC.clients.delete(client);
        }
    })
}

setInterval(writeClientsProgress, 15000);

mongoose.connect('mongodb://localhost:27017/LinguaRPG').then(() => {
    server.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}).catch(reason => {
    throw new Error(reason);
})
