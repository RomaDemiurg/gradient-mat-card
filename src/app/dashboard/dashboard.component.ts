import { Component } from '@angular/core'
// const Vibrant = require('node-vibrant')
// import * as Vibrant from 'node-vibrant'
// const colorify = require('colorifyjs')
// import * as colorify from 'colorify.js'

interface PostMeta {
    img: string
    backgroundImg: string
    margin: string
    height: string
    backgroundGradient: string
    showComment: boolean
}

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

    postsMeta: PostMeta[] = []

    posts = [
        {
            img: 'assets/img/2000x3000.jpg',
            imgProportion: 'portrait',
            height: '600px',
            gradientTop: '585754',
            gradientBottom: '261b1a'
        },
        {
            img: 'assets/img/2000x3000.jpg',
            imgProportion: 'portrait',
            height: '600px',
            gradientTop: '838181',
            gradientBottom: '4f4235'
        },
        {
            img: 'assets/img/910x610.jpg',
            imgProportion: 'landscape'
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

    constructor() {
        this.posts.forEach(post => {
            const postMeta: PostMeta = {
                img: post.img,
                backgroundImg: 'url(' + post.img + ') no-repeat round',
                margin: post.imgProportion === 'portrait' ? '-60px -24px -120px -24px' : '0px -24px 16px -24px',
                height: post.height,
                backgroundGradient: 'linear-gradient(to bottom, #' +
                    post.gradientTop +
                    ' 0%, transparent 50%, transparent 50%, #' +
                    post.gradientBottom +
                    ' 100%)',
                showComment: true
            }

            console.log(postMeta)
            this.postsMeta.push(postMeta)
        })
    }
    
}
