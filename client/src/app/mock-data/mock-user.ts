import { User, UserType } from "../types/user"

export const userList: User[] = [
	{
		id: 1,
		username: "Steven",
		email: "StevenGrant@gmail.com",
		type: UserType.FREE,
	},
	{
		id: 2,
		username: "Marc",
		email: "MarcSpector@gmail.com",
		type: UserType.PRO_PLUS,
	},
	{
		id: 3,
		username: "Jake",
		email: "JakeLockley@gmail.com",
		type: UserType.PRO_PLUS,
	},
	{
		id: 4,
		username: "Khonshu",
		email: "Moon@gmail.com",
		type: UserType.PRO_PLUS,
	},
]
