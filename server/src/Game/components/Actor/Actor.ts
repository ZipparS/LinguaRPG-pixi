type ActorConstructorType = {
    name:string,
    type: 'NPC' | 'player', 
    texture: string, 
    portrait: string,
    sequenceNumber?: number,
    x?: number,
    y?: number,
}

export class Actor {
    sequenceNumber;

    name;
    type;
    textrue;
    portrait;

    x;
    y;

    display: boolean = true;
    
    constructor({ name, type, texture, portrait, sequenceNumber, x, y }: ActorConstructorType) {
        this.name = name;
        this.type = type;
        this.textrue = texture;
        this.portrait = portrait;
        this.sequenceNumber = sequenceNumber || 0;
        this.x = x || 0;
        this.y = y || 0;
    }
}