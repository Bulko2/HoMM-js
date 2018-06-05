/// <reference path="GraphicObject.ts" />

abstract class AnimatedObject extends GraphicObject { 
    protected spriteSheet: SpriteSheet;
    
    constructor(spriteSheet: SpriteSheet, sprite: Sprite) {
        super(sprite);
        this.spriteSheet = spriteSheet;
    }


}