/// <reference path="GraphicObject.ts" />

abstract class AnimatedObject extends GraphicObject { 
    protected _spriteSheet: SpriteSheet;
    
    constructor(spriteSheet: SpriteSheet, sprite: Sprite) {
        super(sprite);
        this._spriteSheet = spriteSheet;
    }
}