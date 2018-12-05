import { Component, OnInit } from '@angular/core'

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { UploadMetadata } from '@angular/fire/storage/interfaces'

import { Observable } from 'rxjs'

import { User } from '../classes/user.model'
import { PostMeta } from '../models/post-meta.model'

import { StorageUploadService } from './storage-upload.service'
import { ImageInputService } from './classes/image-input.service'
import { ImageService } from './classes/image.service'

import { folders, notes } from './static-data'


@Component({
    selector: 'app-vibrant',
    templateUrl: './vibrant.component.html',
    styleUrls: ['./vibrant.component.scss']
})
export class VibrantComponent implements OnInit {
    
    postsMeta: Observable<PostMeta[]>
    currentUser: User = new User
    uploadPercent: Observable<number>
    downloadUrl: string | null = null
    fileName: string
    folders = folders
    notes = notes

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
