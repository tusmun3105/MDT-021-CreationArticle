import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceKITFGComponent } from './interface-kit-fg.component';

describe('InterfaceKITFGComponent', () => {
  let component: InterfaceKITFGComponent;
  let fixture: ComponentFixture<InterfaceKITFGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceKITFGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterfaceKITFGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
