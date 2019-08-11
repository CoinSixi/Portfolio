import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MportfoliosComponent } from './mportfolios.component';

describe('MportfoliosComponent', () => {
  let component: MportfoliosComponent;
  let fixture: ComponentFixture<MportfoliosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MportfoliosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MportfoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
