import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsecuritiesComponent } from './msecurities.component';

describe('MsecuritiesComponent', () => {
  let component: MsecuritiesComponent;
  let fixture: ComponentFixture<MsecuritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsecuritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
