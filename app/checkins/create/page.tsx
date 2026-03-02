import { getDataForCheckin, postDataForCheckin } from "@/services/checkins/checkinsServices";
import CreateCheckinsClient from "./CreateCheckinsClient";

export default async function Page() {
  const data = await getDataForCheckin()

	const postCheckinFunction = async (dataPostCheckin: Partial<CheckinSubmit>) => {
		const response = await postDataForCheckin(dataPostCheckin)
		return response;
	}

	return <CreateCheckinsClient data={data}/>
}