"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketControls = exports.Client = void 0;
const Clock_1 = require("./Clock");
class Client {
    constructor(ws, req, id) {
        this.authorized = false;
        this.connectionLost = false;
        this.getProgress = ({ username, name, location, x, y, questsCompleted, texture, portrait }) => {
            this.username = username;
            this.name = name;
            this.location = location;
            this.x = x;
            this.y = y;
            this.questsCompleted = questsCompleted;
            this.texture = texture;
            this.portrait = portrait;
        };
        this.ws = ws;
        this.req = req;
        this.id = id;
    }
}
exports.Client = Client;
class WebSocketControls {
    constructor(wss) {
        this.clients = new Set();
        this.activeSessions = {};
        this.events = {};
        this.addEventListener = (key, callback) => {
            this.events[key] = callback;
            console.log('Websocket event settled.');
        };
        this.removeEventListener = (key) => {
            if (this.events[key]) {
                delete this.events[key];
                console.log('event', key, 'removed.');
            }
            else {
                console.log('no such event exists.');
            }
        };
        this.broadcast = (message) => {
            this.clients.forEach(client => client.ws.send(message));
        };
        this.onConnection = (ws, req) => {
            const uniqueSocketId = req.headers["sec-websocket-key"];
            const client = new Client(ws, req, uniqueSocketId);
            console.log(uniqueSocketId, 'connected.');
            ws.on('message', (message) => {
                const data = JSON.parse(message.toString());
                Object.keys(this.events).forEach((key) => {
                    if (data[key])
                        this.events[key](data[key], Object.assign(Object.assign({}, this), { client }));
                });
            });
            ws.on("error", (err) => ws.send(err.message));
            ws.on('close', this.onCloseConnection(client));
        };
        this.onCloseConnection = (client) => () => {
            if (client.authorized) {
                client.connectionLost = true;
            }
            console.log(client.id, 'disconnected.');
        };
        this.wss = wss;
        this.clock = new Clock_1.Clock();
        this.wss.on('connection', this.onConnection);
    }
}
exports.WebSocketControls = WebSocketControls;
