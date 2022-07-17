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

	addBookmark(
		userId: number,
		title: string,
		link: string,
	): Observable<Bookmark[]> {
		const newBookmark: Bookmark = {
			id: bookmarkList.length + 1,
			userId: userId,
			title: title,
			link: link,
		}
		bookmarkList.push(newBookmark)
		return of(
			bookmarkList.filter(
				(bookmark) => bookmark.userId === newBookmark.userId,
			),
		)
	}

	deleteBookmark(bookmarkId: number, userId: number): Observable<Bookmark[]> {
		bookmarkList.splice(
			bookmarkList.findIndex((bookmark) => bookmark.id === bookmarkId),
			1,
		)
		return of(bookmarkList.filter((bookmark) => bookmark.userId === userId))
	}
}
