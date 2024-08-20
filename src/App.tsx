import React, { useState, useEffect, useMemo } from "react";
import { Layout } from "./Layout";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { QrDialog } from "./components";
import { parseCSV, ProviderData } from "./utils/data"; // Assuming you have exported the function to parse CSV and generate data
import Stack from "@mui/material/Stack";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import { DOMAIN_MAPPING, POPOVER_MESSAGES } from "./assets/constants";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";

function App() {
	const [theme] = useState<"light" | "dark">("light");
	const [showQrDialog, setShowQrDialog] = useState(false);
	const [selectedProviderName, setSelectedProviderName] = useState<string>("");
	const [selectedBppId, setSelectedBppId] = useState<string>("");
	const [uniqueProviderNames, setUniqueProviderNames] = useState<string[]>([]);
	const [selectedDomain, setSelectedDomain] = useState<string>("");
	const [data, setData] = useState<ProviderData[]>([]);
	const [selectedStreet, setSelectedStreet] = useState<string>("");
	const [showOptions, setShowOptions] = useState(false);

	const [popoverAnchor, setPopoverAnchor] = useState<{
		anchor: HTMLElement | null;
		message: string;
	}>();

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setPopoverAnchor({
			anchor: event.currentTarget,
			message:
				POPOVER_MESSAGES[
					event.currentTarget.id as keyof typeof POPOVER_MESSAGES
				].message,
		});
	};
	const handlePopoverClose = () => {
		setPopoverAnchor({ anchor: null, message: "" });
	};

	useEffect(() => {
		if (selectedProviderName.length > 3)
			parseCSV()
				.then((parsedData) => {
					setData(parsedData);
					const uniqueNames = [
						...new Set(
							parsedData
								.filter((item) =>
									item.provider_name
										.toLowerCase()
										.includes(selectedProviderName.toLowerCase())
								)
								.map((item) => item.provider_name)
						),
					];
					setUniqueProviderNames(uniqueNames.slice(0, 11));
				})
				.catch((error) => {
					console.error("Error parsing CSV:", error);
				});
	}, [selectedProviderName]);

	const bppIdOptions = [
		...new Set(
			data
				.filter((item) => item.provider_name === selectedProviderName)
				.map((item) => item.bpp_id)
		),
	];

	const streetOptions = [
		...new Set(
			data
				.filter(
					(item) =>
						item.provider_name === selectedProviderName &&
						item.bpp_id === selectedBppId
				)
				.map((item) => item.street)
				.sort()
		),
	];

	const domainOptions = [
		...new Set(
			data
				.filter(
					(item) =>
						item.provider_name === selectedProviderName &&
						item.bpp_id === selectedBppId
				)
				.map((item) => item.domain)
		),
	];
	const providerId = useMemo(() => {
		const selectedData = data.find(
			(item) =>
				item.provider_name === selectedProviderName &&
				item.bpp_id === selectedBppId &&
				item.domain === selectedDomain &&
				item.street.toLowerCase().includes(selectedStreet.trim().toLowerCase())
		);
		console.log("SELECTED PROVIDER ID", selectedData?.provider_id ?? "a")
		return selectedData?.provider_id ?? "";
	}, [selectedProviderName, selectedStreet, selectedBppId, selectedDomain]);

	useEffect(() => {
		if (bppIdOptions.length == 1) {
			setSelectedBppId(bppIdOptions[0]);
		}
		if (domainOptions.length == 1) {
			setSelectedDomain(domainOptions[0]);
		}
		if (streetOptions.length == 1) {
			setSelectedStreet(streetOptions[0]);
		}
	}, [bppIdOptions, domainOptions, streetOptions]);

	const handleGenerateQR = () => {
		setShowQrDialog(true);
	};

	return (
		<Layout theme={theme}>
			<Container
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					flexDirection: "column",
					py: 2,
				}}
			>
				<img src={"./ondc_logo.png"} alt="logo" />
				<Typography variant="h4">
					<i>QR Code Generator</i>
				</Typography>
				<Paper
					sx={{
						p: 2,
						maxWidth: 350,
						width: "100%",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Stack direction="row" spacing={1} alignItems="center" my={1}>
						<Autocomplete
							freeSolo
							value={selectedProviderName}
							onChange={(_event, newValue, reason) => {
								setSelectedProviderName(newValue || "");
								if (reason === "selectOption") setShowOptions(true);
							}}
							inputValue={selectedProviderName}
							onInputChange={(_event, newInputValue) =>
								setSelectedProviderName(newInputValue)
							}
							options={uniqueProviderNames}
							renderInput={(params) => (
								<TextField {...params} label="Type your Store Name" />
							)}
							fullWidth
						/>
						<IconButton
							onMouseOver={handlePopoverOpen}
							onMouseLeave={handlePopoverClose}
							id={POPOVER_MESSAGES.providerName.id}
						>
							<InfoTwoToneIcon />
						</IconButton>
					</Stack>
					{showOptions && ( // Conditionally render bpp_id and domain dropdowns
						<>
							<Stack direction="row" spacing={1} my={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									<InputLabel id="bpp-id-select-label">
										Seller Network Participant
									</InputLabel>
									<Select
										labelId="bpp-id-select-label"
										id="bpp-id-select"
										value={selectedBppId}
										onChange={(event) =>
											setSelectedBppId(event.target.value as string)
										}
									>
										{bppIdOptions.map((bppId) => (
											<MenuItem key={bppId} value={bppId}>
												{bppId}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.bppId.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
							<Stack direction="row" spacing={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									<InputLabel variant="outlined" id="domain-select-label">
										Domain
									</InputLabel>
									<Select
										labelId="domain-select-label"
										id="domain-select"
										value={selectedDomain}
										onChange={(event) =>
											setSelectedDomain(event.target.value as string)
										}
									>
										{domainOptions.map((domain) => (
											<MenuItem key={domain} value={domain}>
												{DOMAIN_MAPPING[domain as keyof typeof DOMAIN_MAPPING]}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.domain.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
							<Stack direction="row" spacing={1} my={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									<InputLabel id="store-street">Store Address</InputLabel>
									<Select
										labelId="store-street"
										id="store-street-select"
										value={selectedStreet}
										onChange={(event) =>
											setSelectedStreet(event.target.value as string)
										}
									>
										{streetOptions.map((street) => (
											<MenuItem key={street} value={street}>
												{street}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.street.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
							<Stack direction="row" spacing={1} my={1}>
								<FormControl fullWidth sx={{ my: 2 }}>
									{/* <InputLabel variant="outlined" id="domain-select-label">
										Provider ID
									</InputLabel> */}
									<TextField label="Provider ID" value={providerId} disabled />
								</FormControl>
								<IconButton
									onMouseOver={handlePopoverOpen}
									onMouseLeave={handlePopoverClose}
									id={POPOVER_MESSAGES.providerId.id}
								>
									<InfoTwoToneIcon />
								</IconButton>
							</Stack>
						</>
					)}
					<Button
						variant="contained"
						fullWidth
						disabled={
							!(
								showOptions &&
								selectedBppId.length > 0 &&
								selectedDomain.length > 0 &&
								selectedProviderName.length > 0 &&
								selectedStreet.length > 0
							)
						}
						sx={{ mt: 2 }}
						onClick={handleGenerateQR}
					>
						Generate QR
					</Button>
					<Typography variant="caption" mt={2}>
						<b>Note</b>: In case of doubt please reach out to your seller
						network particpant.
					</Typography>
				</Paper>
				<QrDialog
					onClose={() => setShowQrDialog(false)}
					open={showQrDialog}
					qrData={JSON.stringify({
						"context.bpp_id": selectedBppId,
						"context.domain": selectedDomain,
						"message.intent.provider.id": providerId,
						// "message.provider.street": selectedStreet,
						// "message.provider.locality": selectedLocality,
					})}
					providerName={selectedProviderName}
				/>
				<Popover
					sx={{
						pointerEvents: "none",
					}}
					open={Boolean(popoverAnchor?.anchor)}
					anchorEl={popoverAnchor?.anchor}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "left",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "left",
					}}
					onClose={handlePopoverClose}
					disableRestoreFocus
				>
					<Typography sx={{ p: 1 }}>{popoverAnchor?.message}</Typography>
				</Popover>
			</Container>
		</Layout>
	);
}

export default App;
