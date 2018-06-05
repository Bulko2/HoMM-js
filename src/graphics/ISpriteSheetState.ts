interface ISpriteSheetState extends IResourceState {
    readonly sprite: Sprite;
    readonly direction: Direction;
    readonly countOfFrames: number;
    readonly frameInterval: number;
}