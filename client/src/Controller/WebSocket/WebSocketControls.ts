import { Controller } from "@/Controller";
import { Actor } from "@/Game/components/Actor";
import { Store } from "@/Model";

import { WS_SERVER_URL } from '@/config.json'

export type userInfoResponseType = { 
    name: string, 
    location: string, 
    questsCompleted: string[] 
}

type signInResponseType = { 
    status: string, 
    userInfo: userInfoResponseType;
    sessionId: string;
}

export class WebSocketControls extends WebSocket {
    controllerRef: Controller;

    constructor(controllerRef: Controller) {
        super(WS_SERVER_URL);

        this.controllerRef = controllerRef;

        this.addEventListener('message', (response) => {
            const data = JSON.parse(response.data);

            if (data['signInResponse']) this.signIn(data['signInResponse']);

            if (data['updatedInGameTime']) this.reactOnInGameTimeUpdate(data['updatedInGameTime']);

            if (data['updatedActors']) this.updateActors(data['updatedActors']);

        })

        this.onclose = () => {
            console.log('connection lost.')
        }    

        this.onopen = () => {
            this.send(JSON.stringify({ requestSession: { sessionId: localStorage.getItem('sessionId') } }))
        }
    }

    private signIn = ({ status, userInfo, sessionId }: signInResponseType) => {
        switch (status) {
            case 'ok': {
                localStorage.setItem('sessionId', sessionId)
                Store.userInfo = userInfo;
                Store.authorizationContainer.destroyAll();
                Store.userAuthorized = true;

                this.controllerRef.setup.buildApp();
                break;
            } 
            case 'wrongCredentials': {
                Store.authorizationContainer.setMessage('Wrong Credentials');
                console.log('wrong cred');
                break;
            } 
            case 'activeSessionExists': {
                Store.authorizationContainer.setMessage('Session already exists, try later.');
                console.log('session already exists');
                break;
            }
            case 'reconnectionFail': {
                Store.authorizationContainer.visible = true;
                break;
            }
        }
    }

    private reactOnInGameTimeUpdate = (inGameTime: string) => {
        console.log(inGameTime);
    }

    private updateActors(backendActors: any) {
        const { keyboard } = this.controllerRef;
        if (!Store.appIsReady) return;

        for (const name in backendActors) {
            if (!Store.actors[name]) {
                const actor = new Actor(
                    backendActors[name].name, 
                    backendActors[name].texture, 
                    backendActors[name].portrait
                );

                Store.userInfo.name === name && (Store.player = actor);

                Store.actors[name] = actor;
                
                Store.actorsLayer.addChild(Store.actors[name]);
                continue;
            }

            Store.actors[name].x = backendActors[name].x;
            Store.actors[name].y = backendActors[name].y;

            if (name !== Store.userInfo.name) continue;

            const lastBackendInputIndex = keyboard.playerInputs.findIndex(input => {
                return backendActors[name].sequenceNumber === input.sequenceNumber;
            })

            if (lastBackendInputIndex > -1) {
                keyboard.playerInputs.splice(0, lastBackendInputIndex + 1);
            }
            
            keyboard.playerInputs.forEach(input => {
                Store.actors[name].x += input.dx;
                Store.actors[name].y += input.dy;
            })
        }

        for (const name in Store.actors) {
            if (!backendActors[name]) {
                Store.actorsLayer.removeChild(Store.actors[name]);
                delete Store.actors[name];
            }
        }
    }

}