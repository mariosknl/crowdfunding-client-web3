import React, { useState, useEffect } from "react";

import { useStateContext } from "../context";
import { DisplayCampaigns } from "../components";

const Profile = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [campaigns, setCampaigns] = useState([]);

	const { address, getUserCampaigns, contract } = useStateContext();

	const fetchCampaigns = async () => {
		setIsLoading(true);
		const data = await getUserCampaigns();
		setCampaigns(data);
		setIsLoading(false);
	};

	useEffect(() => {
		if (contract) fetchCampaigns();
	}, [address, contract]);

	return (
		<DisplayCampaigns
			isLoading={isLoading}
			campaigns={campaigns}
			title="All Campaigns"
		/>
	);
};

export default Profile;
