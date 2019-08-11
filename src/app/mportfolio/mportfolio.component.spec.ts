import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MportfolioComponent } from './mportfolio.component';

describe('MportfolioComponent', () => {
  let component: MportfolioComponent;
  let fixture: ComponentFixture<MportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
