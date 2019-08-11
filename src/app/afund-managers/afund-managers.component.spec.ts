import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfundManagersComponent } from './afund-managers.component';

describe('AfundManagersComponent', () => {
  let component: AfundManagersComponent;
  let fixture: ComponentFixture<AfundManagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfundManagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfundManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
