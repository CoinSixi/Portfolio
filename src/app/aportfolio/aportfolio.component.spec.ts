import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AportfolioComponent } from './aportfolio.component';

describe('AportfolioComponent', () => {
  let component: AportfolioComponent;
  let fixture: ComponentFixture<AportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
