import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, MatListModule } from '@angular/material';
import { AverageRGBComponent } from './average-rgb/average-rgb.component';
import { MainRGBComponent } from './main-rgb/main-rgb.component';
import { VibrantComponent } from './vibrant/vibrant.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

const AngularMaterialFeatures = [
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
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
    VibrantComponent,
    ImageCropperComponent
  ],
  imports: [
    BrowserModule,
    ...AngularFireFeatures,
    BrowserAnimationsModule,
    ...AngularMaterialFeatures
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
