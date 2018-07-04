class RenderingContext2D implements IRenderingContext {
    private _context: CanvasRenderingContext2D;
    
    constructor() {
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // canvas.addEventListener("click", (event) => {
        //     console.log(event.clientX + ", " + event.clientY);
        // });
        this._context = canvas.getContext("2d");
        this._context.imageSmoothingEnabled = false;
        document.body.appendChild(canvas);
    }

    public get Width(): number {
        return this._context.canvas.width;
    }
    
    public get Height(): number {
        return this._context.canvas.height;
    }

    public IsPointInPath(x: number, y: number): boolean {
        return this._context.isPointInPath(x, y);
    }

    public ClearRect(x: number, y: number, w: number, h: number): void {
        this._context.clearRect(x, y, w, h);
    }

    public DrawImage3(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number): void {
        this._context.drawImage(image, dstX, dstY);
    }

    public DrawImage5(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number): void {
        this._context.drawImage(image, dstX, dstY, dstW, dstH);
    }

    public DrawImage9(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void {
        this._context.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    }

    public set Font(font: string) {
        this._context.font = font;
    }

    public set FillStyle(fillStyle: string) {
        this._context.fillStyle = fillStyle;
    }
    
    public FillText(text: string, x: number, y: number, maxWidth?: number): void {
        this._context.fillText(text, x, y, maxWidth);
    }
}