class DynamicObject extends AnimatedObject {
    public Update(time: number): void {
        
    }

    public Render(context: IRenderingContext): void {        
        this._spriteSheet.Render(context);
    }
}