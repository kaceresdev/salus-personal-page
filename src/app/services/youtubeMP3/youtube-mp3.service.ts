import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeMP3Service {
  private youtubeDownload = environment.urlBaseServer + '/download';

  constructor(private http: HttpClient) {}

  youtubeToMp3(id: string): Observable<any> {
    const queryParams = new HttpParams().set('id', id);

    return this.http.get(this.youtubeDownload, {
      params: queryParams,
    });
  }
}
