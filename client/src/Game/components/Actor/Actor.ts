import { Graphics } from "pixi.js";
// import { OutlineFilter } from "@pixi/filter-outline";

export class Actor extends Graphics {
    private _state: 'free' | 'busy';
    
    public name: string;
    public texture: string;
    public portrait: string;
    
    constructor(name: string, texture: string, portrait: string) {
        super();
        this.name = name;
        this.texture = texture;
        this.portrait = portrait;

        this._state = 'free';

        this.eventMode = 'dynamic';

        this.beginFill(0x00ff00);
        this.drawRect(100, 100, 16, 16);
    }
    
    public is(state: typeof this._state): boolean {
        return state === this._state;
    };

    public set_State(_state: typeof this._state) {
        this._state = _state;
    }

    public setPosition(x: number, y: number): void;
    public setPosition(callback: (prevX: number, prevY: number) => [number, number]): void;
    public setPosition(arg1: unknown, y?: number) {
        if (typeof arg1 === 'number' && typeof y === 'number') {
            this.x = arg1;
            this.y = y;
        }

        if (typeof arg1 === 'function') {
            this.setPosition(...arg1(this.x, this.y) as [number, number]);
        }   

    };

    public setXposition(x:number): void;
    public setXposition(callback: (prevX: number) => number): void;
    public setXposition(arg1: unknown) {
        if (typeof arg1 === 'number') this.x = arg1;
        if (typeof arg1 === 'function') this.setXposition(arg1(this.x));
    }

    public setYposition(y:number): void;
    public setYposition(callback: (prevY: number) => number): void;
    public setYposition(arg1: unknown) {
        if (typeof arg1 === 'number') this.y = arg1;
        if (typeof arg1 === 'function') this.setYposition(arg1(this.y));
    }
}