/// <reference path="GraphicObject.ts" />

abstract class GameObject extends GraphicObject {
    constructor(sprite: Sprite) {
        super(sprite);
    }
}