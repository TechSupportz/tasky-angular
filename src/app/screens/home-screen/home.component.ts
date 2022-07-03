import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeScreenComponent implements OnInit {

  username: string = 'JohnDoe';

  constructor() { }

  ngOnInit(): void {
  }



}
