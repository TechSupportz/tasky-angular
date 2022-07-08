import { Component, Input, OnInit } from '@angular/core';
import { Tasks } from 'src/app/types/task';

@Component({
  selector: 'app-task-container',
  templateUrl: './task-container.component.html',
  styleUrls: ['./task-container.component.css']
})
export class TaskContainerComponent implements OnInit {

  @Input() isHomePage: boolean = false;

  @Input() task: Tasks ;

  constructor() { }

  ngOnInit(): void {
  }

}
