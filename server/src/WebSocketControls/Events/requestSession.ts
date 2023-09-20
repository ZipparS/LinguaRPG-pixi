import { Client, WebSocketControls } from "../WebSocketControls";

export const requestSessionEventCallback = (
    { sessionId }: { sessionId: string }, 
    { client, clients, activeSessions }: WebSocketControls & { client: Client }
) => {
    if (!activeSessions[sessionId] || !activeSessions[sessionId]?.connectionLost) {
        client.ws.send(JSON.stringify({ signInResponse: { status: 'reconnectionFail' } })); return;
    };

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
    }))
}