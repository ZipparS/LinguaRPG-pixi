import { Assets, Graphics, Point } from "pixi.js";
import { Controller } from "../Controller";
import { Store } from "@/Model";


const sleep = (delay: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, delay))

export class Setup {
    private controllerRef: Controller;

    constructor(controllerRef: Controller) {
        this.controllerRef = controllerRef;
    }

    private initPreviewLoadingScreen = async () => {
        const { methods } = this.controllerRef;
        const previewContainer = Store.previewContainer;
        
        previewContainer.addChild(previewContainer.logo);
        previewContainer.addChild(previewContainer.previewImage);
        
        
        await methods.fadeIn([previewContainer], 0.02);
        previewContainer.addChild(previewContainer.progressBar);
        previewContainer.addChild(previewContainer.previewText);
    }

    

    public buildApp = async () => {
        const { methods } = this.controllerRef;
        const { setBuildPhaseText, setLoadingProgress } = Store.previewContainer;
        await this.initPreviewLoadingScreen();

        console.log(Store.userInfo);

        await Assets.loadBundle(Store.userInfo.location)
            .then(Store.cacheLocation(Store.userInfo.location));

        await Assets.loadBundle('actors')
            .then(Store.cacheActorsSpriteSheets);

        Store.gui.init(Store.userInfo);
        
        Store.actorsGroup.on('sort', (sprite: Graphics) => {
            sprite.zOrder = sprite.position.y;
        })

        Store.actionLayer.scale.set(3, 3);

        Store.actionLayer.addChild(Store.locations[Store.userInfo.location].beforeLayer);
        Store.actionLayer.addChild(Store.actorsLayer);
        Store.actionLayer.addChild(Store.locations[Store.userInfo.location].afterLayer);

        Store.gameContainer.addChild(Store.actionLayer);
        Store.gameContainer.addChild(Store.gui);

        await methods.fadeOut([Store.previewContainer], 0.02);
        Store.appIsReady = true;
        // methods.fadeIn([storeRef.gameContainer], 0.05);
    }
}

