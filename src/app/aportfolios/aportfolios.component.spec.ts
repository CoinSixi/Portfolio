import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AportfoliosComponent } from './aportfolios.component';

describe('AportfoliosComponent', () => {
  let component: AportfoliosComponent;
  let fixture: ComponentFixture<AportfoliosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AportfoliosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AportfoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
