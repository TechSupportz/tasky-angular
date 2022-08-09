import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { bookmarkList } from "../mock-data/mock-bookmark"
import { Bookmark } from "../models/bookmark"

@Injectable({
	providedIn: "root",
})
export class BookmarkService {
	constructor() {}

	getBookmarksByUserId(userId: string): Observable<Bookmark[]> {
		return of(bookmarkList.filter((bookmark) => bookmark.userId === userId))
	}

	addBookmark(
		userId: string,
		title: string,
		link: string,
	): Observable<Bookmark[]> {
		const newBookmark: Bookmark = {
			_id: Math.random().toString(36).substr(2, 9),
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

	deleteBookmark(bookmarkId: string, userId: string): Observable<Bookmark[]> {
		bookmarkList.splice(
			bookmarkList.findIndex((bookmark) => bookmark._id === bookmarkId),
			1,
		)
		return of(bookmarkList.filter((bookmark) => bookmark.userId === userId))
	}
}
