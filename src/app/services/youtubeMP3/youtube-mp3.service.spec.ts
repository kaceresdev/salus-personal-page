import { TestBed } from '@angular/core/testing';

import { YoutubeMP3Service } from './youtube-mp3.service';

describe('YoutubeMP3Service', () => {
  let service: YoutubeMP3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeMP3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
