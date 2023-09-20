import { Actor } from "../../Game/components/Actor";
import { Store } from "../../Model";
import { Client, WebSocketControls } from "../../WebSocketControls/WebSocketControls";
import { createHash } from "crypto";
import { Account, IAccount, IProgress, Progress } from "../../mongodb";

const invalidCredentials = (accounts: IAccount[]) => !accounts.length;

const activeSessionExists = (activeSessions: { [hash: string]: Client }, username: string) => {
    for (const session in activeSessions) {
        if (activeSessions[session].username === username && !activeSessions[session].connectionLost) return true;
    }
    return false;
}

export const signInEventCallback = (
    { username, password }: { username: string, password: string }, 
    { client, clients, activeSessions }: WebSocketControls & { client: Client }
) => {
    Account.find({ username, password }).then((accounts) => {
        if (activeSessionExists(activeSessions, username)) {
            client.ws.send(JSON.stringify({ signInResponse: { status: 'activeSessionExists' } }))
            return;
        }
        if (invalidCredentials(accounts)) {
            client.ws.send(JSON.stringify({ signInResponse: { status: 'wrongCredentials' } }))
            return;
        }

        Progress.find({ username }).then((progress) => {
            const clientProgress: IProgress = progress[0];
            client.getProgress(clientProgress);
            client.authorized = true;
            client.sessionId = createHash('sha1').update(client.id).digest('hex');
            activeSessions[client.sessionId] = client;
            clients.add(client);
            
            const player = new Actor({
                type: 'player',
                name: client.name,
                texture: client.texture,
                portrait: client.portrait,
                x: client.x,
                y: client.y
            });
            
            Store.locations[client.location].actors[client.name] = player;
            
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
            }))

            console.log(client.id, 'authorized.');
        }).catch(() => {
            console.error('on signIn trying getting username:', username, 'progress.')
        })
    }).catch(console.error)
}