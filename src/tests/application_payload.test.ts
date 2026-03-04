import { ApplicationSchema } from "../schemas/application";
import { z } from "zod";

// Helper function to run and log tests
const runTest = (name: string, data: unknown, expectSuccess: boolean) => {
	console.log(`\n🧪 Testing: ${name}`);
	const result = ApplicationSchema.safeParse(data);

	if (result.success === expectSuccess) {
		console.log(
			`✅ PASS: ${expectSuccess ? "Payload Validated" : "Caught Invalid Data"}`,
		);
	} else {
		console.error(
			`❌ FAIL: Expected ${expectSuccess}, got ${result.success}`,
		);
		if (!result.success) {
			// Log the specific Zod errors for debugging
			const formattedErrors = result.error.format();
			console.error(
				"   Zod Errors:",
				JSON.stringify(formattedErrors, null, 2),
			);
		}
	}
};

// --- Base Valid Payload (Happy Path) ---
const baseValidPayload = {
	personalinformation_firstname: "Jane",
	personalinformation_lastname: "Doe",
	personalinformation_ssn: "000-12-3456",
	personalinformation_dateofbirth: { mm: "05", dd: "20", yy: "1985" },
	personalinformation_phone: "5551234567",
	personalinformation_email: "jane.doe@example.com",

	residence_addressline1: "123 Maple Ave",
	residence_city: "Springfield",
	residence_state: "IL",
	residence_zipcode: "62704",
	residence_housingstatus: "Own",
	residence_monthlypaymentyourportion: 1200,
	residence_timeatcurrentaddress: { year: 5, month: 0 },

	// Optional fields populated
	employment_employmentstatus: "Employed",
	employment_companyname: "Acme Corp",
	workaddress_addressline1: "456 Tech Blvd",
	workaddress_city: "Metropolis",
	workaddress_state: "NY",
	workaddress_zipcode: "10001",
	workaddress_occupationjobtitle: "Engineer",
	workaddress_totalmonthlyincomeorannually: 8000,

	finaldetails_allowpartnerdealershipstoaccessmycreditreport: true,
	finaldetails_estimatedcreditscore: 720,
	finaldetails_planneddownpayment: 2000,
	finaldetails_iauthorizethedealershiptorunmycreditreport: true,
	finaldetails_iagreetotheprivacypolicy: true,
	finaldetails_digitalsignature: "data:image/png;base64,signature_data...",

	selected_vehicle: { id: "123", make: "Ford", model: "F-150" },
	loan_calculator_data: {
		vehicle_selling_price: 30000,
		down_payment: 2000,
		interest_rate: 6.5,
		loan_term: 72,
		trade_in_offer: 5000,
		amount_owed_on_trade_in: 0,
		target_monthly_budget: 400,
		filter_mode: "budget",
	},
};

// --- EXECUTE TESTS ---

// 1. Happy Path
runTest("Full Valid Payload", baseValidPayload, true);

// 2. String vs Number Flexibility
// The schema allows string OR number for these fields
const stringNumberPayload = {
	...baseValidPayload,
	residence_monthlypaymentyourportion: "1200", // String
	finaldetails_estimatedcreditscore: "720", // String
	finaldetails_planneddownpayment: "2000", // String
};
runTest("String/Number Type Flexibility", stringNumberPayload, true);

// 3. Minimal Payload (Optional fields omitted or empty)
const minimalPayload = {
	...baseValidPayload,
	residence_addressline2: undefined,
	employment_companyname: "", // Empty string allowed
	workaddress_addressline1: undefined, // Optional field omitted
	previousresidence_addressline1: undefined,
	residence_monthlypaymentyourportion: "", // Empty string allowed
};
runTest("Minimal Payload (Optional fields omitted)", minimalPayload, true);

// 4. Invalid Email
const invalidEmailPayload = {
	...baseValidPayload,
	personalinformation_email: "not-an-email",
};
runTest("Invalid Email Format", invalidEmailPayload, false);

// 5. Missing Required Field (SSN)
const missingFieldPayload = { ...baseValidPayload };
// @ts-ignore
delete missingFieldPayload.personalinformation_ssn;
runTest("Missing Required Field (SSN)", missingFieldPayload, false);

// 6. Consent Declined (Must be true)
const noConsentPayload = {
	...baseValidPayload,
	finaldetails_iauthorizethedealershiptorunmycreditreport: false,
};
runTest("Consent Declined (Should Fail)", noConsentPayload, false);
