import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteriaNavidadComponent } from './loteria-navidad.component';

describe('LoteriaNavidadComponent', () => {
  let component: LoteriaNavidadComponent;
  let fixture: ComponentFixture<LoteriaNavidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteriaNavidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoteriaNavidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
