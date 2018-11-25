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
    ctx: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d')
    image: HTMLImageElement = new Image()
    reader: FileReader = new FileReader()

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
                this.cropTop()
                this.cropBottom()
            }
        }
    }

    cropTop() {
        this.ctx.canvas.width = this.image.width
        this.ctx.canvas.height = this.image.height / 4
        
        console.log(
            'x:', 0,
            'y:', 0,
            'w:', this.image.width,
            'h:', this.image.height / 4
        )

        this.ctx.drawImage(
            this.image, 
            0,
            0,
            this.image.width,
            this.image.height / 4,
            0, 
            0, 
            this.image.width,
            this.image.height / 4
        )

        this.getPaletteFromImage(this.ctx.canvas, 'top')
    }

    cropBottom() {
        this.ctx.canvas.width = this.image.width
        this.ctx.canvas.height = this.image.height / 4

        console.log(
            'x:', 0,
            'y:', this.image.height - (this.image.height / 4),
            'w:', this.image.width,
            'h:', this.image.height / 4
        )

        this.ctx.drawImage(
            this.image, 
            0,
            this.image.height - (this.image.height / 4),
            this.image.width,
            this.image.height / 4,
            0, 
            0,
            this.image.width,
            this.image.height / 4
        )

        this.getPaletteFromImage(this.ctx.canvas, 'bottom')
    }

    getPaletteFromImage(img: CanvasImageSource, topBottom: 'top' | 'bottom') {
        const colorThief = new ColorThief

        /* let palette = colorThief.getPalette(img, 5, 1)
        console.log('Palette:', palette) */

        let color: RGB = colorThief.getColor(img, 1)
        console.log('Color:', color)

        const rgbStr = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'
        console.log('rgbStr:', rgbStr)

        const textColor = this.invertColor(color)
        console.log('Text color:', textColor)
    }

    invertColor(color: RGB) {
        // http://stackoverflow.com/a/3943023/112731
        return (color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF'
    }

}
