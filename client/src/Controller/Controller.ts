import { Keyboard } from "./Keyboard";
import { Setup } from "./Setup";
import { ControllerMethods } from "./Methods";
import { WebSocketControls } from "./WebSocket";

import type { KeyboardKeys } from "./Keyboard";


export class Scripts {
    public scripts: Function[] = [];
    
    public add(callback: Function) {
        this.scripts.push(callback);
    }

    public inQueue(): boolean {
        return Boolean(this.scripts.length);
    }

    public run() {
        this.scripts.forEach(script => script());
        this.scripts = [];
    }
}

export class Controller {
    public websocket: WebSocketControls;
    
    public keyboard: Keyboard;
    
    public scripts: Scripts;

    public setup: Setup;

    public methods: ControllerMethods;

    constructor(keys: (ctx: Controller) => KeyboardKeys) {
        this.websocket = new WebSocketControls(this);
        
        this.keyboard = new Keyboard(keys(this));
        this.scripts = new Scripts();
        this.setup = new Setup(this);
        this.methods = new ControllerMethods();
    }
}