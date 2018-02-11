import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ConfirmationModalConfig } from '../confirmation-modal-config.model';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() config: ConfirmationModalConfig;
  @Input() isVisible: boolean;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() buttonClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onButtonClick(index: number){
    this.buttonClick.emit(index);
  }

  onClose(){
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

}
