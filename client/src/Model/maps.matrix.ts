import homeAfterMatrix from '@/assets/maps/home/homeAfter.json'
import homeBeforeMatrix from '@/assets/maps/home/homeBefore.json'
import homeCollisionMatrix from '@/assets/maps/home/homeCollision.json'

type Matrixes = {
    afterMatrix: number[],
    beforeMatrix: number[],
    collisionMatrix: number[],
    matrixLength: number,
    width: number,
    height: number,
    tileWidth: number,
    tileHeight: number,
    adjustedMaps: string[],
}

export const MapsMatrix: { [key: string]: Matrixes } = {
    home: {
        afterMatrix: homeAfterMatrix,
        beforeMatrix: homeBeforeMatrix,
        collisionMatrix: homeCollisionMatrix,
        matrixLength: homeCollisionMatrix.length,
        width: 20,
        height: 15,
        tileWidth: 16,
        tileHeight: 16,
        adjustedMaps: ['homeTown'],
    },
    homeTown: {
        afterMatrix: homeAfterMatrix,
        beforeMatrix: homeBeforeMatrix,
        collisionMatrix: homeCollisionMatrix,
        matrixLength: homeCollisionMatrix.length,
        width: 20,
        height: 15,
        tileWidth: 16,
        tileHeight: 16,
        adjustedMaps: ['home'],
    }
}