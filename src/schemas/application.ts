import { z } from "zod";

const StringOrNumber = z.union([z.string(), z.number()]);
const OptionalStringOrNumber = StringOrNumber.optional().or(z.literal(""));

const TimeDuration = z.object({
	year: StringOrNumber,
	month: StringOrNumber,
});

export const ApplicationSchema = z
	.object({
		// --- Personal Information ---
		personalinformation_firstname: z
			.string()
			.min(1, "First name is required"),
		personalinformation_lastname: z
			.string()
			.min(1, "Last name is required"),
		personalinformation_ssn: z
			.string()
			.min(1, "SSN is required")
			.regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format XXX-XX-XXXX"),
		personalinformation_dateofbirth: z.object({
			mm: z.string(),
			dd: z.string(),
			yy: z.string(),
		}),
		personalinformation_phone: z
			.string()
			.min(1, "Phone number is required")
			.regex(
				/^\(\d{3}\) \d{3}-\d{4}$/,
				"Phone number must be in format (XXX) XXX-XXXX",
			),
		personalinformation_email: z.string().email("Invalid email address"),

		// --- Residence ---
		residence_addressline1: z.string().min(1, "Address is required"),
		residence_addressline2: z.string().optional().or(z.literal("")),
		residence_city: z.string().min(1, "City is required"),
		residence_state: z.string().min(1, "State is required"),
		residence_zipcode: z.string().min(5, "Zip code is invalid"),
		residence_housingstatus: z
			.string()
			.min(1, "Housing status is required"),
		residence_monthlypaymentyourportion: OptionalStringOrNumber,
		residence_timeatcurrentaddress: TimeDuration,

		// --- Previous Residence (Conditional) ---
		previousresidence_addressline1: z.string().optional().or(z.literal("")),
		previousresidence_addressline2: z.string().optional().or(z.literal("")),
		previousresidence_city: z.string().optional().or(z.literal("")),
		previousresidence_state: z.string().optional().or(z.literal("")),
		previousresidence_zipcode: z.string().optional().or(z.literal("")),
		previousresidence_timeatpreviousaddress: TimeDuration.optional(),

		// --- Employment ---
		employment_employmentstatus: z
			.string()
			.min(1, "Employment status is required"),
		employment_companyname: z.string().optional().or(z.literal("")),

		// --- Work Address (Conditional) ---
		workaddress_addressline1: z.string().optional().or(z.literal("")),
		workaddress_addressline2: z.string().optional().or(z.literal("")),
		workaddress_city: z.string().optional().or(z.literal("")),
		workaddress_state: z.string().optional().or(z.literal("")),
		workaddress_zipcode: z.string().optional().or(z.literal("")),
		workaddress_occupationjobtitle: z.string().optional().or(z.literal("")),
		workaddress_workphone: z.string().optional().or(z.literal("")),
		workaddress_timeofcurrentemployment: TimeDuration.optional(),
		workaddress_totalmonthlyincomeorannually: OptionalStringOrNumber,

		// --- Previous Work Address (Conditional) ---
		previousworkaddress_companyname: z
			.string()
			.optional()
			.or(z.literal("")),
		previousworkaddress_addressline1: z
			.string()
			.optional()
			.or(z.literal("")),
		previousworkaddress_addressline2: z
			.string()
			.optional()
			.or(z.literal("")),
		previousworkaddress_city: z.string().optional().or(z.literal("")),
		previousworkaddress_state: z.string().optional().or(z.literal("")),
		previousworkaddress_zipcode: z.string().optional().or(z.literal("")),
		previousworkaddress_occupationjobtitle: z
			.string()
			.optional()
			.or(z.literal("")),
		previousworkaddress_timeatpreviousemployment: TimeDuration.optional(),

		// --- Final Details ---
		finaldetails_allowpartnerdealershipstoaccessmycreditreport: z.boolean(),
		finaldetails_estimatedcreditscore: StringOrNumber,
		finaldetails_planneddownpayment: StringOrNumber,

		finaldetails_iauthorizethedealershiptorunmycreditreport: z.literal(
			true,
			{
				errorMap: () => ({
					message: "You must authorize the credit report",
				}),
			},
		),
		finaldetails_iagreetotheprivacypolicy: z.literal(true, {
			errorMap: () => ({
				message: "You must agree to the privacy policy",
			}),
		}),
		finaldetails_iagreetoreceivemarketingemails: z.boolean().optional(),
		finaldetails_digitalsignature: z
			.string()
			.min(1, "Digital signature is required"),

		// --- Context Data ---
		selected_vehicle: z.any(),
		loan_calculator_data: z.object({
			vehicle_selling_price: z.number(),
			down_payment: z.number(),
			interest_rate: z.number(),
			loan_term: z.number(),
			trade_in_offer: z.number(),
			amount_owed_on_trade_in: z.number(),
			target_monthly_budget: z.number().nullable(),
			filter_mode: z.enum(["price", "budget"]),
		}),
	})
	.passthrough();

export const DealershipInquirySchema = z
	.object({
		// --- First Section ---
		dealership_name: z
			.string()
			.min(1, "Dealership name is required")
			.max(100, "Max length is 100"),
		is_franchise: z.enum(["Yes", "No"], {
			errorMap: () => ({
				message: "Please select if you are a franchise dealership",
			}),
		}),
		gm_firstname: z
			.string()
			.min(1, "General Manager first name is required")
			.max(50, "Max length is 50"),
		gm_lastname: z
			.string()
			.min(1, "General Manager last name is required")
			.max(50, "Max length is 50"),

		// --- Second Section: Address ---
		address_line1: z
			.string()
			.min(1, "Address Line 1 is required")
			.max(100, "Max length is 100"),
		address_line2: z
			.string()
			.max(100, "Max length is 100")
			.optional()
			.or(z.literal("")),
		city: z.string().min(1, "City is required").max(50, "Max length is 50"),
		state: z
			.string()
			.min(2, "State is required")
			.max(50, "Max length is 50"),
		zip_code: z
			.string()
			.min(5, "Zip code is required")
			.max(50, "Max length is 50"),

		// --- Third Section: Contact ---
		phone: z
			.string()
			.min(1, "Phone number is required")
			.max(50, "Max length is 50"),
		email: z
			.string()
			.email("Invalid email address")
			.max(50, "Max length is 50"),
		best_time_to_contact: z.enum(["Morning", "Afternoon", "Evening"], {
			errorMap: () => ({
				message: "Select Morning, Afternoon, or Evening",
			}),
		}),
		sub_prime_department: z.enum(["Yes", "No", "Not sure"], {
			errorMap: () => ({ message: "Select Yes, No, or Not sure" }),
		}),
		website: z
			.string()
			.min(1, "Website is required")
			.max(100, "Max length is 100"),
		note: z
			.string()
			.max(500, "Max length is 500")
			.optional()
			.or(z.literal("")),
	})
	.passthrough();
