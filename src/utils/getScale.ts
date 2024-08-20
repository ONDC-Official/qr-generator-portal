export const getScale = (
	viewport: number,
	breakpoints: {
		xs: number;
		sm: number;
		md: number;
		lg: number;
		xl: number;
	}
) => {
	let qrScale = 0.165;

	if (viewport < 420) {
		qrScale = 0.094;
	} else if (viewport >= 420 && viewport < breakpoints.sm) {
		qrScale = 0.11;
	} else if (viewport >= breakpoints.sm && viewport < breakpoints.md) {
		qrScale = 0.165;
	} else if (viewport >= breakpoints.md && viewport < breakpoints.lg) {
		qrScale = 0.165;
	} else if (viewport >= breakpoints.lg && viewport < breakpoints.xl) {
		qrScale = 0.165;
	} else {
		qrScale = 0.165;
	}
  return qrScale
};
