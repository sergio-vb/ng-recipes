import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalActionModalComponent } from './optional-action-modal.component';

describe('OptionalActionModalComponent', () => {
  let component: OptionalActionModalComponent;
  let fixture: ComponentFixture<OptionalActionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionalActionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
