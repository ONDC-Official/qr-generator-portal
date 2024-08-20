import { PDFFont } from "pdf-lib";
import { DEFAULT_FONT_SIZE } from "../assets/constants";

function splitStringByMaxLength(input: string, maxLength: number): string[] {
	const words = input.split(" ");
	const result: string[] = [];

	let currentPart = "";
	for (const word of words) {
		if ((currentPart + " " + word).trim().length > maxLength) {
			result.push(currentPart.trim());
			currentPart = word;
		} else {
			if (!currentPart.endsWith(" ")) {
				currentPart += " ";
			}
			currentPart += word;
		}
	}

	if (currentPart.trim() !== "") {
		result.push(currentPart.trim());
	}

	return result;
}

export const getTextPlacement = (
	text: string,
	initialY: number,
	pageWidth: number,
	font: PDFFont
) => {
	let fontSize = DEFAULT_FONT_SIZE;
	const centerX = pageWidth / 2;

	const minX = pageWidth / 6;
	const maxX = (pageWidth * 5) / 6;

	const totalTextWidth = font.widthOfTextAtSize(text, fontSize);
	let lineHeight = font.heightAtSize(fontSize);

	if (totalTextWidth > maxX - minX) {
		let dividedText: string[] = [];
		dividedText = splitStringByMaxLength(
			text,
			Math.floor((maxX - minX) / (totalTextWidth / text.length))
		);
    console.log("FONT SIZE BEFORE", fontSize)
		fontSize = fontSize - Math.max(1 * (dividedText.length/2), 2);
    console.log("FONT SIZE AFTER", fontSize)
		lineHeight = font.heightAtSize(fontSize);
    initialY = dividedText.length > 2 ? initialY + lineHeight/2 : initialY;
    dividedText = dividedText.length > 3 ? [...dividedText.slice(0,3), dividedText[3] + "..."]: dividedText;
		return dividedText.map((text) => {
			const textWidth = Math.floor(font.widthOfTextAtSize(text, fontSize));

			const pos = {
				text,
				x: textWidth < maxX - minX ? centerX - (textWidth / 2) : minX,
				y: initialY,
				size: fontSize,
				lineHeight,
			};
			initialY = initialY - lineHeight;
			return pos;
		});
	} else {
    const textWidth = Math.floor(font.widthOfTextAtSize(text, fontSize));
		return [
			{
				text,
				x: textWidth < maxX - minX ? centerX - (textWidth / 2) : minX,
				y: initialY,
				size: fontSize,
				lineHeight,
			},
		];
	}
};
