class AnimationManager implements IAnimationManager {
    private readonly _sheets: { [key: string]: SpriteSheet } = {};
    private _delay: number;
    private _interval: number = 0;
    private _count: number = 0;

    private constructor(delay: number) {
        this._delay = delay;
    }

    public IsAnimationExists(key: string): boolean {
        let result: boolean = this._sheets.hasOwnProperty(key);
        
        if (result) {
            return result;
        }
        
        return result;
    }

    public Get(key: string): SpriteSheet {
        return this._sheets[key];
    }

    public Add(key: string, spriteSheet: SpriteSheet): void {
        if (this.IsAnimationExists(key)) {
            return;
        }

        this._count++;
        this._sheets[key] = spriteSheet;
    }

    public Remove(key: string): void {
        if (!this.IsAnimationExists(key)) {
            return;
        }

        this._count--;
        delete this._sheets[key];
    }

    public Update(time: number): void {
        if (this._interval > this._delay) {
            this._interval = this._interval - this._delay;

            for (let key in this._sheets) {
                this._sheets[key].Update(time);
            }
        }

        this._interval += time;
    }

    public static Create(delay: number = 0.5): IAnimationManager {
        return new AnimationManager(delay);
    }
}

interface IAnimationManager extends IUpdatable {
    Add(key: string, spriteSheet: SpriteSheet): void;
    Remove(key: string): void;
    IsAnimationExists(key: string): boolean;
    Get(key: string): SpriteSheet;
}