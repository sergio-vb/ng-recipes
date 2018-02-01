import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { OptionalActionModalConfig } from '../optional-action-modal-config.model';

@Component({
  selector: 'app-optional-action-modal',
  templateUrl: './optional-action-modal.component.html',
  styleUrls: ['./optional-action-modal.component.scss']
})
export class OptionalActionModalComponent implements OnInit {

  @Input() config: OptionalActionModalConfig;
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() leftButtonClick = new EventEmitter();
  @Output() rightButtonClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClose(){
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  onLeftButtonClick(){
    this.leftButtonClick.emit();
  }
  
  onRightButtonClick(){
    this.rightButtonClick.emit();
  }

}
