import { SearchParamsProps, switchWheteClause } from "@/services/switchWhereClause"

export async function GET(req: Request){
	const { searchParams } = new URL(req.url)

	const params: SearchParamsProps = {
		range: searchParams.get('range') as SearchParamsProps['range'] | undefined,
		from: searchParams.get('from') || undefined,
		to: searchParams.get('to') || undefined,
	}

	const whereClause = switchWheteClause(params)

	return new Response(JSON.stringify({ whereClause }), {
		status: 200,
		headers: { 'Contenty-Type': 'application/json'}
	})
	
}