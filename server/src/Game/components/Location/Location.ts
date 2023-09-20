import { Actor } from "../../components/Actor";

type GameLocationConstructorType = {
    name: string,
    type: 'private' | 'public',
    width: number,
    height: number,
    matrix: Array<(0|1)>,
    actors: { [key: string]: Actor },
}

export class GameLocation {
    scripts: { [key: string]: (ctx: GameLocation) => void } = {};
    
    name; type; width; height;
    matrix;
    actors;

    constructor({ name, type, width, height, matrix, actors }: GameLocationConstructorType) {
        this.name = name;
        this.type = type;
        this.width = width;
        this.height = height;
        this.matrix = matrix;
        this.actors = actors;
    };

    public setScript = (timeAsKey: string, callback: (ctx: GameLocation) => void) => {
        if (!this.scripts[timeAsKey]) this.scripts[timeAsKey] = callback;
        else {
            console.error(`This time already used as key for current location.
            Please, expand existing callback function.`);
        };
    }

    public removeScript = (timeAsKey: string) => {
        if (this.scripts[timeAsKey]) delete this.scripts[timeAsKey];
        else console.error('Nothing to remove under this time key.'); 
    }
}