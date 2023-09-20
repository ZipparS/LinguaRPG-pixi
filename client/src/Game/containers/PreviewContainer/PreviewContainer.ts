import { ColorSource, Graphics, Sprite, SpriteSource, Text, Ticker } from "pixi.js";
import { Stage } from "@pixi/layers";
import { ProgressBar } from "@pixi/ui";

import { OutlineFilter } from "@pixi/filter-outline";

import logo from '@/Game/assets/logo.jpg';
import wallpaper from '@/Game/assets/wallpaper.jpg';

type ProgressBarProps = {
    fillColor: ColorSource;
    borderColor: ColorSource;
    backgroundColor: ColorSource;
    width: number;
    height: number;
    radius: number;
    border: number;
}

export class PreviewContainer extends Stage {
    loadingProgress: number;
    
    logo!: Sprite;
    previewImage!: Sprite;
    progressBar!: ProgressBar;
    previewText!: Text;


    constructor() {
        super();

        this.loadingProgress = 0;

        this.logo;
        this.previewImage;
        this.previewText;

        this.initLogo(logo);
        
        this.initPreviewImage(wallpaper);

        this.initProgressBar({
            fillColor: 0xefcdaa,
            borderColor: 0x97664d,
            backgroundColor: 0x8a5645,
            width: 400,
            height: 20,
            radius: 2,
            border: 2,
        });

        this.initPreviewText('');

    }

    private initLogo = (imageSource: SpriteSource) => {
        this.logo = Sprite.from(imageSource)

        this.logo.width = 400;
        this.logo.height = 400;
        this.logo.position.y = -70;
        this.logo.position.x = window.innerWidth / 2 - this.logo.width / 2;
    }

    private initPreviewImage = (imageSource: SpriteSource) => {
        this.previewImage = Sprite.from(imageSource);
        this.previewImage.width = window.innerWidth;
        this.previewImage.height = window.innerHeight / 2;
        this.previewImage.position.y = this.previewImage.height / 2;
        this.previewImage.filters = [new OutlineFilter(5, 0x97664d), new OutlineFilter(5, 0xefcdaa)]
    }

    private initProgressBar = ({
        fillColor,
        borderColor,
        backgroundColor,
        width,
        height,
        radius,
        border,
    }: ProgressBarProps) => {
        this.progressBar = new ProgressBar({
            bg: new Graphics().beginFill(borderColor).drawRoundedRect(0, 0, width, height, radius)
                .beginFill(backgroundColor)
                .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius),
            fill: new Graphics().beginFill(borderColor).drawRoundedRect(0, 0, width, height, radius)
                .beginFill(fillColor)
                .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius),
            progress: this.loadingProgress,
        });
        this.progressBar.x = window.innerWidth - 450;
        this.progressBar.y = 820;
    }

    private initPreviewText = (text: string) => {
        this.previewText = new Text(text);
        
        this.previewText.style.fill = 0xffffff;
        this.previewText.style.fontSize = 20;
        this.previewText.position.y = 790;
        this.previewText.position.x = window.innerWidth - 450;
    }

    public setLoadingProgress = (arg: unknown, how?: 'animated' | 'strict', step?: number): unknown => {
        if (typeof arg === 'number') {
            if (how && how === 'strict') {
                this.loadingProgress = arg;
                this.progressBar.progress = this.loadingProgress;
                return;
            }
            return new Promise((res) => {
                const ticker = Ticker.shared;
    
                const onTick = () => {
                    if (this.loadingProgress >= arg || this.loadingProgress >= 100) {
                        ticker.remove(onTick);
                        res(null);
                    }
                    this.loadingProgress += step ? step : 1;
                    this.progressBar.progress = this.loadingProgress;
                }
    
                ticker.add(onTick);
            })
        }
        if (typeof arg === 'function') this.setLoadingProgress(arg(this.loadingProgress));
    }

    public setBuildPhaseText = (buildingPhaseText: string) => {
        this.previewText.text = buildingPhaseText;
    }

    public setPreviewImage = (imageSource: SpriteSource) => {
        this.previewImage = Sprite.from(imageSource);
    }
}