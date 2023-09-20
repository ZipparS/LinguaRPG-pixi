import { userInfoResponseType } from "@/Controller/WebSocket/WebSocketControls";
import { Stage } from "@pixi/layers";
import { Text } from "pixi.js";

export class GUI extends Stage {

    constructor() {
        super();
    }

    public init = (userInfo: userInfoResponseType) => {
        const name = new Text(userInfo.name, {
            fill: '#ffffff',
            fontSize: 20,
            fontWeight: 'bold'
        });

        this.addChild(name)
    }

}