"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLocation = void 0;
class GameLocation {
    constructor({ name, type, width, height, matrix, actors }) {
        this.scripts = {};
        this.setScript = (timeAsKey, callback) => {
            if (!this.scripts[timeAsKey])
                this.scripts[timeAsKey] = callback;
            else {
                console.error(`This time already used as key for current location.
            Please, expand existing callback function.`);
            }
            ;
        };
        this.removeScript = (timeAsKey) => {
            if (this.scripts[timeAsKey])
                delete this.scripts[timeAsKey];
            else
                console.error('Nothing to remove under this time key.');
        };
        this.name = name;
        this.type = type;
        this.width = width;
        this.height = height;
        this.matrix = matrix;
        this.actors = actors;
    }
    ;
}
exports.GameLocation = GameLocation;
