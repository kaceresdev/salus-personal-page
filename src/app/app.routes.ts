import { Routes } from '@angular/router';
import { YoutubeMP3Component } from './pages/youtube-mp3/youtube-mp3.component';
import { PrincipalComponent } from './pages/principal/principal.component';

export const routes: Routes = [
  { path: '', component: PrincipalComponent, pathMatch: 'full' },
  { path: 'youtubeMP3', component: YoutubeMP3Component, pathMatch: 'full' },
];
