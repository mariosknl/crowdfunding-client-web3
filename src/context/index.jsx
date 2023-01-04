import React, { useContext, createContext } from "react";

import {
	useAddress,
	useContract,
	useMetamask,
	useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
	const { contract } = useContract(
		"0xEEecBaED069d22783d71A6E8e0CD1E80e81198fd"
	);
	const { mutateAsync: createCampaign } = useContractWrite(
		contract,
		"createCampaign"
	);

	const address = useAddress();
	const connect = useMetamask();

	const publishCampaign = async (form) => {
		try {
			const data = await createCampaign([
				address, // owner
				form.title, // title
				form.description, // description
				form.target, // target
				new Date(form.deadline).getTime(), // deadline
				form.image,
			]);

			console.log("contract call success", data);
		} catch (error) {
			console.log("contract call failure", error);
		}
	};

	const getCampaigns = async () => {
		try {
			const campaigns = await contract.call("getCampaigns");

			const parsedCampaigns = campaigns.map((campaign, i) => ({
				owner: campaign.owner,
				title: campaign.title,
				description: campaign.description,
				target: ethers.utils.formatEther(campaign.target.toString()),
				deadline: campaign.deadline.toNumber(),
				amountCollected: ethers.utils.formatEther(
					campaign.amountCollected.toString()
				),
				image: campaign.image,
				pId: i,
			}));
			return parsedCampaigns;
		} catch (error) {
			console.log("error", error);
		}
	};

	const getUserCampaigns = async () => {
		const allCampaigns = await getCampaigns();

		const filteredCampaigns = allCampaigns.filter(
			(campaign) => campaign.owner === address
		);

		return filteredCampaigns;
	};

	return (
		<StateContext.Provider
			value={{
				address,
				connect,
				contract,
				createCampaign: publishCampaign,
				getCampaigns,
				getUserCampaigns,
			}}
		>
			{children}
		</StateContext.Provider>
	);
};

export const useStateContext = () => useContext(StateContext);
