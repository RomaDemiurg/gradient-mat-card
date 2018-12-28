import { Injectable } from '@angular/core'

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage'
import { UploadMetadata } from '@angular/fire/storage/interfaces'

import { Observable } from 'rxjs'

import { RGB } from './color-thief.model'
import { User } from '../classes/user.model'

import { ColorThief } from './color-thief'


@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private colorThief = new ColorThief()

    currentUser: User = new User

    constructor(
        private storage: AngularFireStorage
    ) {
        this.currentUser.id = 'Roma'
        this.currentUser.photoUrl = 'Roma_photoUrl'
    }

    // FileInput

    getFileFromInput(input: HTMLInputElement) {
        if (input.files[0]) {
            return input.files[0]
        } else {
            return false
        }
    }

    private getImageSrc(file: File): Promise<string> {
        const reader: FileReader = new FileReader()
        reader.readAsDataURL(file)

        return new Promise<string>(resolve => {
            reader.onload = () => resolve(<string>reader.result)
        })
    }

    private getImage(imageSrc: string): Promise<HTMLImageElement> {
        const image: HTMLImageElement = new Image()
        image.src = imageSrc

        return new Promise<HTMLImageElement>(resolve => {
            image.onload = () => resolve(image)
        })
    }

    private async convertFileToImage(file: File): Promise<HTMLImageElement> {
        const imageSrc: string = await this.getImageSrc(file)
        const image: HTMLImageElement = await this.getImage(imageSrc)
        return image
    }

    // Image

    private cropImage(image: HTMLImageElement) {
        let canvasTop = this.cropImageTop(image)
        let canvasBottom = this.cropImageBottom(image)
        return { canvasTop, canvasBottom }
    }

    private getColors(canvasTop: HTMLCanvasElement, canvasBottom: HTMLCanvasElement) {
        const colorTop = this.getColorFromImage(canvasTop, 'top')
        console.log('colorTop:', colorTop)
        const colorBottom = this.getColorFromImage(canvasBottom, 'bottom')
        console.log('colorBottom:', colorBottom)
        return { colorTop, colorBottom }
    }

    private getRGBStr(colorTop: RGB, colorBottom: RGB) {
        const rgbStrTop = this.getRGBStrFromRGBObj(colorTop)
        console.log('rgbStrTop:', rgbStrTop)
        const rgbStrBottom = this.getRGBStrFromRGBObj(colorBottom)
        console.log('rgbStrBottom:', rgbStrBottom)
        return { rgbStrTop, rgbStrBottom }
    }

    private getTextColors(colorTop: RGB, colorBottom: RGB) {
        const textColorTop = this.getTextColorFromRGBObj(colorTop)
        console.log('textColorTop:', textColorTop)
        const textColorBottom = this.getTextColorFromRGBObj(colorBottom)
        console.log('textColorBottom:', textColorBottom)
        return { textColorTop, textColorBottom }
    }

    private cropImageTop(image: HTMLImageElement): HTMLCanvasElement {
        const ctx = document.createElement('canvas').getContext('2d')

        ctx.canvas.width = image.width
        ctx.canvas.height = image.height / 4

        ctx.drawImage(image, 0, 0, image.width, image.height / 4, 0, 0, image.width, image.height / 4)
        return ctx.canvas
    }

    private cropImageBottom(image: HTMLImageElement): HTMLCanvasElement {
        const ctx = document.createElement('canvas').getContext('2d')

        ctx.canvas.width = image.width
        ctx.canvas.height = image.height / 4

        ctx.drawImage(image, 0, image.height - (image.height / 4), image.width, image.height / 4, 0, 0, image.width, image.height / 4)
        return ctx.canvas
    }

    private getColorFromImage(img: CanvasImageSource, topBottom: 'top' | 'bottom'): RGB {
        return this.colorThief.getColor(img, 1)
    }

    private getRGBStrFromRGBObj(color: RGB): string {
        return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'
    }

    private getTextColorFromRGBObj(color: RGB): '#000000' | '#FFFFFF' {
        // http://stackoverflow.com/a/3943023/112731
        return (color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > 186 ? '#000000' : '#FFFFFF'
    }

    // StorageUpload

    private getUploadMetadata(image: HTMLImageElement): UploadMetadata {
        const { canvasTop, canvasBottom } = this.cropImage(image)
        const { colorTop, colorBottom } = this.getColors(canvasTop, canvasBottom)
        const { rgbStrTop, rgbStrBottom } = this.getRGBStr(colorTop, colorBottom)
        const { textColorTop, textColorBottom } = this.getTextColors(colorTop, colorBottom)

        let uploadMetadata: UploadMetadata = {
            customMetadata: {
                rgbStrTop,
                rgbStrBottom,
                textColorTop,
                textColorBottom
            }
        }
        return uploadMetadata
    }

    async uploadToStorage(file: File) {
        const image = await this.convertFileToImage(file)
        const uploadMetadata = this.getUploadMetadata(image)
        const filePath = `${this.currentUser.id}_${file.name}`

        console.log('file.name', file.name)

        const angularFireUploadTask = this.storage.upload(filePath, file, uploadMetadata)

        const uploadPercent = this.getUploadPercent(angularFireUploadTask)
        // const downloadUrl = this.getDownloadURL(angularFireUploadTask)
        const finish = await this.pause()
        // console.log('F:', finish)

        return {image, uploadMetadata, angularFireUploadTask, uploadPercent}
    }

    private getUploadPercent(angularFireUploadTask: AngularFireUploadTask): Observable<number> {
        return angularFireUploadTask.percentageChanges()
    }

    pause() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('finish..........')
            }, 10)
        })
    }
    
    
    private getDownloadURL(angularFireUploadTask: AngularFireUploadTask): Promise<string> {
        return angularFireUploadTask.then(snap => {
            return snap.ref.getDownloadURL()
        })

        // return angularFireUploadTask.task.snapshot.ref.getDownloadURL()
    }
}
