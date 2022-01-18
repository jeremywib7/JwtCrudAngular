import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterExternalComponent } from './footer-external.component';

describe('FooterExternalComponent', () => {
  let component: FooterExternalComponent;
  let fixture: ComponentFixture<FooterExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
