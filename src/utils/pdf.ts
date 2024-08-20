import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getTextPlacement } from "./getTextPlacement";

export async function pdf(
	qrCodeImageBytes: Buffer,
	providerName: string,
) {
	try {
		const response = await fetch("Poster.pdf");
		const existingPdfBytes = await response.arrayBuffer();

		const pdfDoc = await PDFDocument.load(existingPdfBytes);
		const page = pdfDoc.getPages()[0]; 
		const pageHeight = page.getHeight();
		const pageWidth = page.getWidth();

		const qrImage = await pdfDoc.embedPng(qrCodeImageBytes);
		const qrBoxWidth = 140;
		const qrBoxHeight = 140;
		const scaleX = qrBoxWidth / qrImage.width;
		const scaleY = qrBoxHeight / qrImage.height;
		const scale = Math.min(scaleX, scaleY);

		const qrX = 0.53 * (pageWidth - qrBoxWidth);
		const qrY = 0.69 * (pageHeight - qrBoxHeight);

		const imageWidth = qrImage.width * scale;
		const imageHeight = qrImage.height * scale;

		page.drawImage(qrImage, {
			x: qrX + 0.5 * (qrBoxWidth - imageWidth),
			y: qrY + 0.5 * (qrBoxHeight - imageHeight),
			width: imageWidth,
			height: imageHeight,
		});

		const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

		providerName = providerName.replace(/(\w)(\w*)/g, function (_g0, g1, g2) {
			return g1.toUpperCase() + g2.toLowerCase();
		});

		const textWithPositions = getTextPlacement(
			providerName,
			720,
			pageWidth,
			helveticaFont
		);
		textWithPositions.forEach(({ text, x, y, size, lineHeight }) => {
			page.drawText(text, {
				x,
				y,
				size,
				font: helveticaFont,
				color: rgb(0.35, 0.35, 0.35),
				lineHeight,
			});
		});

		const modifiedPdfBytes = await pdfDoc.save();

		console.log("PDF modification completed successfully.");
		return modifiedPdfBytes;
	} catch (error) {
		console.error("Error:", error);
	}
}

