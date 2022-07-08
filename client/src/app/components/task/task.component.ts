import { Component, Input, OnInit } from '@angular/core';
import { SubTask, Tasks} from 'src/app/types/task';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input() task: Tasks | SubTask ;

  constructor() { }

  ngOnInit(): void {
  }

}
