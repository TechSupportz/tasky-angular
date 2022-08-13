import { Component, Input, OnInit } from "@angular/core"
import { ConfirmationService } from "primeng/api"
import { Bookmark } from "src/app/models/bookmark"
import { BookmarkService } from "src/app/services/bookmark.service"

@Component({
	selector: "app-bookmark",
	templateUrl: "./bookmark.component.html",
	styleUrls: ["./bookmark.component.css"],
})
export class BookmarkComponent implements OnInit {
	@Input() bookmark: Bookmark

	constructor(
		private bookmarkService: BookmarkService,
		private confirmation: ConfirmationService,
	) {}

	ngOnInit(): void {}

	navigate() {
		window.open(this.bookmark.url, "_blank")
	}
}
