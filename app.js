class GraphicObject {
    constructor(sprite) {
        this.Sprite = sprite;
    }
    get X() {
        return this._x;
    }
    set X(x) {
        this._x = x;
    }
    get Y() {
        return this._y;
    }
    set Y(y) {
        this._y = y;
    }
}
/// <reference path="GraphicObject.ts" />
class AnimatedObject extends GraphicObject {
    constructor(spriteSheet, sprite) {
        super(sprite);
        this.spriteSheet = spriteSheet;
    }
}
class DynamicObject extends AnimatedObject {
    Update(time) {
    }
    Render(context) {
    }
}
class RenderingContextFactory {
    Create(type) {
        if (type == RenderType.Canvas2D) {
            return new RenderingContext2D();
        }
        return null;
    }
}
var RenderType;
(function (RenderType) {
    RenderType[RenderType["Canvas2D"] = 0] = "Canvas2D";
})(RenderType || (RenderType = {}));
class RenderingContext2D {
    constructor() {
        let canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this._context = canvas.getContext("2d");
        this._context.imageSmoothingEnabled = false;
        document.body.appendChild(canvas);
    }
    get Width() {
        return this._context.canvas.width;
    }
    get Height() {
        return this._context.canvas.height;
    }
    ClearRect(x, y, w, h) {
        this._context.clearRect(x, y, w, h);
    }
    DrawImage3(image, dstX, dstY) {
        this._context.drawImage(image, dstX, dstY);
    }
    DrawImage5(image, dstX, dstY, dstW, dstH) {
        this._context.drawImage(image, dstX, dstY, dstW, dstH);
    }
    DrawImage9(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
        this._context.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    }
}
class Sprite {
    constructor(state) {
        this._isLoaded = false;
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
    get AssetName() {
        let splited = this._state.path.split("/");
        if (splited.length > 1) {
            return splited[splited.length - 1];
        }
        console.warn("Invalid asset.");
        return null;
    }
    get IsLoaded() {
        return this._isLoaded;
    }
    get Image() {
        return this._image;
    }
    Render(context) {
        if (!this._isLoaded) {
            return;
        }
        context.ClearRect(this._state.x, this._state.y, this._state.width, this._state.height);
        context.DrawImage3(this._image, this._state.x, this._state.y);
    }
}
class SpriteSheet {
    constructor(manager, state) {
        this._frameIndex = 0;
        this._frameInterval = 0;
        this._state = state;
        this._manager = manager;
        if (this._manager.IsAnimationExists(this._state.sprite.AssetName)) {
            this._frames = this._manager.Get(this._state.sprite.AssetName).Frames;
            return;
        }
        this._frames = new Array(this._state.countOfFrames);
        if (this._state.direction == Direction.Right) {
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
    get Frames() {
        return this._frames;
    }
    get Index() {
        return this._frameIndex;
    }
    Update(time) {
        this._frameIndex++;
        this._frameInterval = this._frameInterval - this._state.frameInterval;
        let frameSize = this._state.direction == Direction.Down ? this._state.height : this._state.width;
        if (this._frameIndex * frameSize == this._size) {
            this._frameIndex = 0;
        }
    }
    Render(context) {
        if (!this._state.sprite.IsLoaded) {
            return;
        }
        let index = this._manager.Get(this._state.sprite.AssetName).Index;
        let frame = this._frames[index];
        context.ClearRect(this._state.x, this._state.y, frame.width, frame.height);
        context.DrawImage9(this._state.sprite.Image, frame.dx, frame.dy, frame.width, frame.height, this._state.x, this._state.y, frame.width, frame.height);
    }
}
var Direction;
(function (Direction) {
    Direction[Direction["Right"] = 0] = "Right";
    Direction[Direction["Down"] = 1] = "Down";
})(Direction || (Direction = {}));
class AnimationManager {
    constructor(delay) {
        this._sheets = {};
        this._interval = 0;
        this._count = 0;
        this._delay = delay;
    }
    IsAnimationExists(key) {
        let result = this._sheets.hasOwnProperty(key);
        if (result) {
            console.warn("The item with ket '" + key + "' already exists.");
            return result;
        }
        return result;
    }
    Get(key) {
        return this._sheets[key];
    }
    Add(key, spriteSheet) {
        if (this.IsAnimationExists(key)) {
            return;
        }
        this._count++;
        this._sheets[key] = spriteSheet;
    }
    Remove(key) {
        if (!this.IsAnimationExists(key)) {
            console.warn("Such key '" + key + "' does not exist.");
            return;
        }
        this._count--;
        delete this._sheets[key];
    }
    Update(time) {
        if (this._interval > this._delay) {
            this._interval = this._interval - this._delay;
            for (let key in this._sheets) {
                this._sheets[key].Update(time);
            }
        }
        this._interval += time;
    }
    static Create(delay = 0.5) {
        return new AnimationManager(delay);
    }
}
/// <reference path="core/RenderingContextFactory.ts" />
/// <reference path="core/RenderingContext.ts" />
/// <reference path="graphics/Sprite.ts" />
/// <reference path="graphics/SpriteSheet.ts" />
/// <reference path="graphics/Direction.ts" />
/// <reference path="graphics/AnimationManager.ts" />
class Game {
    constructor() {
        this._lastTime = new Date().getTime();
        const size = 16;
        this._context = new RenderingContextFactory().Create(RenderType.Canvas2D);
        this._animationManager = AnimationManager.Create(2);
        this._sprites = new Array(size * size);
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
        let items = ["chest", "crystal", "fire", "gems", "gold"];
        let startX = 0;
        let startY = 0;
        for (let i = 1; i <= this._sprites.length; i++) {
            let row = 0;
            let index = Math.floor(Math.random() * items.length);
            let sprite = new Sprite({
                path: "assets/" + items[index] + ".png",
                height: 32,
                width: 32
            });
            let sheet = new SpriteSheet(this._animationManager, {
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
    Update(time) {
        this._animationManager.Update(time);
        // for (let i = 0; i < this._sprites.length; i++) {
        //     this._sprites[i].Update(time);
        // }
    }
    Render() {
        for (let i = 0; i < this._sprites.length; i++) {
            this._sprites[i].Render(this._context);
        }
    }
    GameLoop() {
        var currentTime = new Date().getTime();
        var frameTime = currentTime - this._lastTime;
        var time = frameTime / 60;
        this._lastTime = currentTime;
        this.Update(time);
        this.Render();
        window.requestAnimationFrame(this.GameLoop.bind(this));
    }
}
let game = new Game();
/// <reference path="GraphicObject.ts" />
class GameObject extends GraphicObject {
    constructor(sprite) {
        super(sprite);
    }
}
class SimpleObject extends GameObject {
    constructor(sprite) {
        super(sprite);
    }
    Update(time) {
    }
    Render(context) {
    }
}
class GraphicResource {
}
class SpriteFrame {
    constructor() {
    }
}
//# sourceMappingURL=app.js.map