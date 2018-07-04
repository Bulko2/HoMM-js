
abstract class GraphicObject implements IRenderable, IUpdatable {
    private _x: number;
    private _y: number;
    protected readonly Sprite: Sprite;

    constructor(sprite: Sprite) {
        this.Sprite = sprite;
    }

    public get X(): number {
        return this._x;
    }

    public set X(x: number) {
        this._x = x;
    }

    public get Y(): number {
        return this._y;
    }

    public set Y(y: number) {
        this._y = y;
    }

    public abstract Update(time: number): void;
    public abstract Render(context: IRenderingContext): void;
}