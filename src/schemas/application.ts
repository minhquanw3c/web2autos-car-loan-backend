import { z } from "zod";

export const ApplicationSchema = z
	.object({
		// Personal Information
		personalinformation_firstname: z
			.string()
			.min(1, "First name is required"),
		personalinformation_lastname: z
			.string()
			.min(1, "Last name is required"),
		personalinformation_ssn: z
			.string()
			.regex(/^\d{3}-?\d{2}-?\d{4}$/, "Invalid SSN format"),
		personalinformation_dateofbirth: z.object({
			mm: z.string(),
			dd: z.string(),
			yy: z.string(),
		}),
		personalinformation_phone: z
			.string()
			.min(10, "Phone number is too short"),
		personalinformation_email: z.string().email("Invalid email address"),

		// Residence
		residence_currentaddress: z
			.string()
			.min(1, "Current address is required"),
		residence_addressline1: z.string().optional(),
		residence_addressline2: z.string().optional().or(z.literal("")),
		residence_city: z.string().min(1, "City is required"),
		residence_state: z.string().min(2, "State is required"),
		residence_zipcode: z.string().min(5, "Zip code is invalid"),
		residence_housingstatus: z
			.string()
			.min(1, "Housing status is required"),
		residence_monthlypaymentyourportion: z
			.number()
			.nonnegative()
			.optional()
			.or(z.literal("")),
		residence_timeatcurrentaddress: z.object({
			year: z.number().nonnegative(),
			month: z.number().nonnegative(),
		}),

		// Employment
		employment_employmentstatus: z
			.string()
			.min(1, "Employment status is required"),
		employment_companyname: z.string().min(1, "Company name is required"),

		// Work Address
		workaddress_address: z.string().optional(),
		workaddress_companyname: z.string().optional(),
		workaddress_addressline1: z.string().optional(),
		workaddress_city: z.string().optional(),
		workaddress_state: z.string().optional(),
		workaddress_zipcode: z.string().optional(),
		workaddress_occupationjobtitle: z
			.string()
			.min(1, "Job title is required"),
		workaddress_workphone: z.string().optional().or(z.literal("")),
		workaddress_timeofcurrentemployment: z.object({
			year: z.number().nonnegative(),
			month: z.number().nonnegative(),
		}),
		workaddress_totalmonthlyincomeorannually: z
			.number()
			.positive("Income must be positive"),

		// Final Details
		finaldetails_oktoruncreditreportsbyourtoprateddealership: z
			.union([z.boolean(), z.literal("")])
			.optional(),
		finaldetails_howmuchofdownpayment: z.number().nonnegative(),

		finaldetails_iauthorizethisdealershiptorunmycreditreport: z.literal(
			true,
			{
				errorMap: () => ({
					message: "You must authorize the credit report",
				}),
			}
		),
		finaldetails_iagreetothecollectionandprocessingofmypersonaldata:
			z.literal(true, {
				errorMap: () => ({
					message: "You must agree to data processing",
				}),
			}),
		finaldetails_iagreetoreceivenewsletters: z
			.union([z.boolean(), z.literal("")])
			.optional(),
	})
	.passthrough();
