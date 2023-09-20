export type KeyboardKeys ={ 
    holding:  { [key: string]: (context: Keyboard) => void },
    pressing: { [key: string]: (context: Keyboard) => void },
    unholded: { [key: string]: (context: Keyboard) => void }
}

export class Keyboard {
    public playerInputs: { sequenceNumber: number, dx: number, dy: number }[] = [];

    private keysHeld: Set<string> = new Set();

    private keys: KeyboardKeys;

    constructor(keys: KeyboardKeys) {
        this.keys = keys;
    }

    private keyDown = (event: KeyboardEvent) => {
        if (this.keys.holding[event.key] === undefined) return;
        this.keysHeld.add(event.key);
    }
    
    private keyUp = (event: KeyboardEvent) => {
        if (this.keys.holding[event.key] === undefined) return;
        this.keysHeld.delete(event.key);
        if (this.keys.unholded[event.key]) this.keys.unholded[event.key](this);
        
    }

    private keyPress = (event: KeyboardEvent) => {
        if (this.keys.pressing[event.key] === undefined) return;
        this.keys.pressing[event.key](this);
    }

    public keyDownEventListenerCallback = () => {
        return this.keyDown;
    }

    public keyUpEventListenerCallback = () => {
        return this.keyUp;
    }

    public keyPressEventListenerCallback = () => {
        return this.keyPress;
    }

    public keyHeld = (): boolean => {
        return Boolean(this.keysHeld.size);
    }

    public hasSomeKeysHeld = (...keys: string[]): boolean => {
        return Boolean(keys.filter((key) => this.keysHeld.has(key)).length)
    }

    public emit = (): void => {
        this.keysHeld.forEach((key: string) => {
            this.keys.holding[key](this);
        })
    }
}