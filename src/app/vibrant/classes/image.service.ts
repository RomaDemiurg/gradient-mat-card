import { Injectable } from '@angular/core'
import { RGB } from '../color-thief.model'
import { ColorThief } from '../color-thief'


@Injectable({
    providedIn: 'root'
})
export class ImageService {
    colorThief = new ColorThief()

    cropImage(image: HTMLImageElement) {
        let canvasTop = this.cropImageTop(image)
        let canvasBottom = this.cropImageBottom(image)
        return { canvasTop, canvasBottom }
    }

    getColors(canvasTop: HTMLCanvasElement, canvasBottom: HTMLCanvasElement) {
        const colorTop = this.getColorFromImage(canvasTop, 'top')
        console.log('colorTop:', colorTop)
        const colorBottom = this.getColorFromImage(canvasBottom, 'bottom')
        console.log('colorBottom:', colorBottom)
        return { colorTop, colorBottom }
    }

    getRGBStr(colorTop: RGB, colorBottom: RGB) {
        const rgbStrTop = this.getRGBStrFromRGBObj(colorTop)
        console.log('rgbStrTop:', rgbStrTop)
        const rgbStrBottom = this.getRGBStrFromRGBObj(colorBottom)
        console.log('rgbStrBottom:', rgbStrBottom)
        return { rgbStrTop, rgbStrBottom }
    }

    getTextColors(colorTop: RGB, colorBottom: RGB) {
        const textColorTop = this.getTextColorFromRGBObj(colorTop)
        console.log('textColorTop:', textColorTop)
        const textColorBottom = this.getTextColorFromRGBObj(colorBottom)
        console.log('textColorBottom:', textColorBottom)
        return { textColorTop, textColorBottom }
    }

    cropImageTop(image: HTMLImageElement): HTMLCanvasElement {
        const ctx = document.createElement('canvas').getContext('2d')

        ctx.canvas.width = image.width
        ctx.canvas.height = image.height / 4

        ctx.drawImage(image, 0, 0, image.width, image.height / 4, 0, 0, image.width, image.height / 4)
        return ctx.canvas
    }

    cropImageBottom(image: HTMLImageElement): HTMLCanvasElement {
        const ctx = document.createElement('canvas').getContext('2d')

        ctx.canvas.width = image.width
        ctx.canvas.height = image.height / 4

        ctx.drawImage(image, 0, image.height - (image.height / 4), image.width, image.height / 4, 0, 0, image.width, image.height / 4)
        return ctx.canvas
    }

    getColorFromImage(img: CanvasImageSource, topBottom: 'top' | 'bottom'): RGB {
        return this.colorThief.getColor(img, 1)
    }

    getRGBStrFromRGBObj(color: RGB): string {
        return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'
    }

    getTextColorFromRGBObj(color: RGB): '#000000' | '#FFFFFF' {
        // http://stackoverflow.com/a/3943023/112731
        return (color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > 186 ? '#000000' : '#FFFFFF'
    }
}
