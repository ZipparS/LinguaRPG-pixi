"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInEventCallback = void 0;
const Actor_1 = require("../../Game/components/Actor");
const Model_1 = require("../../Model");
const crypto_1 = require("crypto");
const mongodb_1 = require("../../mongodb");
const invalidCredentials = (accounts) => !accounts.length;
const activeSessionExists = (activeSessions, username) => {
    for (const session in activeSessions) {
        if (activeSessions[session].username === username && !activeSessions[session].connectionLost)
            return true;
    }
    return false;
};
const signInEventCallback = ({ username, password }, { client, clients, activeSessions }) => {
    mongodb_1.Account.find({ username, password }).then((accounts) => {
        if (activeSessionExists(activeSessions, username)) {
            client.ws.send(JSON.stringify({ signInResponse: { status: 'activeSessionExists' } }));
            return;
        }
        if (invalidCredentials(accounts)) {
            client.ws.send(JSON.stringify({ signInResponse: { status: 'wrongCredentials' } }));
            return;
        }
        mongodb_1.Progress.find({ username }).then((progress) => {
            const clientProgress = progress[0];
            client.getProgress(clientProgress);
            client.authorized = true;
            client.sessionId = (0, crypto_1.createHash)('sha1').update(client.id).digest('hex');
            activeSessions[client.sessionId] = client;
            clients.add(client);
            const player = new Actor_1.Actor({
                type: 'player',
                name: client.name,
                texture: client.texture,
                portrait: client.portrait,
                x: client.x,
                y: client.y
            });
            Model_1.Store.locations[client.location].actors[client.name] = player;
            client.ws.send(JSON.stringify({
                signInResponse: {
                    status: 'ok',
                    sessionId: client.sessionId,
                    userInfo: {
                        name: client.name,
                        location: client.location,
                        questsCompleted: client.questsCompleted
                    }
                }
            }));
            console.log(client.id, 'authorized.');
        }).catch(() => {
            console.error('on signIn trying getting username:', username, 'progress.');
        });
    }).catch(console.error);
};
exports.signInEventCallback = signInEventCallback;
