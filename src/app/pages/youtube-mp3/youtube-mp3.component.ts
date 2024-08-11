import { Component } from '@angular/core';
import { YoutubeMP3Service } from '../../services/youtubeMP3/youtube-mp3.service';
import { FormsModule } from '@angular/forms';
import { IYoutubeMP3 } from '../../interfaces/youtube-mp3.model';

@Component({
  selector: 'app-youtube-mp3',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './youtube-mp3.component.html',
  styleUrl: './youtube-mp3.component.scss',
})
export class YoutubeMP3Component {
  youtubeUrl: string = '';
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
    const url = new URL(this.youtubeUrl);
    const queryParams = new URLSearchParams(url.search);
    const keyVValue = queryParams.get('v');

    this.youtubeMp3Service.youtubeToMp3(keyVValue!).subscribe({
      next: (resp) => {
        console.log('Link success ', resp);
        this.resultApi = resp;
      },
      error: (err) => {
        console.error('An error occurred :', err);
      },
      complete: () => {
        console.log('There are no more action happen.');
      },
    });
  }
}
