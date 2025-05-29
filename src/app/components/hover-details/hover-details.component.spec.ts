import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverDetailsComponent } from './hover-details.component';

describe('HoverDetailsComponent', () => {
  let component: HoverDetailsComponent;
  let fixture: ComponentFixture<HoverDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
