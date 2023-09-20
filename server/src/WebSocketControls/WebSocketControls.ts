import type { IncomingMessage } from "http";
import type { RawData, Server, WebSocket } from "ws";
import { Clock } from "./Clock";

type DataType = { [key: string]: any };

export class Client {
    authorized: boolean = false;
    connectionLost: boolean = false;

    ws: WebSocket;
    req: IncomingMessage;
    id: string;
    sessionId!: string;

    username!: string;
    name!: string;
    location!: string;
    x!: number;
    y!: number;
    questsCompleted!: Array<string>;
    texture!: string;
    portrait!: string;


    constructor(ws: WebSocket, req: IncomingMessage, id: string) {
        this.ws = ws;
        this.req = req
        this.id = id;
    }

    getProgress = ({ username, name, location, x, y, questsCompleted, texture, portrait }: { 
        username: string,
        name: string,
        location: string,
        x: number,
        y: number,
        questsCompleted: Array<string>,
        texture: string,
        portrait: string, 
    }) => {
        this.username = username;
        this.name = name;
        this.location = location;
        this.x = x;
        this.y = y;
        this.questsCompleted = questsCompleted;
        this.texture = texture;
        this.portrait = portrait;
    }
}

export class WebSocketControls {
    private wss: Server;
    public clients = new Set<Client>();
    public activeSessions: { [hash: string]: Client } = {}

    public clock: Clock;

    private events: { [key: string]: (data: any, ctx: WebSocketControls & { client: Client }) => void } = {};
    constructor(wss: Server) {
        this.wss = wss;
        this.clock = new Clock();
        
        this.wss.on('connection', this.onConnection)
    }

    public addEventListener = (key: string, callback: (data: any, ctx: WebSocketControls & { client: Client }) => void) => {
        this.events[key] = callback;
        console.log('Websocket event settled.');
    }

    public removeEventListener = (key: string) => {
        if (this.events[key]) {
            delete this.events[key];
            console.log('event', key, 'removed.');
        } else {
            console.log('no such event exists.');
        }
    }

    public broadcast = (message: string) => {
        this.clients.forEach(client => client.ws.send(message));
    }

    private onConnection = (ws: WebSocket, req: IncomingMessage) => {
        const uniqueSocketId = req.headers["sec-websocket-key"]!;
        const client = new Client(ws, req, uniqueSocketId);
        
        console.log(uniqueSocketId, 'connected.')
        ws.on('message', (message: RawData) => {
            const data: DataType = JSON.parse(message.toString());
            
            Object.keys(this.events).forEach((key: string) => {
                if (data[key]) this.events[key](data[key], { ...this, client });
            })
        });
        
        ws.on("error", (err: Error) => ws.send(err.message));

        ws.on('close', this.onCloseConnection(client))
    }

    private onCloseConnection = (client: Client) => () => {
        if (client.authorized) {
            client.connectionLost = true;
        }
        console.log(client.id, 'disconnected.');
    }
}