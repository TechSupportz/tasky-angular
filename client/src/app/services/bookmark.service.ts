import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { bookmarkList } from "../mock-data/mock-bookmark"
import { Bookmark } from "../models/bookmark"

@Injectable({
	providedIn: "root",
})
export class BookmarkService {
	constructor() {}

	getBookmarksByUserId(userId: number): Observable<Bookmark[]> {
		return of(bookmarkList.filter((bookmark) => bookmark.userId === userId))
	}

	addBookmark(newBookmark: Bookmark): Observable<Bookmark[]> {
		bookmarkList.push(newBookmark)
		return of(
			bookmarkList.filter(
				(bookmark) => bookmark.userId === newBookmark.userId,
			),
		)
	}
}
