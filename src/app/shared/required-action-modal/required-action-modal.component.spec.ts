import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequiredActionModalComponent } from './required-action-modal.component';

describe('RequiredActionModalComponent', () => {
  let component: RequiredActionModalComponent;
  let fixture: ComponentFixture<RequiredActionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequiredActionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequiredActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
