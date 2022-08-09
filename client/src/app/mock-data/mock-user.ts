import { User, UserType } from "../models/user"

export const userList: User[] = [
	{
		_id: "1",
		username: "Steven",
		email: "StevenGrant@gmail.com",
		type: UserType.FREE,
	},
	{
		_id: "2",
		username: "Marc",
		email: "MarcSpector@gmail.com",
		type: UserType.PRO_PLUS,
	},
	{
		_id: "3",
		username: "Jake",
		email: "JakeLockley@gmail.com",
		type: UserType.PRO_PLUS,
	},
	{
		_id: "4",
		username: "Khonshu",
		email: "Moon@gmail.com",
		type: UserType.PRO_PLUS,
	},
]
