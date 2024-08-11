import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeMP3Component } from './youtube-mp3.component';

describe('YoutubeMP3Component', () => {
  let component: YoutubeMP3Component;
  let fixture: ComponentFixture<YoutubeMP3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YoutubeMP3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YoutubeMP3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
