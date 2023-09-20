import { Stage } from "@pixi/layers";
import { Input, Button } from "@pixi/ui";
import { Graphics, Sprite, SpriteSource, Text } from "pixi.js";

import logo from '@/Game/assets/logo.jpg';
import { WebSocketControls } from "@/Controller/WebSocket";

export class AuthorizationContainer extends Stage {
    WSCref: WebSocketControls;

    message: Text;
    
    logo!: Sprite;

    usernameInput!: Input
    usernameInputValue: string = '';
    
    passwordInput!: Input
    passwordInputValue: string = '';

    button!: Button;

    constructor(WSC: WebSocketControls) {
        super();

        this.WSCref = WSC;

        this.message = new Text('', {
            fill: '#ffffff',
            fontSize: 20,
            fontWeight: 'bold'
        });
        this.message.x = window.innerWidth / 2 - 130;
        this.message.y = 550

        this.initLogo(logo);

        this.initUsernameInput();

        this.initPasswordInput();
        
        this.initButton();

        this.addChild(this.logo);
        this.addChild(this.usernameInput);
        this.addChild(this.passwordInput);
        this.addChild(this.button.view);
        this.addChild(this.message);

        this.visible = false;
    }

    private initLogo = (imageSource: SpriteSource) => {
        this.logo = Sprite.from(imageSource)

        this.logo.width = 400;
        this.logo.height = 400;
        this.logo.position.y = -70;
        this.logo.position.x = window.innerWidth / 2 - this.logo.width / 2;
    }

    private initUsernameInput = () => {
        this.usernameInput = new Input({
            bg: new Graphics()
            .beginFill(0x97664d)
            .drawRoundedRect(0, 0, 300, 30, 0 + 3)
            .beginFill(0xefcdaa)
            .drawRoundedRect(3, 3, 300 - (3 * 2), 30 - (3 * 2), 0),
            placeholder: 'Enter username',

            padding: {
                left: 10,
                right: 10,
            },
            textStyle: {
                fill: '#000000',
                fontSize: 20,
                fontWeight: 'bold',
            },
            
            maxLength: 100,
            value: this.usernameInputValue,
        })

        this.usernameInput.x = window.innerWidth / 2 - this.usernameInput.width / 2;
        this.usernameInput.y = 300;

        this.usernameInput.onChange.connect((text) => {
            this.usernameInputValue = text;
            this.usernameInput.value = this.usernameInputValue
        })
    }
    private initPasswordInput = () => {
        this.passwordInput = new Input({
            bg: new Graphics()
            .beginFill(0x97664d)
            .drawRoundedRect(0, 0, 300, 30, 0 + 3)
            .beginFill(0xefcdaa)
            .drawRoundedRect(3, 3, 300 - (3 * 2), 30 - (3 * 2), 0),
            placeholder: 'Enter password',

            padding: {
                left: 10,
                right: 10,
            },
            textStyle: {
                fill: '#000000',
                fontSize: 20,
                fontWeight: 'bold'
            },
            
            value: this.passwordInputValue,
        })

        
        this.passwordInput.x = window.innerWidth / 2 - this.passwordInput.width / 2;
        this.passwordInput.y = 400;


        this.passwordInput.onChange.connect((text) => {
            this.passwordInputValue = text;
        })
    }

    private initButton = () => {
        this.button = new Button(new Graphics()
        .beginFill(0xefcdaa)
        .drawRoundedRect(0, 0, 300, 40, 0 + 3)
        .beginFill(0x97664d)
        .drawRoundedRect(3, 3, 300 - (3 * 2), 40 - (3 * 2), 0))

        this.button.view.x = window.innerWidth / 2 - this.button.view.width / 2;
        this.button.view.y = 500

        this.button.onPress.connect(() => {
            this.message.text = 'Sign In attempt...'
            this.WSCref.send(JSON.stringify({ signIn: { username: this.usernameInputValue, password: this.passwordInputValue } }))
        })
    }

    public setMessage = (message: string) => {
        this.message.text = message;
    }

    public destroyAll = () => {
        this.usernameInput.removeAllListeners();
        this.usernameInput.destroy();
        this.passwordInput.removeAllListeners();
        this.passwordInput.destroy();
        this.button.enabled = false;
        this.button.view.removeAllListeners()
        this.button.view.destroy();
        this.message.destroy();
        this.destroy();
    }
}