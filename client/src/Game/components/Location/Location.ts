import { CompositeRectTileLayer } from "@/tilemap";

export type LocationConstructorProps = {
    name: string;

    beforeLayer: CompositeRectTileLayer;
    afterLayer: CompositeRectTileLayer;

    collisionMatrix: number[];
}
    

export class Location {
    name: string;

    beforeLayer: CompositeRectTileLayer;
    afterLayer: CompositeRectTileLayer;

    collisionMatrix: number[];

    constructor({
        name,
        beforeLayer,
        afterLayer,
        collisionMatrix
    }: LocationConstructorProps) {
        this.name = name;
        this.beforeLayer = beforeLayer;
        this.afterLayer = afterLayer;
        this.collisionMatrix = collisionMatrix;

    }
}