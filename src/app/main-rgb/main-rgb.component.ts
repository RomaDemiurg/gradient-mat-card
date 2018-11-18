import { Component } from '@angular/core'

@Component({
    selector: 'app-main-rgb',
    templateUrl: './main-rgb.component.html',
    styleUrls: ['./main-rgb.component.scss']
})
export class MainRGBComponent {

    constructor() {
        window.onload = () => this.baster()
    }

    baster() {
        const img = document.getElementById('image_1')

        RGBaster.colors(img, {
            success: function (payload) {
                console.log('dominant', payload.dominant)
                console.log('secondary', payload.secondary)
                console.log('palette', payload.palette)

                for (let index = 0; index < payload.palette.length; index++) {
                    const color = payload.palette[index]

                    const div = document.createElement('div')
                    // div.style.margin = '40px auto'
                    div.style.width = '110px'
                    div.style.height = '110px'
                    div.style.display = 'block'
                    div.style.cssFloat = 'right'
                    div.textContent = payload.palette[index]
                    div.style.background = payload.palette[index]
                    document.body.appendChild(div)
                }

            }
        })
    }

}
