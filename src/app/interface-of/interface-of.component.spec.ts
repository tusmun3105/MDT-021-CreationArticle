import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceOFComponent } from './interface-of.component';

describe('InterfaceOFComponent', () => {
  let component: InterfaceOFComponent;
  let fixture: ComponentFixture<InterfaceOFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceOFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfaceOFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
