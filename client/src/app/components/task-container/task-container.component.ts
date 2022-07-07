import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-container',
  templateUrl: './task-container.component.html',
  styleUrls: ['./task-container.component.css']
})
export class TaskContainerComponent implements OnInit {

  @Input() isHomePage: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
