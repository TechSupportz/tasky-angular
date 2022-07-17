import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { bookmarkList } from "../mock-data/mock-bookmark"
import { Bookmark } from "../models/bookmark"

@Injectable({
	providedIn: "root",
})
export class BookmarkService {
	constructor() {}

	getBookmarks(): Observable<Bookmark[]> {
		return of(bookmarkList)
	}
}
