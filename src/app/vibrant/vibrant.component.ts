import { Component, OnInit } from '@angular/core'
// import Vibrant from 'node-vibrant'
import { ColorThief } from './color-thief.js'

// import ColorThief from 'color-thief'
// import Cropper from 'cropperjs'

interface PostMeta {
    img: string
    backgroundImg: string
    margin: string
    height: string
    cardBackgroundGradient: string
    imgBackgroundGradient: string
    textColorTop: string
    textColorBottom: string
    showComment: boolean
}

@Component({
    selector: 'app-vibrant',
    templateUrl: './vibrant.component.html',
    styleUrls: ['./vibrant.component.scss']
})
export class VibrantComponent implements OnInit {

    
    postsMeta: PostMeta[] = []

    posts = [
        {
            img: 'assets/img/2000x3000.jpg',
            imgProportion: 'portrait',
            height: '600px',
            gradientTop: '585754',
            gradientBottom: '261b1a',
            rgb1: 'linear-gradient(to bottom, #807c7a 0%, #807c7a 50%, #2e231e 50%, #2e231e 100%)'
        },
        {
            img: 'assets/img/2000x3000.jpg',
            imgProportion: 'portrait',
            height: '600px',
            gradientTop: '838181',
            gradientBottom: '4f4235',
            rgb1: 'linear-gradient(to bottom, #807c7a 0%, #807c7a 50%, #2e231e 50%, #2e231e 100%)'
        },
        {
            img: 'assets/img/5.jpg',
            imgProportion: 'portrait',
            height: '600px',
            gradientTop: '807c7a',
            gradientBottom: '2e231e',
            rgb1: 'linear-gradient(to bottom, #807c7a 0%, #807c7a 50%, #2e231e 50%, #2e231e 100%)'
        },
        {
            img: 'assets/img/5.jpg',
            imgProportion: 'portrait',
            height: '600px',
            gradientTop: 'rgb(128, 124, 122)',
            gradientBottom: 'rgb(46, 35, 30)',
        },
        {
            img: 'assets/img/4.jpg',
            imgProportion: 'landscape',
            height: '269px',
            gradientTop: 'rgb(220,199,205)',
            gradientBottom: 'rgb(167,116,105)',
            textColorTop: '#000000',
            textColorBottom: '#FFFFFF'
        },
        {
            img: 'assets/img/2.jpg',
            imgProportion: 'portrait',
            height: '499px',
            gradientTop: 'rgb(148,189,194)',
            gradientBottom: 'rgb(114,181,189)',
            textColorTop: 'white',
            textColorBottom: 'white'
        }
    ]

    folders = [
        { avatar: 'assets/img/avatars/1.jpg', name: 'Photos', updated: new Date('1/1/16') },
        { avatar: 'assets/img/avatars/2.jpg', name: 'Recipes', updated: new Date('1/17/16') },
        { avatar: 'assets/img/avatars/3.jpg', name: 'Work', updated: new Date('1/28/16') }
    ]

    notes = [
        { name: 'Vacation Itinerary', updated: new Date('2/20/16') },
        { name: 'Kitchen Remodel', updated: new Date('1/18/16') }
    ]

    cards = [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
    ]

    ctx: CanvasRenderingContext2D
    image = null

    constructor() {
        // window.onload = () => this.getPaletteFromImage()
    }

    ngOnInit() {
        // let canvas = <HTMLCanvasElement> document.getElementById('panel')
        // this.ctx = canvas.getContext('2d')

        this.initCanvas()

        document.getElementById('cropBttn').onclick = () => {
            this.cropTop()
            this.cropBottom()
        }

        this.posts.forEach(post => {
            const postMeta: PostMeta = {
                img: post.img,
                backgroundImg: 'url(' + post.img + ') no-repeat round',
                margin: post.imgProportion === 'portrait' ? '-60px -24px -120px -24px' : '0px -24px 16px -24px',
                height: post.height,
                imgBackgroundGradient: 'linear-gradient(to bottom, ' + post.gradientTop +
                    ' 0%, transparent 50%, transparent 50%, ' + post.gradientBottom + ' 100%)',
                cardBackgroundGradient: 'linear-gradient(to bottom, ' + 
                    post.gradientTop + ' 0%, ' + post.gradientTop + ' 20%, ' + 
                    post.gradientBottom + ' 20%, ' + post.gradientBottom + ' 100%)',
                textColorTop: post.textColorTop === 'white' ? '' : '',
                textColorBottom: post.textColorBottom,
                showComment: true
            }

            // 'linear-gradient(to bottom, #807c7a 0%, #807c7a 50%, #2e231e 50%, #2e231e 100%)'
            // linear-gradient(rgb(128, 124, 122) 0%, transparent 50%, transparent 50%, rgb(46, 35, 30) 100%)

            console.log(postMeta)
            this.postsMeta.push(postMeta)
        })
    }

    /* toRgb(arr: []): string {
        return 'rgb(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')'
    } */

    initCanvas() {
        this.image = new Image()
        this.image.setAttribute('crossOrigin', 'anonymous')
        this.image.src = './assets/img/2.jpg'

        let panel_img = <HTMLImageElement> document.getElementById('panel-img')

        const img = document.createElement('img')
        img.style.width = '500px'
        img.src = this.image.src
        panel_img.appendChild(img)

        /* this.image.onload = () => {
            this.ctx.canvas.width = this.image.width
            this.ctx.canvas.height = this.image.height
            this.ctx.drawImage(this.image, 0, 0)
        } */
    }

    cropTop() {
        let tempCtx = document.createElement('canvas').getContext('2d')
        tempCtx.canvas.width = this.image.width
        tempCtx.canvas.height = this.image.height / 4
        
        console.log(
            'x:', 0,
            'y:', 0,
            'w:', this.image.width,
            'h:', this.image.height / 4
        )

        tempCtx.drawImage(
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

        let imageData = tempCtx.canvas.toDataURL()
        let croppedImage = <HTMLImageElement> document.getElementById('croppedImageTop')
        croppedImage.src = imageData
        this.getPaletteFromImage(croppedImage, 'top')
    }

    cropBottom() {
        let tempCtx = document.createElement('canvas').getContext('2d')
        tempCtx.canvas.width = this.image.width
        tempCtx.canvas.height = this.image.height / 4
        
        console.log(
            'x:', 0,
            'y:', this.image.height - (this.image.height / 4),
            'w:', this.image.width,
            'h:', this.image.height / 4
        )

        tempCtx.drawImage(
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

        let imageData = tempCtx.canvas.toDataURL()
        let croppedImage = <HTMLImageElement> document.getElementById('croppedImageBottom')
        croppedImage.src = imageData
        this.getPaletteFromImage(croppedImage, 'bottom')
    }

    getPaletteFromImage(img: HTMLImageElement, topBottom: 'top' | 'bottom') {

        /* if (topBottom === 'top') {
            let top = document.getElementById('croppedImageTop')

            const colorThief = new ColorThief()
            const color = colorThief.getColor(top)
            console.log(color)
        }
        
        if (topBottom === 'bottom') {
            let bottom = document.getElementById('croppedImageBottom')

            const colorThief = new ColorThief()
            const color = colorThief.getColor(bottom)
            console.log(color)
        } */

        let dir: HTMLElement
        if (topBottom === 'top') {
            dir = document.getElementById('top')
        } else {
            dir = document.getElementById('bottom')
        }

        setTimeout(() => {
            const colorThief = new ColorThief()
            const rgbArr: number[] = colorThief.getColor(img)
            const rgbStr = 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')'

            const textColor = this.invertColor(rgbArr)
            console.log('Text color:', textColor)

            const div = document.createElement('div')
            div.style.margin = '30px'
            div.style.width = '100px'
            div.style.height = '100px'
            div.style.display = 'block'
            div.style.cssFloat = 'left'
            div.innerHTML = '<p style="color: ' + textColor + '">' + rgbArr + '</p>'
            div.style.background = rgbStr
            dir.appendChild(div)

            // this.posts.push()
        }, 1)


        
        /* RGBaster.colors(img, {
            // paletteSize: 3,
            exclude: ['rgb(255,255,255)', 'rgb(0,0,0)'],
            success: function (payload) {
                console.log('dominant', payload.dominant)
                console.log('secondary', payload.secondary)
                console.log('palette', payload.palette)

                let dir: HTMLElement
                if (topBottom === 'top') {
                    dir = document.getElementById('top')
                } else {
                    dir = document.getElementById('bottom')
                }

                for (let index = 0; index < payload.palette.length; index++) {
                    

                    if (index === 0) {

                        const div_dominant = document.createElement('div')
                        const div_secondary = document.createElement('div')

                        div_secondary.style.margin = div_dominant.style.margin = '30px'
                        div_secondary.style.width = div_dominant.style.width = '100px'
                        div_secondary.style.height = div_dominant.style.height = '100px'
                        div_secondary.style.display = div_dominant.style.display = 'block'
                        div_secondary.style.cssFloat = div_dominant.style.cssFloat = 'left'
                        
                        div_dominant.innerHTML = '<p style="margin-top: -20px">' + 'dominant' + '</p>'
                        div_secondary.innerHTML = '<p style="margin-top: -20px">' + 'secondary' + '</p>'

                        div_dominant.style.background = payload.dominant
                        div_secondary.style.background = payload.secondary

                        dir.appendChild(div_dominant)
                        dir.appendChild(div_secondary)
                    }

                    const div = document.createElement('div')
                    div.style.margin = '30px'
                    div.style.width = '100px'
                    div.style.height = '100px'
                    div.style.display = 'block'
                    div.style.cssFloat = 'left'
                    div.innerHTML = '<p style="margin-top: -20px">' + payload.palette[index] + '</p>'
                    div.style.background = payload.palette[index]
                    dir.appendChild(div)
                }

            }
        }) */

        /* 
        const colorThief = new ColorThief()
        const rgb = colorThief.getColor(img)


        setTimeout(() => {
            console.log(rgb)    
        }, 2000) */
        
        

        // const img = document.images.item(0)
        
        /* createImageBitmap(img, 220, 330, img.width, img.height).then(imgBitmap => {
            const bitMap = imgBitmap
            console.log(bitMap)

            const my_img = document.createElement('img')
            my_img.style.backgroundImage = bitMap
            document.body.appendChild(my_img)
        }) */

        /* Vibrant.from(img).quality(0).maxColorCount(2).getPalette((err, palette) => {
            console.log(palette)

            let DarkMuted
            let DarkVibrant
            let LightMuted
            let LightVibrant
            let Muted
            let Vibrant_

            let my_palette = []

            if (palette.DarkMuted) {
                DarkMuted = palette.DarkMuted.getRgb()
            }
            if (palette.DarkVibrant) {
                DarkVibrant = palette.DarkVibrant.getRgb()
            }
            if (palette.LightMuted) {
                LightMuted = palette.LightMuted.getRgb()
            }
            if (palette.LightVibrant) {
                LightVibrant = palette.LightVibrant.getRgb()
            }
            if (palette.Muted) {
                Muted = palette.Muted.getRgb()
            }
            if (palette.Vibrant) {
                Vibrant_ = palette.Vibrant.getRgb()
            }

            if (DarkMuted) {
                my_palette.push(
                    { background: 'rgb(' + DarkMuted['0'] + ',' + DarkMuted['1'] + ',' + DarkMuted['2'] + ')', name: 'DarkMuted' }
                )
            }
            if (DarkVibrant) {
                my_palette.push(
                    { background: 'rgb(' + DarkVibrant['0'] + ',' + DarkVibrant['1'] + ',' + DarkVibrant['2'] + ')', name: 'DarkVibrant' }
                )
            }
            if (LightMuted) {
                my_palette.push(
                    { background: 'rgb(' + LightMuted['0'] + ',' + LightMuted['1'] + ',' + LightMuted['2'] + ')', name: 'LightMuted' }
                )
            }
            if (LightVibrant) {
                my_palette.push({ 
                    background: 'rgb(' + LightVibrant['0'] + ',' + LightVibrant['1'] + ',' + LightVibrant['2'] + ')', name: 'LightVibrant' 
                })
            }
            if (Muted) {
                my_palette.push(
                    { background: 'rgb(' + Muted['0'] + ',' + Muted['1'] + ',' + Muted['2'] + ')', name: 'Muted' },
                )
            }
            if (Vibrant_) {
                my_palette.push(
                    { background: 'rgb(' + Vibrant_['0'] + ',' + Vibrant_['1'] + ',' + Vibrant_['2'] + ')', name: 'Vibrant' }
                )
            }

            console.log('my_palette', my_palette)

            let dir: HTMLElement
            if (topBottom === 'top') {
                dir = document.getElementById('top')
            } else {
                dir = document.getElementById('bottom')
            }

            for (let index = 0; index < my_palette.length; index++) {    
                const div = document.createElement('div')
                div.style.margin = '30px'
                div.style.width = '50px'
                div.style.height = '50px'
                div.style.display = 'block'
                div.style.cssFloat = 'left'
                div.innerHTML = '<p style="margin-top: -20px">' + my_palette[index].name + '</p>'
                div.style.background = my_palette[index].background
                dir.appendChild(div)
                // document.body.appendChild(div)
            }
        }) */
    }

    invertColor(rgb: number[]) {
        let r = rgb[0],
            g = rgb[1],
            b = rgb[2]

        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF'
    }

}
