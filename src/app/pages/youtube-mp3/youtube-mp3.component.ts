import { Component } from '@angular/core';
import { YoutubeMP3Service } from '../../services/youtubeMP3/youtube-mp3.service';
import { FormsModule } from '@angular/forms';
import { IYoutubeMP3 } from '../../interfaces/youtube-mp3.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-youtube-mp3',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './youtube-mp3.component.html',
  styleUrl: './youtube-mp3.component.scss',
})
export class YoutubeMP3Component {
  youtubeUrl: string = '';
  isLoading = false;
  error = false;
  resultApi: IYoutubeMP3 = {
    link: '',
    title: '',
    filesize: 0,
    progress: 0,
    duration: 0,
    status: '',
    msg: '',
  };

  constructor(private youtubeMp3Service: YoutubeMP3Service) {}

  downloadMP3() {
    this.isLoading = true;
    this.error = false;
    const url = new URL(this.youtubeUrl);
    const queryParams = new URLSearchParams(url.search);
    const keyVValue = queryParams.get('v');

    this.youtubeMp3Service.youtubeToMp3(keyVValue!).subscribe({
      next: (resp) => {
        console.log('Link success ', resp);
        this.resultApi = resp;
        this.youtubeUrl = '';
        this.isLoading = false;
      },
      error: (err) => {
        console.error('An error occurred :', err);
        this.youtubeUrl = '';
        this.isLoading = false;
        this.error = true;
      },
      complete: () => {
        console.log('There are no more action happen.');
      },
    });
  }
}
