import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs"
import { bookmarkList } from "../mock-data/mock-bookmark"
import { Bookmark } from "../models/bookmark"
import { APIConfig } from "./apiConfig"

@Injectable({
	providedIn: "root",
})
export class BookmarkService {
	constructor(private http: HttpClient) {}

	getBookmarksByUserId(userId: string): Observable<Bookmark[]> {
		return this.http.get<Bookmark[]>(`${APIConfig.BASE_URL}/bookmark/${userId}`)
	}

	addBookmark(
		userId: string,
		title: string,
		url: string,
	): Observable<Bookmark> {
		return this.http.post<Bookmark>(
			`${APIConfig.BASE_URL}/bookmark/${userId}/add`,
			{
				title,
				url,
			},
		)
	}

	deleteBookmark(bookmarkId: string): Observable<any> {
		return this.http.delete(`${APIConfig.BASE_URL}/bookmark/${bookmarkId}/delete`)
	}
}
