import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionReferenceComponent } from './selection-reference.component';

describe('SelectionReferenceComponent', () => {
  let component: SelectionReferenceComponent;
  let fixture: ComponentFixture<SelectionReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectionReferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
