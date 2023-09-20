"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = void 0;
class Clock {
    constructor() {
        this.season = 'summer';
        this.time = '0:0:0';
        this.delta = 1;
    }
    setInGameTime(time) {
        this.time = `${Math.floor((time / 3600 * 30)) % 24}:${Math.floor((time / 60 * 30)) % 60}:${(time * 30) % 60}`;
    }
    setSeason(season) {
        this.season = season;
    }
    setDeltaFrame(deltaTime) {
        if (deltaTime < 0)
            deltaTime = 0;
        if (deltaTime > 1000)
            deltaTime = 1000;
        this.delta = deltaTime * (66.6 / 1000);
    }
    getDelta() {
        return this.delta;
    }
    getInGameTime() {
        return this.time;
    }
    getSeason() {
        return this.season;
    }
}
exports.Clock = Clock;
