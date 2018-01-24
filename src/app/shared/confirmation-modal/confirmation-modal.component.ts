import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ModalConfig } from '../modal-config.model';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() config: ModalConfig;
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
