import { Component, OnInit } from '@angular/core'
import { ColorThief } from './color-thief.js'

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { Observable, Subscription } from 'rxjs'
import { User } from '../classes/user.model'
import { PostMeta } from '../models/post-meta.model'
import { RGB } from './color-thief.model'
import { UploadMetadata } from '@angular/fire/storage/interfaces';


@Component({
    selector: 'app-vibrant',
    templateUrl: './vibrant.component.html',
    styleUrls: ['./vibrant.component.scss']
})
export class VibrantComponent implements OnInit {
    
    postsMeta: Observable<PostMeta[]>
    currentUser: User = new User
    userId = ''
    private subsubscriptions: Subscription[] = []
    uploadPercent: Observable<number>
    downloadUrl: string | null = null
    fileName: string
    // image: HTMLImageElement = new Image()
    // reader: FileReader = new FileReader()
    colorThief = new ColorThief()

    constructor(
        private db: AngularFirestore,
        private storage: AngularFireStorage,
    ) { }

    ngOnInit() {
        this.postsMeta = this.db.collection<PostMeta>('posts').valueChanges();

        this.currentUser.id = 'Roma'
        this.currentUser.photoUrl = 'Roma_photoUrl'
    }

    async uploadFile(input: HTMLInputElement) {

        if (!this.getFileFromInput(input)) return

        const file: File = this.getFileFromInput(input)
        this.fileName = file.name
        
        const imageSrc = await this.getImageSrc(file)
        const image = await this.getImage(imageSrc)

        const uploadMetadata: UploadMetadata = this.getUploadMetadata(image)
        const downloadUrl = await this.uploadFileToStorage(file, uploadMetadata).then(url => url)
        console.log(downloadUrl)
    }

    private getImageSrc(file: File) {
        const reader: FileReader = new FileReader()
        reader.readAsDataURL(file)

        return new Promise<string>(resolve => {
            reader.onload = () => resolve(<string>reader.result)
        })
    }

    private getImage(imageSrc: string) {
        const image: HTMLImageElement = new Image()
        image.src = imageSrc
        
        return new Promise<HTMLImageElement>(resolve => {
            image.onload = () => resolve(image)
        })
    }

    private getFileFromInput(input: HTMLInputElement): File {
        return input.files[0]
    }

    private async uploadFileToStorage(file: File, uploadMetadata: UploadMetadata) {
        const filePath = `${this.currentUser.id}_${file.name}`
        const afUploadTask = this.storage.upload(filePath, file, uploadMetadata)

        this.uploadPercent = afUploadTask.percentageChanges()
        
        const downloadUrl = await afUploadTask.task.snapshot.ref.getDownloadURL().then((url: string) => url)
        return this.downloadUrl = downloadUrl
    }

    private getUploadMetadata(image: HTMLImageElement) {
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

    save(): void {
        let photo
    
        if (this.downloadUrl) {
            photo = this.downloadUrl
        } else {
            photo = this.currentUser.photoUrl
        }
    
        const user = Object.assign({}, this.currentUser, {photoUrl: photo})
        const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.id}`)
        userRef.set(user)
            .then(() => {
                console.log('Your profile was successfully updated!')
            })
            .catch(error => {
                console.log('profile updating error')
            })
    }

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

}
