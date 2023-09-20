import homeAfter from '@/assets/maps/home/homeAfter.png';
import homeBefore from '@/assets/maps/home/homeBefore.png';

import actors from '@/assets/actors/actors.png';

const assetsHomeBundle = {
    name: 'home',
    assets: [
        {
            name: 'after',
            srcs: homeAfter,
        },
        {
            name: 'before',
            srcs: homeBefore,
        },
    ] 
}

const assetsHomeTownBundle = {
    name: 'homeTown',
    assets: [
        {
            name: 'after',
            srcs: homeAfter,
        },
        {
            name: 'before',
            srcs: homeBefore,
        },
    ] 
}

const assetsActorsBundle = {
    name: 'actors',
    assets: [
        {
            name: 'actors',
            srcs: actors,
        },
    ]
}

export const manifest = {
    bundles: [
        assetsHomeBundle, 
        assetsHomeTownBundle,
        assetsActorsBundle
    ],
}

