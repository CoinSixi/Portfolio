import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MnavigationComponent } from './mnavigation.component';

describe('MnavigationComponent', () => {
  let component: MnavigationComponent;
  let fixture: ComponentFixture<MnavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MnavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
