import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-average-rgb',
    templateUrl: './average-rgb.component.html',
    styleUrls: ['./average-rgb.component.scss']
})
export class AverageRGBComponent implements OnInit {

    constructor() {
        // let img = document.createElement('img')
        // img.style = 'margin: 40px auto; width: 300px; display: block; float: right;'
        // img.src = 'assets/img/2000x3000.jpg'
        // document.body.appendChild(img)

        window.onload = () => this.createDivfromImage()
        /* document.onreadystatechange = () => {
            if (document.readyState === 'complete') {
                this.createDivfromImage()
            }
        } */
    }

    ngOnInit() { }

    getAverageRGBTop(imgEl) {
        let blockSize = 1 // only visit every 5 pixels
        let defaultRGB = { r: 0, g: 0, b: 0 } // for non-supporting envs
        let canvas = document.createElement('canvas')
        let context = canvas.getContext && canvas.getContext('2d')
        let data: ImageData, width, height,
            i = -4,
            length: number,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        /* const top = width / 10
        const bottom = height / 10
    
        const y = height - bottom */

        context.drawImage(imgEl, 0, 0);

        try {
            // data = context.getImageData(0, height - bottom, width, bottom)

            data = context.getImageData(0, 0, width, height / 10)
            console.log('height:', height / 10)

            console.log(data)

        } catch (e) {
            console.log('security error, img on diff domain', e)

            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;
    }

    getAverageRGBBottom(imgEl) {
        let blockSize = 1 // only visit every 5 pixels
        let defaultRGB = { r: 0, g: 0, b: 0 } // for non-supporting envs
        let canvas = document.createElement('canvas')
        let context = canvas.getContext && canvas.getContext('2d')
        let data: ImageData, width, height,
            i = -4,
            length: number,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        /* const top = width / 10
        const bottom = height / 10
    
        const y = height - bottom */

        context.drawImage(imgEl, 0, 0);

        try {
            // data = context.getImageData(0, height - bottom, width, bottom)

            /* data = context.getImageData(0, 0, width, height / 10)
            console.log('height:', height / 10) */

            data = context.getImageData(0, height - (height / 10), width, height / 10)
            console.log('height:', height / 10)
            console.log('y:', height - (height / 10))

            console.log(data)

        } catch (e) {
            console.log('security error, img on diff domain', e)

            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return rgb;
    }

    createDivfromImage() {
        const rgb = this.getAverageRGBBottom(document.images[0])
        console.log(document.images[1])
        console.log(rgb)

        const div = document.createElement('div')
        // div.style.margin = '40px auto'
        div.style.width = '200px'
        div.style.height = '200px'
        div.style.display = 'block'
        div.style.cssFloat = 'left'
        div.textContent = 'BOTTOM'
        div.style.background = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'
        document.body.appendChild(div)


        const rgbTop = this.getAverageRGBTop(document.images[0])
        console.log(document.images[0])
        console.log(rgbTop)

        const divTop = document.createElement('div')
        // divTop.style.margin = '40px auto'
        divTop.style.width = '200px'
        divTop.style.height = '200px'
        divTop.style.display = 'block'
        divTop.style.cssFloat = 'left'
        divTop.textContent = 'TOP'
        divTop.style.background = 'rgb(' + rgbTop.r + ',' + rgbTop.g + ',' + rgbTop.b + ')'
        document.body.appendChild(divTop)
    }

}
