import Papa, { ParseResult } from "papaparse";
export type ProviderData = {
	bpp_id: string;
	provider_id: string;
	domain: string;
	provider_name: string;
	street: string;
};

export const parseCSV = async () => {
	const csvFilePath = "s3data1.csv"; // Assuming the CSV file is in the "assets" directory

	try {
		const response = await fetch(csvFilePath);
		if (!response.ok) {
			throw new Error(`Failed to fetch CSV file: ${response.statusText}`);
		}

		const fileContent = await response.text();
		// console.log("fileContent:: ", fileContent)

		const { data: result, errors }: ParseResult<ProviderData> = Papa.parse(
			fileContent,
			{
				header: true, // Assuming the first row contains headers
				skipEmptyLines: true,
			}
		);

		// console.log("TOTAL LENGTH ::::", result.length);
		// console.log(
		// 	"FILTERED",
		// 	result.filter(
		// 		(e) =>
		// 			e.bpp_id === "webapi.magicpin.in/oms_partner/ondc" &&
		// 			e.domain.startsWith("ONDC:RET")
		// 	)
		// );

		if (errors.length > 0) {
			throw new Error(`CSV parsing errors: ${errors.join(", ")}`);
		}

		// const filteredResult: ProviderData[] = result.filter(
		// 	(item: ProviderData) => {
		// 		return item.domain.startsWith("ONDC:RET");
		// 	}
		// );

		// console.log("FILTERED LENGTH :::", filteredResult.length)
		// console.log("STREET EMPTY", filteredResult.filter(e => e.street.length === 0).length)
		// console.log("LOCALITY EMPTY", filteredResult.filter(e => e.locality.length === 0).length)
		return result as ProviderData[];
	} catch (error) {
		console.error("Error fetching/parsing CSV:", error);
		throw error;
	}
};
