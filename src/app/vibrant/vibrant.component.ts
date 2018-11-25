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
    image: HTMLImageElement = new Image()
    reader: FileReader = new FileReader()
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

    uploadFile(input: HTMLInputElement): void {

        const file: File = input.files[0]

        if (!file) {return}

        this.setImage(file)

        let meta: UploadMetadata = {
            customMetadata: {
                colorTop: '{r: 10, g: 20, b: 30}',
                colorBottom: '{r: 40, g: 50, b: 60}'
            }
        }

        const filePath = `${this.currentUser.id}_${file.name}`
        const afUploadTask = this.storage.upload(filePath, file, meta)

        this.fileName = file.name

        // get notified when the download URL is available
        afUploadTask.then(snap => {
            snap.ref.getDownloadURL().then(url => {
                this.downloadUrl = url
                // this.initCanvas()
            })
        })

        // observe the percentage changes
        this.uploadPercent = afUploadTask.percentageChanges()
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

    setImage(file: File) {
        this.reader.readAsDataURL(file)

        this.reader.onload = () => {
            this.image.src = <string> this.reader.result

            this.image.onload = () => {
                const { canvasTop, canvasBottom } = this.cropImage()
                const { colorTop, colorBottom } = this.getColors(canvasTop, canvasBottom)
                const { rgbStrTop, rgbStrBottom } = this.getRGBStr(colorTop, colorBottom)
                const { textColorTop, textColorBottom } = this.getTextColors(colorTop, colorBottom)
            }
        }
    }

    private cropImage() {
        let canvasTop = this.cropImageTop()
        let canvasBottom = this.cropImageBottom()
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

    private cropImageTop(): HTMLCanvasElement {
        const ctx = document.createElement('canvas').getContext('2d')

        ctx.canvas.width = this.image.width
        ctx.canvas.height = this.image.height / 4
        
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height / 4, 0, 0, this.image.width, this.image.height / 4)
        return ctx.canvas
    }

    private cropImageBottom(): HTMLCanvasElement {
        const ctx = document.createElement('canvas').getContext('2d')

        ctx.canvas.width = this.image.width
        ctx.canvas.height = this.image.height / 4

        ctx.drawImage(this.image, 0, this.image.height - (this.image.height / 4), this.image.width, this.image.height / 4, 0, 0, this.image.width, this.image.height / 4)
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
