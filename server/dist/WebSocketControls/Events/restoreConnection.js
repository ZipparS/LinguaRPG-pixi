"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreConnectionEventCallback = void 0;
const restoreConnectionEventCallback = ({ sessionId }, { client, clients, activeSessions }) => {
    var _a;
    if (!activeSessions[sessionId] || !((_a = activeSessions[sessionId]) === null || _a === void 0 ? void 0 : _a.connectionLost)) {
        client.ws.send(JSON.stringify({ signInResponse: { status: 'reconnectionFail' } }));
        return;
    }
    ;
    client.getProgress(activeSessions[sessionId]);
    client.authorized = true;
    client.sessionId = sessionId;
    clients.delete(activeSessions[sessionId]);
    activeSessions[client.sessionId] = client;
    clients.add(client);
    client.ws.send(JSON.stringify({
        signInResponse: {
            status: 'ok',
            sessionId,
            userInfo: {
                name: client.name,
                location: client.location,
                questsCompleted: client.questsCompleted
            }
        }
    }));
};
exports.restoreConnectionEventCallback = restoreConnectionEventCallback;
