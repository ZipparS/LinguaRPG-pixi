import { Assets, DisplayObject, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { Location } from "@/Game/components/Location";
import { Group, Layer } from "@pixi/layers";
import { PreviewContainer } from "@/Game/containers/PreviewContainer";
import { AuthorizationContainer } from "@/Game/containers/AuthorizationContainer";
import { Actor } from "@/Game/components/Actor";
import { userInfoResponseType } from "@/Controller/WebSocket/WebSocketControls";
import { CompositeRectTileLayer } from "@/tilemap";
import { MapsMatrix } from "./maps.matrix";
import { GameContainer } from "@/Game/containers/GameContainer";
import { GUI } from "@/Game/containers/GameContainer/GUI";
import { ActionLayer } from "@/Game/containers/GameContainer/ActionLayer";

export class Store {
    static userAuthorized: boolean = false;
    static appIsReady: boolean = false;

    static userInfo: userInfoResponseType;

    static player: Actor;

    static authorizationContainer: AuthorizationContainer;
    static previewContainer: PreviewContainer = new PreviewContainer();
    static gameContainer: GameContainer = new GameContainer();

    static gui = new GUI();
    static actionLayer = new ActionLayer();

    static actors: { [key: string]: DisplayObject } = {};
    static actorsGroup: Group = new Group(0, true);
    static actorsLayer: Layer = new Layer(this.actorsGroup);

    static locations: { [key: string]: Location } = {};
    static actorsSpriteSheets: { [key: string]: Texture } = {};
    static portraitsTextures: { [key: string]: Texture } = {};

    static cacheLocation = (name: string, propagate: boolean = true) => ({ before, after }: { before: Texture, after: Texture }) => {
        if (this.locations[name]) return;

        after.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        before.baseTexture.scaleMode = SCALE_MODES.NEAREST;

        const beforeLayer = new CompositeRectTileLayer();
        const afterLayer = new CompositeRectTileLayer();

        const { tileWidth, tileHeight, collisionMatrix } = MapsMatrix[name];

        for (let t = 0; t < MapsMatrix[name].matrixLength; t++) { 
            let col = Math.floor(t / MapsMatrix[name].width);
            let row = t % MapsMatrix[name].width;
            MapsMatrix[name].beforeMatrix[t] && beforeLayer.tile(new Texture(
                before.baseTexture, 
                new Rectangle(row * tileWidth, col * tileHeight, tileWidth, tileHeight)
            ), row * tileWidth, col * tileHeight);
            MapsMatrix[name].afterMatrix[t] && afterLayer.tile(new Texture(
                after.baseTexture, 
                new Rectangle(row * tileWidth, col * tileHeight, tileWidth, tileHeight)
            ), row * tileWidth, col * tileHeight);
        }

        this.locations[name] = new Location({
            name,
            beforeLayer,
            afterLayer,
            collisionMatrix
        });

        if (!propagate) return;

        MapsMatrix[name].adjustedMaps.forEach(mapName => {
            Assets.loadBundle(mapName).then(this.cacheLocation(mapName, propagate=false))
        })
    }
    
    static cacheActorsSpriteSheets = ({ actors }: { actors: Texture }) => {

    }
}
