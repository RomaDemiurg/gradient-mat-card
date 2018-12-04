import { Injectable } from '@angular/core'


@Injectable({
    providedIn: 'root'
})
export class ImageInputService {
    getFileFromInput(input: HTMLInputElement): File {
        return input.files[0]
    }

    getImageSrc(file: File): Promise<string> {
        const reader: FileReader = new FileReader()
        reader.readAsDataURL(file)

        return new Promise<string>(resolve => {
            reader.onload = () => resolve(<string>reader.result)
        })
    }

    getImage(imageSrc: string): Promise<HTMLImageElement> {
        const image: HTMLImageElement = new Image()
        image.src = imageSrc

        return new Promise<HTMLImageElement>(resolve => {
            image.onload = () => resolve(image)
        })
    }
}
