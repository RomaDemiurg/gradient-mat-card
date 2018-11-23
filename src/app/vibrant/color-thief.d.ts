/**
 * CanvasImage Class
 * 
 * Class that wraps the html image element and canvas.
 * It also simplifies some of the canvas context manipulation
 * with a set of helper functions.
 */
interface CanvasImage {
    constructor(image: CanvasImageSource): CanvasImage
    clear(): void
    update(imageData: ImageData): void
    getPixelCount(): number
    getImageData(): ImageData
    removeCanvas(): void
}

export class ColorThief {
    
    /**
     * getColor(sourceImage[, quality])
     * @returns RGB: {r: number, g: number, b: number}
     *
     * Use the median cut algorithm provided by quantize.js to cluster similar
     * colors and return the base color from the largest cluster.
     *
     * Quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
     * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
     * faster a color will be returned but the greater the likelihood that it will not be the visually
     * most dominant color.
     */
    getColor(sourceImage: CanvasImageSource, quality?: number): {r: number, g: number, b: number}

    /**
     * getPalette(sourceImage[, colorCount, quality])
     * @returns Array<RGB> [ {r: number, g: number, b: number}, {r: number, g: number, b: number}, ...]
     *
     * Use the median cut algorithm provided by quantize.js to cluster similar colors.
     *
     * colorCount determines the size of the palette; the number of colors returned. If not set, it
     * defaults to 10.
     *
     * BUGGY: Function does not always return the requested amount of colors. It can be +/- 2.
     *
     * quality is an optional argument. It needs to be an integer. 1 is the highest quality settings.
     * 10 is the default. There is a trade-off between quality and speed. The bigger the number, the
     * faster the palette generation but the greater the likelihood that colors will be missed.
     */
    getPalette(sourceImage: CanvasImageSource, colorCount?: number, quality?: number): [ {r: number, g: number, b: number} ]

    getColorFromUrl(imageUrl, callback, quality): void

    getImageData(imageUrl, callback): void

    getColorAsync(imageUrl, callback, quality): void
    
}
