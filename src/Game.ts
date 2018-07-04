/// <reference path="core/RenderingContextFactory.ts" />
/// <reference path="core/RenderingContext.ts" />
/// <reference path="graphics/Sprite.ts" />
/// <reference path="graphics/SpriteSheet.ts" />
/// <reference path="graphics/Direction.ts" />
/// <reference path="graphics/AnimationManager.ts" />

abstract class Game {
    private readonly _context: IRenderingContext;
    private readonly _animationManager: IAnimationManager;
    private _lastTime: number = 0;
    private _isPaused: boolean = false;
    private _isStarted: boolean = false;
    private _fpsCounter: FpsCounter = new FpsCounter();

    constructor() {
        this._context = new RenderingContextFactory().Create(RenderType.Canvas2D);
        this._animationManager = AnimationManager.Create(2);
        window.onblur = () => {
            this._isPaused = true;
        };
        window.onfocus = () => {
            this._isPaused = false;
            this._lastTime = performance.now();
        };
    }

    public Start(): void {
        if (this._isStarted) {
            return;
        }
        
        this._isStarted = true;
        this.GameLoop();
    }

    public Stop(): void {
        if (!this._isStarted) {
            return;
        }

        this._isStarted = false;
    }

    protected get AnimationManager(): IAnimationManager {
        return this._animationManager;
    }

    protected get Context(): IRenderingContext {
        return this._context;
    }
    
    protected Update(time: number): void {
        this._animationManager.Update(time);
        this._fpsCounter.Update(time);
    }

    protected Render(): void {
        this._fpsCounter.Render(this.Context);
    }

    private GameLoop(): void {
        this._context.ClearRect(0, 0, this._context.Height, this._context.Width);
        
        if (!this._isStarted) {
            return;
        }

        if (!this._isPaused) {
            let time: number = performance.now();
            let delta: number = time - this._lastTime;
            this._lastTime = time;
            this.Update(delta);
            this.Render();
        }
        
        window.requestAnimationFrame(this.GameLoop.bind(this));
    }
}