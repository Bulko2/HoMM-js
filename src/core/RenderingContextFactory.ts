class RenderingContextFactory {
    public Create(type: RenderType): IRenderingContext {
        if (type == RenderType.Canvas2D) {
            return new RenderingContext2D();
        }
        
        return null;
    }
}

enum RenderType {
    Canvas2D = 0
}