import { Stage } from "@pixi/layers";

export class ActionLayer extends Stage {

    constructor() {
        super();

        this.sortableChildren = true;
    }

}