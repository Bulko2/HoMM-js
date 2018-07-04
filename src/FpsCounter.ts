class FpsCounter implements IRenderable, IUpdatable {
    private _frameCount: number = 0;
    private _prevTime: number = 0;
    private _prevFrameCount: number = 0;

    public Update(time: number): void {
        this._frameCount++

        if (this._prevTime > 1000) {
            this._prevFrameCount = this._frameCount;
            this._frameCount = 0;
            this._prevTime = time;
        }

        this._prevTime += time;
    }

    public Render(context: IRenderingContext): void {
        // context.ClearRect(0, 0, 100, 100);
        context.FillStyle = "red";
		context.Font = "22px serif";
		context.FillText(this._prevFrameCount.toString(), 50, 50, 100);
    }
}