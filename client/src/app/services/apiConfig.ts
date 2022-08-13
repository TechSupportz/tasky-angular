import { HttpHeaders } from "@angular/common/http"

class APIConfig {
	// public static readonly BASE_URL = "http://localhost:3001"
	public static readonly BASE_URL = "https://tasky-node.azurewebsites.net"

	public static httpOptions = {
		headers: new HttpHeaders({
			"Content-Type": "application/json",
		}),
	}
}

export { APIConfig }
