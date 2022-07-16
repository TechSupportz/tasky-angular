import { User, UserType } from "../types/user"

export const userList: User[] = [
	{
		id: 1,
		username: "John",
		email: "john@gmail.com",
		type: UserType.PRO_PLUS,
	},
	{
		id: 2,
		username: "Mary",
		email: "mary@gmail.com",
		type: UserType.PRO_PLUS,
	},
	{
		id: 3,
		username: "",
		email: "john@gmail.com",
		type: UserType.PRO_PLUS,
	},
]
