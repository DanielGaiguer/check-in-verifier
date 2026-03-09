export interface SearchParamsProps {
  range?: 'today' | 'week' | 'month'
  from?: string
  to?: string
}

export function switchWheteClause(searchParams: SearchParamsProps){
	if (searchParams.range === 'today') {
		return ('hoje')
	}
	
	if (searchParams.range === 'week') {
		return ('semana')
	}

	if (searchParams.range === 'month') {
		return ('mes')
	}
}