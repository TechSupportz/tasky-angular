export interface User {
	_id: string
	username: string
	email: string
	profilePicture?: string
	type: UserType
}

export interface UserBrief {
	_id: string
	username: string
	type: UserType
}

export enum UserType {
	FREE = "FREE",
	PRO = "PRO",
	PRO_PLUS = "PRO_PLUS",
}
