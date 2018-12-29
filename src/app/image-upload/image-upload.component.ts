import { Component, OnInit } from '@angular/core'

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'

import { Observable } from 'rxjs'

import { User } from '../classes/user.model'
import { PostMeta } from '../models/post-meta.model'

import { ImageUploadService } from './image-upload.service'

import { folders, notes } from '../data/static-data'


@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
    
    postsMeta: Observable<PostMeta[]>
    currentUser: User = new User
    uploadPercent: Observable<number>
    downloadUrl: string | null = null
    fileName: string
    folders = folders
    notes = notes

    constructor(
        private db: AngularFirestore,
        private imageUploadService: ImageUploadService
    ) { }

    ngOnInit() {
        this.postsMeta = this.db.collection<PostMeta>('posts').valueChanges();

        this.currentUser.id = 'Roma'
        this.currentUser.photoUrl = 'Roma_photoUrl'
    }

    async uploadFile(input: HTMLInputElement) {
        const file = this.imageUploadService.getFileFromInput(input)

        if (!file) return

        this.fileName = file.name

        const {image, uploadMetadata, angularFireUploadTask, uploadPercent} = await this.imageUploadService.uploadToStorage(file)
        this.uploadPercent = uploadPercent
        // this.downloadUrl = await downloadUrl
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
