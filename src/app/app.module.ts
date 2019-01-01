import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
	MatGridListModule,
	MatCardModule,
	MatMenuModule,
	MatIconModule,
	MatButtonModule,
	MatListModule,
	MatInputModule
} from '@angular/material'
import { ImageUploadComponent } from './image-upload/image-upload.component'

import { AngularFireModule } from '@angular/fire'
import { environment } from '../environments/environment'

import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { AngularFireStorageModule } from '@angular/fire/storage'

import { ReactiveFormsModule, FormsModule } from '@angular/forms'

const AngularMaterialFeatures = [
	MatGridListModule,
	MatCardModule,
	MatMenuModule,
	MatIconModule,
	MatButtonModule,
	MatListModule,
	MatInputModule
]

const AngularFireFeatures = [
	AngularFireModule.initializeApp(environment.firebase),
	AngularFirestoreModule,
	AngularFireAuthModule,
	AngularFireStorageModule
]

@NgModule({
	declarations: [ AppComponent, ImageUploadComponent ],
	imports: [
		BrowserModule,
		...AngularFireFeatures,
		BrowserAnimationsModule,
		...AngularMaterialFeatures,
		ReactiveFormsModule,
		FormsModule
	],
	providers: [],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
