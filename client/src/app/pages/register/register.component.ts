import { HttpErrorResponse } from "@angular/common/http"
import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { ICreateOrderRequest, IPayPalConfig } from "ngx-paypal"
import { MessageService } from "primeng/api"
import { User } from "src/app/models/user"
import { UserService } from "src/app/services/user.service"

@Component({
	selector: "app-register",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup
	accountTypes: Array<any>
	isPaymentDialogVisible: boolean = false
	totalAmount: number
	payPalConfig: IPayPalConfig

	constructor(
		private userService: UserService,
		private router: Router,
		private fb: FormBuilder,
		private message: MessageService,
	) {
		this.accountTypes = [
			{ name: "Free", code: "FREE" },
			{ name: "Pro", code: "PRO" },
			{ name: "Pro Plus", code: "PRO_PLUS" },
		]
	}

	ngOnInit(): void {
		this.registerForm = this.fb.group({
			email: ["", Validators.required],
			username: ["", Validators.required],
			password: ["", Validators.required],
			type: ["FREE", Validators.required],
		})

		this.payPalConfig = {
			currency: "USD",
			clientId: "sb",
			createOrderOnClient: (data) =>
				<ICreateOrderRequest>{
					intent: "CAPTURE",
					purchase_units: [
						{
							amount: {
								currency_code: "USD",
								value: this.totalAmount.toString(),
								breakdown: {
									item_total: {
										currency_code: "USD",
										value: this.totalAmount.toString(),
									},
								},
							},
							items: [
								{
									name: `Tasky ${this.registerForm.value.type} account`,
									quantity: "1",
									category: "DIGITAL_GOODS",
									unit_amount: {
										currency_code: "USD",
										value: this.totalAmount.toString(),
									},
								},
							],
						},
					],
				},
			advanced: {
				commit: "true",
			},
			onApprove: (data, actions) => {
				console.log("PayPal Approved")
				// console.log(data)
			},
			onClientAuthorization: (data) => {
				console.log("PayPal Authorized")
				// console.log(data)
				this.message.add({
					severity: "success",
					summary: "Payment Successful",
					detail: `You have successfully paid for a Tasky ${this.registerForm.value.type} account`,
				})
				this.registerUser()
			},
			onError: (err) => {
				console.log("PayPal Error")
				this.message.add({
					severity: "error",
					summary: "Payment Failed",
					detail: "An error occurred during the payment process",
				})
			},
		}
	}

	determinePayment(payment: string) {
		switch (payment) {
			case "FREE":
				return 0
			case "PRO":
				return 10
			case "PRO_PLUS":
				return 20
			default:
				return 0
		}
	}

	onRegisterBtnClick() {
		this.totalAmount = this.determinePayment(this.registerForm.value.type)

		if (this.totalAmount === 0) {
			this.registerUser()
		} else {
			this.isPaymentDialogVisible = true
		}
	}

	registerUser() {
		this.userService.registerUser(this.registerForm.value).subscribe(
			(response: User) => {
				this.message.add({
					severity: "success",
					summary: "Registration Successful",
					detail: `You have successfully registered for a Tasky account. Please login to continue`,
				})
				this.router.navigate(["/login"])
			},
			(error: HttpErrorResponse) => {
				console.log("Registration Error")
				this.message.add({
					severity: "error",
					summary: "Login Failed",
					detail: error.error,
				})
			},
		)
	}
}
