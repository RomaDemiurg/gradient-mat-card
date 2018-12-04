import { Injectable } from '@angular/core'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { UploadMetadata } from '@angular/fire/storage/interfaces';
import { Observable } from 'rxjs';
import { User } from '../classes/user.model';

@Injectable({
    providedIn: 'root'
})
export class StorageUploadService {

    currentUser: User = new User
    uploadPercent: Observable<number>
    downloadUrl: string | null = null

    constructor(private storage: AngularFireStorage) {
        this.currentUser.id = 'Roma'
        this.currentUser.photoUrl = 'Roma_photoUrl'
    }

    uploadToStorage(file: File, uploadMetadata: UploadMetadata): AngularFireUploadTask {
        const filePath = `${this.currentUser.id}_${file.name}`
        const afUploadTask = this.storage.upload(filePath, file, uploadMetadata)
        return afUploadTask
    }

    getUploadPercent(afUploadTask: AngularFireUploadTask): Observable<number> {
        const uploadPercent = this.uploadPercent = afUploadTask.percentageChanges()
        return uploadPercent
    }

    getDownloadURL(afUploadTask: AngularFireUploadTask): Promise<string> {
        return afUploadTask.task.snapshot.ref.getDownloadURL().then((url: string) => {
            const downloadUrl: string = this.downloadUrl = url
            return downloadUrl
        })
    }
}
