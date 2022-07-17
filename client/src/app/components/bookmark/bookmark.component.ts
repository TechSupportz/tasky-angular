import { Component, Input, OnInit } from '@angular/core';
import { Bookmark } from 'src/app/models/bookmark';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {
  @Input() bookmark: Bookmark;

  constructor() { }

  ngOnInit(): void {
  }

  navigate() {
    window.open(this.bookmark.link, '_blank');
  }

}
