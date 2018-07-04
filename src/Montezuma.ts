class Montezuma extends Game {    
    private readonly _field: DynamicObject[][];
    private readonly size: number = 32;

    constructor() {
        super();
        this._field = new Array<Array<DynamicObject>>(this.size);
        let items: string[] = ["chest", "crystal", "fire", "gems", "gold"];
        let startX: number = (this.Context.Width / 3) - 256;
        let startY: number = 20;

        for (let i = 0; i < this.size; i++) {
            let row: DynamicObject[] = new Array<DynamicObject>(this.size);

            for (let j = 0; j < this.size; j++) {
                let index: number = Math.floor(Math.random() * items.length);
                let sprite = new Sprite({
                    path: "assets/" + items[index] + ".png",
                    height: 32,
                    width: 32
                });
                let sheet: SpriteSheet = new SpriteSheet(this.AnimationManager, {
                    sprite: sprite,
                    direction: Direction.Down,
                    countOfFrames: 8,
                    frameInterval: 2,
                    height: 32,
                    width: 32,
                    x: startX,
                    y: startY
                });
                row[j] = new DynamicObject(sheet, sprite);
                startX += 32;
            }

            this._field[i] = row;
            startX = (this.Context.Width / 3) - 256;
            startY += 32;
        }
    }

    protected Update(time: number): void {
        super.Update(time);
    }

    protected Render(): void {
        super.Render();
        
        for (let i = 0; i < this.size; i ++) {
            for (let j = 0; j < this.size; j++) {
                this._field[i][j].Render(this.Context);
            }
        }
    }
}

let montezuma: Montezuma = new Montezuma();
montezuma.Start();