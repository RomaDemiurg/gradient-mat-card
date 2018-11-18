import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
    
    ctx: CanvasRenderingContext2D
    image = null
    click = false
    downPointX = 0
    downPointY = 0
    lastPointX = 0
    lastPointY = 0
    hoverBoxSize = 5
    cropedFile = null
    resize = false
    canvasBackgroundColor = '#FFFFFF'

    constructor() { }

    ngOnInit() {
        let canvas = <HTMLCanvasElement> document.getElementById('panel')
        this.ctx = canvas.getContext('2d')

        this.initCanvas()

        document.getElementById('cropBttn').onclick = () => {
            this.cropTop()
            this.cropBottom()
        }
    }

    initCanvas() {
        this.image = new Image()
        this.image.setAttribute('crossOrigin', 'anonymous')
        this.image.src = './assets/img/2.jpg'
        this.image.onload = () => {
            this.ctx.canvas.width = this.image.width
            this.ctx.canvas.height = this.image.height
            this.reDrawCanvas()
            this.initEventsOnCanvas()
        }
    }

    /**
     * Initlize mousedown and mouseup event, third brother of this type of event, onmousemove, will be set little letter.
     */
    initEventsOnCanvas() {
        this.ctx.canvas.onmousedown = (event) => this.onMouseDown(event)
        this.ctx.canvas.onmouseup = (event) => this.onMouseUp(event)
    }

    /**
     * This event is bit tricky!
     * Normal task of this method is to pin point the starting point, from where we will  strat making the selectin box.
     * However, it work diffrently if user is hover over the resize boxes
     */
    onMouseDown(e) {
        let loc = this.windowToCanvas(e.clientX, e.clientY)
        e.preventDefault()
        this.click = true

        if (!this.resize) {
            this.ctx.canvas.onmousemove = (ev) => this.onMouseMove(ev)
            this.downPointX = loc.x
            this.downPointY = loc.y
            this.lastPointX = loc.x
            this.lastPointY = loc.y
        }
    }

    /**
     * register normal movement, with click but no re-size.
     */
    onMouseMove(e) {
        e.preventDefault()

        if (this.click) {
            let loc = this.windowToCanvas(e.clientX, e.clientY)
            this.lastPointX = loc.x
            this.lastPointY = loc.y
            this.reDrawCanvas()
        }
    }

    onMouseUp(e) {
        e.preventDefault()
        this.ctx.canvas.onmousemove = (ev) => this.onImageResize(ev)
        this.click = false
    }

    reDrawCanvas() {
        this.clearCanvas()
        this.drawImage()
        this.drawSelRect()
        this.drawResizerBox()
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        this.ctx.fillStyle = this.canvasBackgroundColor
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    }

    /**
     * Draw image on canvas.
     */
    drawImage() {
        this.ctx.drawImage(this.image, 0, 0)
    }

    /**
     * Draw selection box on canvas
     */
    drawSelRect() {
        this.ctx.strokeStyle = '#000000'
        this.ctx.lineWidth = 1
        this.ctx.strokeRect(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY))
    }

    /**
     * This method take care of resizeing the selection box.
     * It does so by looking on (click == true and hover on resize box == true)
     * if both are true, it adjust the resize.
     *
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    onImageResize(e) {
        let centerPointX = (this.lastPointX + this.downPointX) / 2
        let centerPointY = (this.lastPointY + this.downPointY) / 2
        let loc = this.windowToCanvas(e.clientX, e.clientY)
        this.ctx.fillStyle = '#FF0000'
        this.ctx.lineWidth = 1

        if (this.isResizeBoxHover(loc, centerPointX, this.downPointY)) {
            if (this.click) {
                this.downPointY = loc.y
                this.reDrawCanvas()
            }
        } else if (this.isResizeBoxHover(loc, this.lastPointX, centerPointY)) {
            if (this.click) {
                this.lastPointX = loc.x
                this.reDrawCanvas()
            }
        } else if (this.isResizeBoxHover(loc, centerPointX, this.lastPointY)) {
            if (this.click) {
                this.lastPointY = loc.y
                this.reDrawCanvas()
            }
        } else if (this.isResizeBoxHover(loc, this.downPointX, centerPointY)) {
            if (this.click) {
                this.downPointX = loc.x
                this.reDrawCanvas()
            }
        } else {
            this.resize = false
            this.reDrawCanvas()
        }
    }

    /**
     * Detect the mousehover on given axis
     */
    isResizeBoxHover(loc, xPoint, yPoint) {
        let hoverMargin = 3;

        if (
            loc.x > (xPoint - this.hoverBoxSize - hoverMargin) && 
            loc.x < (xPoint + this.hoverBoxSize + hoverMargin) && 
            loc.y > (yPoint - this.hoverBoxSize - hoverMargin) && 
            loc.y < (yPoint + 5 + hoverMargin)
        ) {
            this.ctx.fillRect(xPoint - this.hoverBoxSize, yPoint - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2)
            this.resize = true
            return true
        }

        return false
    }

    /**
     * Draw 4 resize box of 10 x 10
     * @return {[type]} [description]
     */
    drawResizerBox() {
        let centerPointX = (this.lastPointX + this.downPointX) / 2
        let centerPointY = (this.lastPointY + this.downPointY) / 2
        this.ctx.fillStyle = '#000000'
        this.ctx.lineWidth = 1

        this.ctx.fillRect(
            centerPointX - this.hoverBoxSize, 
            this.downPointY - this.hoverBoxSize, 
            this.hoverBoxSize * 2, 
            this.hoverBoxSize * 2
        )

        this.ctx.fillRect(
            this.lastPointX - this.hoverBoxSize, 
            centerPointY - this.hoverBoxSize, 
            this.hoverBoxSize * 2, 
            this.hoverBoxSize * 2
        )

        this.ctx.fillRect(
            centerPointX - this.hoverBoxSize, 
            this.lastPointY - this.hoverBoxSize, 
            this.hoverBoxSize * 2, 
            this.hoverBoxSize * 2
        )

        this.ctx.fillRect(
            this.downPointX - this.hoverBoxSize, 
            centerPointY - this.hoverBoxSize, 
            this.hoverBoxSize * 2, 
            this.hoverBoxSize * 2
        )
    }

    /**
     * Translate to HTML coardinates to Canvas coardinates.
     */
    windowToCanvas(x, y) {
        let canvas = this.ctx.canvas
        let bbox = canvas.getBoundingClientRect()

        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        }
    }

    /**
     * Get the canavs, remove cutout, create image elemnet on UI.
     * @return {[type]}
     */
    cropImage() {
        let tempCtx = document.createElement('canvas').getContext('2d')
        tempCtx.canvas.width = this.image.width
        tempCtx.canvas.height = this.image.height
        
        console.log(this.downPointX, this.downPointY, (this.lastPointX - this.downPointX), (this.lastPointY - this.downPointY))

        tempCtx.drawImage(
            this.image, 
            this.downPointX, 
            this.downPointY, 
            (this.lastPointX - this.downPointX), 
            (this.lastPointY - this.downPointY), 
            0, 
            0, 
            (this.lastPointX - this.downPointX), 
            (this.lastPointY - this.downPointY)
        )

        let imageData = tempCtx.canvas.toDataURL()
        let croppedImage = <HTMLImageElement> document.getElementById('croppedImage')
        croppedImage.src = imageData
    }

    cropTop() {
        let tempCtx = document.createElement('canvas').getContext('2d')
        tempCtx.canvas.width = this.image.width
        tempCtx.canvas.height = this.image.height / 10
        
        console.log(
            'x:', 0,
            'y:', 0,
            'w:', this.image.width,
            'h:', this.image.height / 10
        )

        tempCtx.drawImage(
            this.image, 
            0,
            0,
            this.image.width,
            this.image.height / 10,
            0, 
            0, 
            this.image.width,
            this.image.height / 10
        )

        let imageData = tempCtx.canvas.toDataURL()
        let croppedImage = <HTMLImageElement> document.getElementById('croppedImageTop')
        croppedImage.src = imageData
    }

    cropBottom() {
        let tempCtx = document.createElement('canvas').getContext('2d')
        tempCtx.canvas.width = this.image.width
        tempCtx.canvas.height = this.image.height / 10
        
        console.log(
            'x:', 0,
            'y:', this.image.height - (this.image.height / 10),
            'w:', this.image.width,
            'h:', this.image.height / 10
        )

        tempCtx.drawImage(
            this.image, 
            0,
            this.image.height - (this.image.height / 10),
            this.image.width,
            this.image.height / 10,
            0, 
            0,
            this.image.width,
            this.image.height / 10
        )

        let imageData = tempCtx.canvas.toDataURL()
        let croppedImage = <HTMLImageElement> document.getElementById('croppedImageBottom')
        croppedImage.src = imageData
    }
}
