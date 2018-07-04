interface IRenderingContext {
    ClearRect(x: number, y: number, w: number, h: number): void;
    DrawImage3(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number): void;
    DrawImage5(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, dstX: number, dstY: number, dstW: number, dstH: number): void;
    DrawImage9(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap, srcX: number, srcY: number, srcW: number, srcH: number, dstX: number, dstY: number, dstW: number, dstH: number): void;
    FillText(text: string, x: number, y: number, maxWidth?: number): void;
    IsPointInPath(x: number, y: number): boolean;
    Width: number;
    Height: number;
    Font: string;
    FillStyle: string;
}