import { Assets, Renderer, settings } from "pixi.js";
import { Controller } from "./Controller";
import { keyBinds } from "./Game/keyboard.binds";

import { Store } from "./Model";

import { AuthorizationContainer } from "./Game/containers/AuthorizationContainer";

import { manifest } from "./assets.manifets";

Assets.init({ manifest });

settings.ROUND_PIXELS = true;

const canvas = <HTMLCanvasElement>document.getElementById('canvas');

const renderer = new Renderer({
    view: canvas,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#000',
});

const { 
    keyboard, 
    scripts,
    websocket
} = new Controller(keyBinds);

Store.authorizationContainer = new AuthorizationContainer(websocket);

window.addEventListener('resize', () => {
    renderer.resize(window.innerWidth, window.innerHeight);
})

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('keydown', keyboard.keyDownEventListenerCallback());

document.addEventListener('keyup', keyboard.keyUpEventListenerCallback());

document.addEventListener('keypress', keyboard.keyPressEventListenerCallback());


function loop() {

    if (scripts.inQueue()) scripts.run();

    if (!Store.userAuthorized) {
        renderer.render(Store.authorizationContainer)
        requestAnimationFrame(loop); return;
    }
    
    if (!Store.appIsReady) {
        renderer.render(Store.previewContainer);
        requestAnimationFrame(loop); return;
    }

    if (keyboard.keyHeld()) keyboard.emit();

    renderer.render(Store.gameContainer);
    
    requestAnimationFrame(loop);
}


requestAnimationFrame(loop);