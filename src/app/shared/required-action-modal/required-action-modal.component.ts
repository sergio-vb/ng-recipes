import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { RequiredActionModalConfig } from '../required-action-modal-config.model';

@Component({
  selector: 'app-required-action-modal',
  templateUrl: './required-action-modal.component.html',
  styleUrls: ['./required-action-modal.component.scss']
})
export class RequiredActionModalComponent implements OnInit {

  @Input() config: RequiredActionModalConfig;
  @Input() isVisible: boolean;
  @Output() buttonClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onButtonClick(index: number){
    this.buttonClick.emit(index);
  }

}
