import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, MatListModule} from '@angular/material';
import { AverageRGBComponent } from './average-rgb/average-rgb.component';
import { MainRGBComponent } from './main-rgb/main-rgb.component';
import { VibrantComponent } from './vibrant/vibrant.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';

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
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
