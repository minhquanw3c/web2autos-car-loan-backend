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
		personalinformation_ssn: z.string().min(1, "SSN is required"),
		personalinformation_dateofbirth: z.object({
			mm: z.string(),
			dd: z.string(),
			yy: z.string(),
		}),
		personalinformation_phone: z
			.string()
			.min(10, "Phone number is too short"),
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
