import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetropolisComponent } from './mportfolio.component';

describe('MportfolioComponent', () => {
  let component: MetropolisComponent;
  let fixture: ComponentFixture<MetropolisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetropolisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetropolisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
