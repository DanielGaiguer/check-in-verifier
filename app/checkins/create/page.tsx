import { getDataForCheckin } from "@/services/checkins/checkinsServices";
import CreateCheckinsClient from "./CreateCheckinsClient";

export default async function Page() {
  const data = await getDataForCheckin()

	return <CreateCheckinsClient data={data}/>
}