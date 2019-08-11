import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsecuritiesComponent } from './asecurities.component';

describe('AsecuritiesComponent', () => {
  let component: AsecuritiesComponent;
  let fixture: ComponentFixture<AsecuritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsecuritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsecuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
