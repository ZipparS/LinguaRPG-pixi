import { Container, Ticker } from "pixi.js";

export class ControllerMethods {
    constructor() {}

    public fadeOut = (elements: Container[], step: number) => {
        return new Promise((res) => {
            let alpha = 1;
            elements.forEach(element => {
                element.alpha = alpha;
            })
    
            const ticker = Ticker.shared;
          
            const onTick = () => {
                alpha -= step;
                elements.forEach(element => {
                    element.alpha = alpha;
                })
          
                if (alpha <= 0) {
                    ticker.remove(onTick);
                    res(null);
                }
            }
          
            ticker.add(onTick)
        })
    }

    public fadeIn = (elements: Container[], step: number) => {
        return new Promise((res) => {
            let alpha = 0;
            elements.forEach(element => {
                element.alpha = alpha;
            })
    
            const ticker = Ticker.shared;
          
            const onTick = () => {
                alpha += step;
                elements.forEach(element => {
                    element.alpha = alpha;
                })
          
                if (alpha >= 1) {
                    ticker.remove(onTick);
                    res(null);
                }
            }
          
            ticker.add(onTick)
        })
    }
}