class Sprite implements IRenderable {
    private readonly _state: ISpriteState;
    private readonly _image: HTMLImageElement;
    private _isLoaded: boolean = false;

    constructor(state: ISpriteState) {
        this._state = state;

        if (!this._state.x) {
            this._state.x = 0;
        }

        if (!this._state.y) {
            this._state.y = 0;
        }

        this._image = new Image();
        this._image.src = this._state.path;
        this._image.onload = () => {
            this._isLoaded = this._image.complete && this._image.naturalHeight != 0;
        };
    }

    public get AssetName(): string {
        let splited: string[] = this._state.path.split("/");
        
        if (splited.length > 1) {
            return splited[splited.length - 1];
        }

        console.warn("Invalid asset.");

        return null;
    }

    public get IsLoaded(): boolean {
        return this._isLoaded;
    }

    public get Image(): HTMLImageElement {
        return this._image;
    }

    public Render(context: IRenderingContext): void {
        if (!this._isLoaded) {
            return;
        }
        
        context.ClearRect(this._state.x, this._state.y, this._state.width, this._state.height);
        context.DrawImage3(this._image, this._state.x, this._state.y);
    }
}