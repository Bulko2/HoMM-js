class SpriteSheet implements IRenderable, IUpdatable {
    private readonly _frames: ISpriteFrame[];
    private readonly _size: number;
    private readonly _state: ISpriteSheetState;
    private readonly _manager: IAnimationManager;
    private _frameIndex: number = 0;
    private _frameInterval: number = 0;

    constructor(manager: IAnimationManager, state: ISpriteSheetState) {
        this._state = state;
        this._manager = manager;

        if (this._manager.IsAnimationExists(this._state.sprite.AssetName)) {
            this._frames = this._manager.Get(this._state.sprite.AssetName).Frames;

            return;
        }

        this._frames = new Array<ISpriteFrame>(this._state.countOfFrames);

        if (this._state.direction === Direction.Right) {
            this._size = this._state.countOfFrames * this._state.width;

            for (let index = 0; index < this._state.countOfFrames; index++) {
                this._frames[index] = {
                    dx: index * this._state.width,
                    dy: 0,
                    width: this._state.width,
                    height: this._state.height
                };
            }
        }

        if (this._state.direction == Direction.Down) {
            this._size = this._state.countOfFrames * this._state.height;

            for (let index = 0; index < this._state.countOfFrames; index++) {
                this._frames[index] = {
                    dx: 0,
                    dy: index * this._state.height,
                    width: this._state.width,
                    height: this._state.height
                };
            }
        }

        this._manager.Add(this._state.sprite.AssetName, this);
    }

    public get Frames(): ISpriteFrame[] {
        return this._frames;
    }

    public get Index(): number {
        return this._frameIndex;
    }

    public Update(time: number): void {
        this._frameIndex++;
        this._frameInterval = this._frameInterval - this._state.frameInterval;
        let frameSize = this._state.direction === Direction.Down ? this._state.height : this._state.width;

        if (this._frameIndex * frameSize == this._size) {
            this._frameIndex = 0;
        }
    }

    public Render(context: IRenderingContext): void {
        if (!this._state.sprite.IsLoaded) {
            return;
        }

        let index: number = this._manager.Get(this._state.sprite.AssetName).Index;
        let frame: ISpriteFrame = this._frames[index];
        // context.ClearRect(this._state.x, this._state.y, frame.width, frame.height);
        
        context.DrawImage9(
            this._state.sprite.Image,
            frame.dx,
            frame.dy,
            frame.width,
            frame.height,
            this._state.x,
            this._state.y,
            frame.width,
            frame.height);
    }
}