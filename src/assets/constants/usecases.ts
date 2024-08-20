export const USECASES = [
	{
		name: "Store QR Code",
		placeholders: [
			{
				name: "context.bpp_id",
				placeholder: "seller app url",
				type: "text",
			},
			{
				name: "context.domain",
				type: "select",
				placeholder: "ONDC Domain",
				options: [
					"ONDC:RET10=Grocery",
					"ONDC:RET11=F&B",
					"ONDC:RET12=Fashion",
					"ONDC:RET13=BPC",
					"ONDC:RET14=Electronics",
					"ONDC:RET15=Appliances",
					"ONDC:RET16=Home & Decor",
					"ONDC:RET17=Toys & Games",
				],
			},
			{
				name: "message.intent.provider.id",
				placeholder: "Seller id (Get this from Seller App)",
				type: "text",
			},
			{
				name: "message.intent.provider.locations.0.id",
				placeholder: "Seller's Location id (Get this from Seller App)",
				type: "text",
			},
		],
	},
	// {
	//   name: "Category Specific QR Code",
	//   initialValue: {
	//     context: {
	//       bpp_id: "sellerapp.com",
	//       domain: "ONDC:RET10",
	//       action: "search"
	//     },
	//     message: {
	//       intent: {
	//         category: {
	//           id: "Foodgrains"
	//         },
	//         provider: {
	//           id: "P1",
	//           locations: [
	//             {
	//               id: "L1"
	//             }
	//           ]
	//         }
	//       }
	//     }
	//   },
	//   placeholders: {
	//     "context.bpp_id": "subscriber_id",
	//     "context.domain": "ONDC Domain",
	//     "message.intent.category.id": "category",
	//     "message.intent.provider.id": "Provider id (Get this from Seller App)",
	//     "message.intent.provider.locations.0.id": "Provider's Location id"
	//   }
	// },
	// {
	//   name: "Keyword Specific QR Code",
	//   initialValue: {
	//     context: {
	//       bpp_id: "sellerapp.com",
	//       domain: "ONDC:RET10",
	//       action: "search"
	//     },
	//     message: {
	//       intent: {
	//         item: {
	//           descriptor: {
	//             name: "coffee"
	//           }
	//         },
	//         provider: {
	//           id: "P1",
	//           locations: [
	//             {
	//               id: "L1"
	//             }
	//           ]
	//         }
	//       }
	//     }
	//   }
	// },
	// {
	//   name: "Item Specific QR Code",
	//   initialValue: {
	//     context: {
	//       bpp_id: "sellerapp.com",
	//       domain: "ONDC:RET10",
	//       action: "search"
	//     },
	//     message: {
	//       intent: {
	//         item: {
	//           id: "I1"
	//         },
	//         provider: {
	//           id: "P1",
	//           locations: [
	//             {
	//               id: "L1"
	//             }
	//           ]
	//         }
	//       }
	//     }
	//   }
	// },
	// {
	//   name: "Metro Ticket Buying using QR Code",
	//   initialValue: {
	//     context: {
	//       bpp_id: "mobilitysellerapp.com",
	//       domain: "ONDC:TRV11",
	//       action: "search"
	//     },
	//     message: {
	//       intent: {
	//         fulfillments: {
	//           vehicle: {
	//             category: "METRO"
	//           }
	//         }
	//       }
	//     }
	//   }
	// }
];