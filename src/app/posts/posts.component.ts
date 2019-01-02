import { Component, OnInit } from '@angular/core'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { Observable } from 'rxjs'

import { PostMeta } from '../models/post-meta.model'
import { folders, notes } from '../data/static-data'

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: [ './posts.component.scss' ]
})
export class PostsComponent implements OnInit {
	postsMeta: Observable<PostMeta[]>
	folders = folders
	notes = notes

	constructor(private db: AngularFirestore) {}

	ngOnInit() {
		this.postsMeta = this.db.collection<PostMeta>('posts').valueChanges()
	}
}
