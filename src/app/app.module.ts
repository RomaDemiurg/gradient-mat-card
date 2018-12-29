import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, 
    MatButtonModule, MatListModule, MatInputModule } from '@angular/material';
import { AverageRGBComponent } from './average-rgb/average-rgb.component';
import { MainRGBComponent } from './main-rgb/main-rgb.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
  declarations: [
    AppComponent,
    DashboardComponent,
    AverageRGBComponent,
    MainRGBComponent,
    ImageUploadComponent,
    ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    ...AngularFireFeatures,
    BrowserAnimationsModule,
    ...AngularMaterialFeatures,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
