import { Component, OnInit } from '@angular/core'
import { ColorThief } from './color-thief.js'

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage'
import { Observable, Subscription } from 'rxjs'
import { User } from '../classes/user.model'
import { PostMeta } from '../models/post-meta.model'
import { RGB } from './color-thief.model'
import { UploadMetadata } from '@angular/fire/storage/interfaces'
import { ImageInputService } from './classes/image-input.service'
import { StorageUploadService } from './storage-upload.service'
import { ImageService } from './classes/image.service'


@Component({
    selector: 'app-vibrant',
    templateUrl: './vibrant.component.html',
    styleUrls: ['./vibrant.component.scss']
})
export class VibrantComponent implements OnInit {
    
    postsMeta: Observable<PostMeta[]>
    currentUser: User = new User
    userId = ''
    private subscriptions: Subscription[] = []
    uploadPercent: Observable<number>
    downloadUrl: string | null = null
    fileName: string
    // image: HTMLImageElement = new Image()
    // reader: FileReader = new FileReader()
    colorThief = new ColorThief()
    folders = [
        { avatar: 'assets/img/avatars/1.jpg', name: 'Photos', updated: new Date('1/1/16') },
        { avatar: 'assets/img/avatars/2.jpg', name: 'Recipes', updated: new Date('1/17/16') },
        { avatar: 'assets/img/avatars/3.jpg', name: 'Work', updated: new Date('1/28/16') }
    ]

    notes = [
        { name: 'Vacation Itinerary', updated: new Date('2/20/16') },
        { name: 'Kitchen Remodel', updated: new Date('1/18/16') }
    ]

    constructor(
        private db: AngularFirestore,
        private storageService: StorageUploadService,
        private imageInputService: ImageInputService,
        private imageService: ImageService
    ) { }

    ngOnInit() {
        this.postsMeta = this.db.collection<PostMeta>('posts').valueChanges();

        this.currentUser.id = 'Roma'
        this.currentUser.photoUrl = 'Roma_photoUrl'
    }

    async uploadFile(input: HTMLInputElement) {

        if (!this.imageInputService.getFileFromInput(input)) return

        const file: File = this.imageInputService.getFileFromInput(input)
        this.fileName = file.name
        
        const imageSrc: string = await this.imageInputService.getImageSrc(file)
        const image: HTMLImageElement = await this.imageInputService.getImage(imageSrc)

        const uploadMetadata: UploadMetadata = this.getUploadMetadata(image)
        const afUploadTask = this.storageService.uploadToStorage(file, uploadMetadata)
        const uploadPercent = this.storageService.getUploadPercent(afUploadTask)
        this.uploadPercent = uploadPercent
        const downloadUrl = await this.storageService.getDownloadURL(afUploadTask)
        this.downloadUrl = downloadUrl
        console.log(downloadUrl)
    }

    private getUploadMetadata(image: HTMLImageElement): UploadMetadata {
        const { canvasTop, canvasBottom } = this.imageService.cropImage(image)
        const { colorTop, colorBottom } = this.imageService.getColors(canvasTop, canvasBottom)
        const { rgbStrTop, rgbStrBottom } = this.imageService.getRGBStr(colorTop, colorBottom)
        const { textColorTop, textColorBottom } = this.imageService.getTextColors(colorTop, colorBottom)
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
}
