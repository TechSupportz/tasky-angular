export interface User {
	id: number;
	username: string;
	email: string;
	profilePicture?: string;
	type: UserType;
}

export enum UserType {
	FREE = "FREE",
	PRO = "PRO",
	PRO_PLUS = "PRO_PLUS",
}