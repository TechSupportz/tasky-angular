import { HttpErrorResponse } from "@angular/common/http"
import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { ICreateOrderRequest, IPayPalConfig } from "ngx-paypal"
import { ConfirmationService, MessageService } from "primeng/api"
import { User } from "src/app/models/user"
import { UserService } from "src/app/services/user.service"

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
	profileForm: FormGroup
	passwordForm: FormGroup
	accountTypes: Array<any>
	isPaymentDialogVisible: boolean = false
	totalAmount: number
	payPalConfig: IPayPalConfig
	currentUser: User

	constructor(
		private userService: UserService,
		private router: Router,
		private fb: FormBuilder,
		private message: MessageService,
		private confirmationService: ConfirmationService,
	) {
		this.accountTypes = [
			{ name: "Free", code: "FREE" },
			{ name: "Pro", code: "PRO" },
			{ name: "Pro Plus", code: "PRO_PLUS" },
		]
	}

	ngOnInit(): void {
		this.userService.getCurrentUser().subscribe((user: User) => {
			this.currentUser = user
		})

		this.profileForm = this.fb.group({
			email: [this.currentUser.email, Validators.required],
			username: [this.currentUser.username, Validators.required],
			type: [this.currentUser.type, Validators.required],
		})

		this.passwordForm = this.fb.group({
			oldPassword: ["", Validators.required],
			newPassword: ["", Validators.required],
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
									name: `Tasky ${this.profileForm.value.type} account`,
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
					detail: `You have successfully paid for a Tasky ${this.profileForm.value.type} account`,
				})
				this.updateUser()
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

	updateUser() {
		this.userService
			.updateUser(this.profileForm.value)
			.subscribe((response: User) => {
				this.userService.setCurrentUser(response)
				this.currentUser = response
				this.message.add({
					severity: "success",
					summary: "Profile Updated",
					detail: "Your profile has been updated",
				})
				this.router.navigate(["/home"]).then(() => {
					window.location.reload()
				})
			})
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

	onProfileBtnClick() {
		const currentAmount = this.determinePayment(this.currentUser.type)
		this.totalAmount = this.determinePayment(this.profileForm.value.type)

		if (
			this.profileForm.value.email === "" ||
			this.profileForm.value.username === ""
		) {
			this.message.add({
				severity: "info",
				summary: "Did you forget something?",
				detail: "Ensure all fields are filled",
			})
			return
		}

		if (
			this.currentUser.email !== this.profileForm.value.email ||
			this.currentUser.username !== this.profileForm.value.username || currentAmount !== this.totalAmount
		) {
			if (this.totalAmount === 0 && currentAmount === 0) {
				this.updateUser()
			} else if (currentAmount === this.totalAmount) {
				this.updateUser()
			} else if (currentAmount > this.totalAmount) {
				this.message.add({
					severity: "error",
					summary: "Account Update Failed",
					detail: "You cannot downgrade your account",
				})
			} else {
				this.isPaymentDialogVisible = true
			}
		} else {
			this.message.add({
				severity: "info",
				summary: "I see no difference",
				detail: "You have not made any changes to your profile. Hence, no update is required",
			})
		}
	}

	onPasswordBtnClick() {
		console.table({
			old: this.passwordForm.value.oldPassword,
			new: this.passwordForm.value.newPassword,
		})

		if (
			this.passwordForm.value.oldPassword === "" ||
			this.passwordForm.value.newPassword === ""
		) {
			this.message.add({
				severity: "info",
				summary: "Did you forget something?",
				detail: "Ensure all fields are filled",
			})
			return
		}

		if (
			this.passwordForm.value.oldPassword ===
			this.passwordForm.value.newPassword
		) {
			this.message.add({
				severity: "error",
				summary: "Password Change Failed",
				detail: "The new password must be different from the old password",
			})
		} else {
			this.userService
				.updatePassword(
					this.passwordForm.value.oldPassword,
					this.passwordForm.value.newPassword,
				)
				.subscribe(
					(response) => {
						this.message.add({
							severity: "success",
							summary: "Password Change Successful",
							detail: `Your new password is ${response.newPassword}. Please login again with your new password`,
						})
						this.passwordForm.reset()
						this.router.navigate(["/"]) // replace this with a logout function
					},
					(error: HttpErrorResponse) => {
						console.log(error.error)
						this.message.add({
							severity: "error",
							summary: "Password Change Failed",
							detail: error.error,
						})
					},
				)
		}
	}

	logout() {
		this.confirmationService.confirm({
			header: "Logout Confirmation",
			message: "Are you sure you want to logout?",
			accept: () => {
				this.userService.logout()
			},
		})
	}

	deleteAccount() {
		this.confirmationService.confirm({
			header: "Delete Account Confirmation",
			message:
				"Are you sure you want to delete your account? THIS IS IRREVERSIBLE",
			accept: () => {
				this.userService.deleteAccount().subscribe(
					(response) => {
						this.message.add({
							severity: "success",
							summary: "Account Deletion Successful",
							detail: "Your account has been deleted",
						})
						this.userService.logout()
					},
					(error: HttpErrorResponse) => {
						console.log(error.error)
						this.message.add({
							severity: "error",
							summary: "Account Deletion Failed",
							detail: error.error,
						})
					},
				)
			},
		})
	}
}
