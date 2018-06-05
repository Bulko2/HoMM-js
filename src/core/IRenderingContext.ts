interface IRenderingContext {
    ClearRect(x: number, y: number, w: number, h: number): void;
    DrawImage3(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number): void;
    DrawImage5(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number): void;
    DrawImage9(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
    Width: number;
    Height: number;
}