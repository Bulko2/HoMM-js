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
        this._spriteSheet = spriteSheet;
    }
}
class DynamicObject extends AnimatedObject {
    Update(time) {
    }
    Render(context) {
        this._spriteSheet.Render(context);
    }
}
class FpsCounter {
    constructor() {
        this._frameCount = 0;
        this._prevTime = 0;
        this._prevFrameCount = 0;
    }
    Update(time) {
        this._frameCount++;
        if (this._prevTime > 1000) {
            this._prevFrameCount = this._frameCount;
            this._frameCount = 0;
            this._prevTime = time;
        }
        this._prevTime += time;
    }
    Render(context) {
        // context.ClearRect(0, 0, 100, 100);
        context.FillStyle = "red";
        context.Font = "22px serif";
        context.FillText(this._prevFrameCount.toString(), 50, 50, 100);
    }
}
class RenderingContextFactory {
    Create(type) {
        if (type === RenderType.Canvas2D) {
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
        // canvas.addEventListener("click", (event) => {
        //     console.log(event.clientX + ", " + event.clientY);
        // });
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
    IsPointInPath(x, y) {
        return this._context.isPointInPath(x, y);
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
    set Font(font) {
        this._context.font = font;
    }
    set FillStyle(fillStyle) {
        this._context.fillStyle = fillStyle;
    }
    FillText(text, x, y, maxWidth) {
        this._context.fillText(text, x, y, maxWidth);
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
    get Frames() {
        return this._frames;
    }
    get Index() {
        return this._frameIndex;
    }
    Update(time) {
        this._frameIndex++;
        this._frameInterval = this._frameInterval - this._state.frameInterval;
        let frameSize = this._state.direction === Direction.Down ? this._state.height : this._state.width;
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
        // context.ClearRect(this._state.x, this._state.y, frame.width, frame.height);
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
        this._lastTime = 0;
        this._isPaused = false;
        this._isStarted = false;
        this._fpsCounter = new FpsCounter();
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
    Start() {
        if (this._isStarted) {
            return;
        }
        this._isStarted = true;
        this.GameLoop();
    }
    Stop() {
        if (!this._isStarted) {
            return;
        }
        this._isStarted = false;
    }
    get AnimationManager() {
        return this._animationManager;
    }
    get Context() {
        return this._context;
    }
    Update(time) {
        this._animationManager.Update(time);
        this._fpsCounter.Update(time);
    }
    Render() {
        this._fpsCounter.Render(this.Context);
    }
    GameLoop() {
        if (!this._isStarted) {
            return;
        }
        if (!this._isPaused) {
            let time = performance.now();
            let delta = time - this._lastTime;
            this._lastTime = time;
            this._context.ClearRect(0, 0, this._context.Height, this._context.Width);
            this.Update(delta);
            this.Render();
        }
        window.requestAnimationFrame(this.GameLoop.bind(this));
    }
}
/// <reference path="GraphicObject.ts" />
class GameObject extends GraphicObject {
    constructor(sprite) {
        super(sprite);
    }
}
class Montezuma extends Game {
    constructor() {
        super();
        this.size = 32;
        this._field = new Array(this.size);
        let items = ["chest", "crystal", "fire", "gems", "gold"];
        let startX = (this.Context.Width / 3) - 256;
        let startY = 20;
        for (let i = 0; i < this.size; i++) {
            let row = new Array(this.size);
            for (let j = 0; j < this.size; j++) {
                let index = Math.floor(Math.random() * items.length);
                let sprite = new Sprite({
                    path: "assets/" + items[index] + ".png",
                    height: 32,
                    width: 32
                });
                let sheet = new SpriteSheet(this.AnimationManager, {
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
    Update(time) {
        super.Update(time);
    }
    Render() {
        super.Render();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this._field[i][j].Render(this.Context);
            }
        }
    }
}
let montezuma = new Montezuma();
montezuma.Start();
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
//# sourceMappingURL=app.js.map