/// <reference path="core/RenderingContextFactory.ts" />
/// <reference path="core/RenderingContext.ts" />
/// <reference path="graphics/Sprite.ts" />
/// <reference path="graphics/SpriteSheet.ts" />
/// <reference path="graphics/Direction.ts" />
/// <reference path="graphics/AnimationManager.ts" />

class Game implements IRenderable, IUpdatable {
    private readonly _context: IRenderingContext;
    private readonly _animationManager: IAnimationManager;
    private readonly _sprites: SpriteSheet[];
    private _lastTime: number = new Date().getTime();

    constructor() {
        const size: number = 16;
        this._context = new RenderingContextFactory().Create(RenderType.Canvas2D);
        this._animationManager = AnimationManager.Create(2);
        this._sprites = new Array<SpriteSheet>(size * size);
        // let startX = (this.context.Width / 2) - 256;
        // let startY = (this.context.Height / 2) - 256;

        // for (let row = 0; row < 8; row++) {
        //     for (let col = 0; col < 8; col++) {
        //         startX += 32;
        //         this.context.Rect(startX, startY, 32, 32);
        //     }
            
        //     startX = (this.context.Width / 2) - 256;
        //     startY += 32;
        // }
        let items: string[] = ["chest", "crystal", "fire", "gems", "gold"];
        let startX = 0;
        let startY = 0;

        for (let i = 1; i <= this._sprites.length; i++) {
            let row: number = 0;
            let index: number = Math.floor(Math.random() * items.length);
            let sprite = new Sprite({
                path: "assets/" + items[index] + ".png",
                height: 32,
                width: 32
            });
            let sheet: SpriteSheet = new SpriteSheet(this._animationManager, {
                sprite: sprite,
                direction: Direction.Down,
                countOfFrames: 8,
                frameInterval: 2,
                height: 32,
                width: 32,
                x: startX,
                y: startY
            });
            this._sprites[i - 1] = sheet;
            startX += 32;

            if (i % size == 0) {
                startX = 0;
                startY += 32;
            }
        }
        
        this.GameLoop();
    }

    public Update(time: number): void {
        this._animationManager.Update(time);

        // for (let i = 0; i < this._sprites.length; i++) {
        //     this._sprites[i].Update(time);
        // }
    }

    public Render(): void {
        for (let i = 0; i < this._sprites.length; i++) {
            this._sprites[i].Render(this._context);
        }
    }

    private GameLoop(): void {
        var currentTime: number = new Date().getTime();
        var frameTime: number = currentTime - this._lastTime;
        var time = frameTime / 60;
        this._lastTime = currentTime;
        this.Update(time);
        this.Render();
        window.requestAnimationFrame(this.GameLoop.bind(this));
    }
}

let game: Game = new Game();