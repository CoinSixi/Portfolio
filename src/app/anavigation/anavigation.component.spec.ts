import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnavigationComponent } from './anavigation.component';

describe('AnavigationComponent', () => {
  let component: AnavigationComponent;
  let fixture: ComponentFixture<AnavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
