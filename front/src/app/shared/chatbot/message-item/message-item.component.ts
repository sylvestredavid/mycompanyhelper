import {Component, Input, OnInit} from '@angular/core';
import {MessageModel} from '../../../models/message.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {

  @Input('message')
  private message: MessageModel;

  constructor() { }

  ngOnInit() {
  }

}
