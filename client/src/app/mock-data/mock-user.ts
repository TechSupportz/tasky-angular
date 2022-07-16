import { User, UserType } from "../types/user"

export const userList: User[] = [
	{
		id: 1,
		username: "Steven",
		email: "StevenGrant@gmail.com",
		type: UserType.PRO,
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
]
