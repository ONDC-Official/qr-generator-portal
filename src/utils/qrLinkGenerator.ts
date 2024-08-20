// eslint-disable-next-line @typescript-eslint/no-explicit-any
// import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

// const client = new S3Client({});

type JsonObject = Record<string, any>;

export function transformJSON(
	inputJSON: string,
	additionalValues: JsonObject = {"context.action": "search"}
): string | null {
	try {
		// console.log(inputJSON)
		// Parse the input JSON string
		const inputObj: JsonObject = JSON.parse(inputJSON);

		const mergedObj = finaldata(inputObj)
		const qrObj = {
			...mergedObj,
			...additionalValues,
		};

		// Convert the merged object to a query string
		const queryString = Object.entries(qrObj)
			.map(([key, value]) => `${key}=${value}`)
			.join("&");

		// Construct the final beckn URL
		const becknURL = `beckn://ondc?${queryString}`;
		return becknURL;
	} catch (error) {
		console.error("Error parsing JSON:", (error as Error).message);
		return null;
	}
}

// Helper function to flatten nested objects
function flattenObject(obj: JsonObject, parentKey = ""): JsonObject {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		const newKey = parentKey ? `${parentKey}.${key}` : key;

		if (typeof value === "object" && value !== null) {
			return { ...acc, ...flattenObject(value, newKey) };
		} else {
			return { ...acc, [newKey]: value };
		}
	}, {});
}

export function finaldata(inputObj: JsonObject, additionalValues: JsonObject = {}): JsonObject {
	let mergedObj: JsonObject = {};

	if (!inputObj.context) {
		mergedObj = inputObj
	}
	else {
		// Flatten the nested objects inside context and message
	const flattenedContext = flattenObject(inputObj.context, "context");
	const flattenedMessage = flattenObject(
		inputObj.message.intent,
		"message.intent"
	);
	// Merge the flattened objects and additional values
	mergedObj = {
		...flattenedContext,
		...flattenedMessage,
		...additionalValues,
	};
	}
	
	return mergedObj
}

// export async function getdata(bucket: string, key: string): Promise<any> {
// 	const command = new GetObjectCommand({
// 		Bucket: bucket,
// 		Key: key,
// 	  });

// 	try {
// 		const response = await client.send(command);
// 		// The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
// 		const str = await response.Body.transformToString();
// 		console.log(str);
// 		return str
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

// const data = getdata("ondc-athena-results", "outputs/Unsaved/2024/04/16/7ed9c9dd-71ed-4382-bc66-2e7d803fa469.csv")

// console.log(data)

//s3://ondc-athena-results/outputs/Unsaved/2024/04/16/7ed9c9dd-71ed-4382-bc66-2e7d803fa469.csv
// // Example usage:
// const inputJSON =
// 	'{"context":{"bpp_id":"sellerapp.com","domain":"ONDC:RET10","action":"search"},"message":{"intent":{"provider":{"id":"P1"}}}}';
// const additionalValues = {
// 	"message.intent.provider.locations.0.id": "L1",
// 	"message.intent.category.id": "Foodgrains",
// };
// const result = transformJSON(inputJSON, additionalValues);
// console.log(result);
