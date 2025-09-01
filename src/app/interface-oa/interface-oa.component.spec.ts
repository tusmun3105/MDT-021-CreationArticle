import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceOAComponent } from './interface-oa.component';

describe('InterfaceOAComponent', () => {
  let component: InterfaceOAComponent;
  let fixture: ComponentFixture<InterfaceOAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceOAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfaceOAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
