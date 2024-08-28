import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Loader } from "./Loader";
import { ScenesManager } from "./ScenesManager";
import PlayableAnalytic from "./PlayableAnalytic";
import MarketHelper from "./helpers/MarketHelper";
import NetworkFactory from './networks/NetworkFactory';

class Application {
    run(config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        this.adNetwork =  config.defaultAdNetwork; //process.env.AD_NETWORK ||

        this.analytics =  new PlayableAnalytic(config.apiUrl, this.adNetwork);
        this.marketHelper = new MarketHelper(this.adNetwork, this.analytics);
        this.adNetwork = NetworkFactory.createInitializer( this.adNetwork);

        this.adNetwork.initialize();

        const options = {
            resizeTo: window
        }

        this.app = new PIXI.Application(options);

        document.body.appendChild(this.app.view);

        this.scenes = new ScenesManager();
        this.app.stage.interactive = true;
        this.app.stage.addChild(this.scenes.container);

        this.loader = new Loader(this.app.loader, this.config);
        this.loader.preload().then(() => this.start());
    }

    res(key) {
        return this.loader.resources[key].texture;
    }

    sprite(key) {
        return new PIXI.Sprite(this.res(key));
    }

    start() {
        this.scenes.start("Game");
    }
}

export const App = new Application();
