export class Clock {
    private season: 'summer' | 'autumn' | 'winter' | 'spring';

    private time: string;
    private delta: number;

    constructor() {
        this.season = 'summer';
        this.time = '0:0:0';
        this.delta = 1;
    }

    setInGameTime(time: number) {
        this.time = `${Math.floor((time / 3600 * 30)) % 24}:${Math.floor((time / 60 * 30)) % 60}:${(time * 30) % 60}`;
    }

    setSeason(season: typeof this.season) {
        this.season = season;
    }

    setDeltaFrame(deltaTime: number) {
        if (deltaTime < 0) deltaTime = 0;
        if (deltaTime > 1000) deltaTime = 1000;
        this.delta = deltaTime * (66.6 / 1000);

    }

    getDelta(): number {
        return this.delta;
    }

    getInGameTime() {
        return this.time;
    }

    getSeason() {
        return this.season;
    }
}