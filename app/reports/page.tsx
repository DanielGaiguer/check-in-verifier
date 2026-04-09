'use client'

import { useState } from 'react'
import { format, subDays, subMonths } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

import { useCheckins } from '@/hooks/useQuerys/useCheckins'
import { usePeople } from '@/hooks/useQuerys/usePeoples'
import { usePlaces } from '@/hooks/useQuerys/usePlaces'
import { useProblems } from '@/hooks/useQuerys/useProblems'
import { Skeleton } from '@/components/ui/skeleton'
import ReportsSkeleton from '@/components/report-skeleton'

const PERIOD_OPTIONS = [
  { label: 'Últimos 7 dias', value: '7d' },
  { label: 'Último mês', value: '1m' },
  { label: 'Últimos 3 meses', value: '3m' },
  { label: 'Últimos 6 meses', value: '6m' },
  { label: 'Últimos 12 meses', value: '12m' },
]

const COLORS = ['hsl(142, 71%, 45%)', 'hsl(0, 72%, 51%)']

function getStartDate(period: string): Date {
  const now = new Date()
  switch (period) {
    case '7d':
      return subDays(now, 7)
    case '1m':
      return subMonths(now, 1)
    case '3m':
      return subMonths(now, 3)
    case '6m':
      return subMonths(now, 6)
    case '12m':
      return subMonths(now, 12)
    default:
      return subDays(now, 7)
  }
}

export default function ReportsPage() {
  const [period, setPeriod] = useState('1m')

  const { data: checkins = [], isLoading, error } = useCheckins(period)
  const {
    places = [],
    placeCount,
    isLoading: isLoadingPlaces,
    error: errorPlaces,
  } = usePlaces({ active: false })
  const {
    people = [],
    peopleCount,
    isLoading: isLoadingPeople,
    error: errorPeople,
  } = usePeople({ active: false })

  const {
    problems = [],
    isLoading: isLoadingProblems,
    error: errorProblems,
  } = useProblems({ active: false })

  const startDateObj = getStartDate(period)

  if (isLoading || isLoadingPlaces || isLoadingPeople || isLoadingProblems)
    return <ReportsSkeleton />
  if (error || errorPlaces || errorPeople || errorProblems)
    return <p>Erro ao carregar os dados.</p>

  // Filtra check-ins de acordo com o período
  const filteredCheckins = checkins.filter(
    (c) => new Date(c.date) >= startDateObj
  )

  let organizedCount = 0
  let disorganizedCount = 0

  filteredCheckins.forEach((checkin) => {
    const allOk = checkin.items.every((item) => item.status === 'organized')
    if (allOk) {
      organizedCount++
    } else {
      disorganizedCount++
    }
  })
  const totalCheckins = filteredCheckins.length

  const totalItems = filteredCheckins.reduce(
    (acc, c) => acc + c.items.length,
    0
  )

  const organizedItems = filteredCheckins.reduce(
    (acc, c) =>
      acc + c.items.filter((item) => item.status === 'organized').length,
    0
  )

  const disorganizedItems = totalItems - organizedItems

  const pieData = [
    { name: 'Organizados', value: organizedCount },
    { name: 'Desorganizados', value: disorganizedCount },
  ]

  const percentOrganized =
    (organizedCount / (organizedCount + disorganizedCount)) * 100

  const percentOrganizedCheckins =
    totalCheckins > 0 ? (organizedCount / totalCheckins) * 100 : 0

  const percentOrganizedItems =
    totalItems > 0 ? (organizedItems / totalItems) * 100 : 0

  const peopleCountMap: Record<string, number> = {}
  filteredCheckins.forEach((c) => {
    const name = c.people.name
    peopleCountMap[name] = (peopleCountMap[name] || 0) + 1
  })
  const topPeople = Object.entries(peopleCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // TOP PROBLEMS
  const problemCountMap: Record<string, number> = {}
  filteredCheckins.forEach((c) => {
    c.items.forEach((item) => {
      item.problems.forEach((p) => {
        problemCountMap[p.name] = (problemCountMap[p.name] || 0) + 1
      })
    })
  })
  const topProblems = Object.entries(problemCountMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // TOP PLACES
  const placeProblemMap: Record<string, number> = {}
  filteredCheckins.forEach((c) => {
    const placeName = c.items[0]?.place.name || c.placeCount.toString()
    placeProblemMap[placeName] =
      (placeProblemMap[placeName] || 0) + c.items.length
  })
  const topPlaces = Object.entries(placeProblemMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 rounded-t-xl bg-gray-50">
        {/* Header + Período */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <h4 className="text-muted-foreground text-sm">
              Análise dos check-ins realizados
            </h4>
          </div>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 mb-4 grid grid-cols-2 gap-4 p-1 sm:grid-cols-3">
          <Card className="flex min-h-30 w-full flex-col shadow-xs">
            <CardContent className="flex h-full flex-col items-center justify-center text-center">
              <CardTitle className="text-3xl text-blue-400">
                {totalCheckins}
              </CardTitle>
              <CardDescription>Total de Check-ins</CardDescription>
            </CardContent>
          </Card>
          <Card className="flex min-h-30 w-full flex-col shadow-xs">
            <CardContent className="flex h-full flex-col items-center justify-center text-center">
              <CardTitle className="text-3xl text-green-400">
                {percentOrganizedCheckins.toFixed(1)}%
              </CardTitle>
              <CardDescription>Organizados</CardDescription>
            </CardContent>
          </Card>
          <Card className="flex min-h-30 w-full flex-col shadow-xs">
            <CardContent className="flex h-full flex-col items-center justify-center text-center">
              <CardTitle className="text-3xl">
                {percentOrganizedItems.toFixed(1)}%
              </CardTitle>
              <CardDescription>Locais verificados</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* PIE CHART */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Lugares</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label={({ name, value }) => `${value} ${name}`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* TOP PEOPLE */}
          <Card>
            <CardHeader>
              <CardTitle>Quem mais fez Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topPeople} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(199, 89%, 48%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* TOP PROBLEMS */}
          <Card>
            <CardHeader>
              <CardTitle>Problemas mais Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topProblems} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(0, 72%, 51%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* TOP PLACES */}
          <Card>
            <CardHeader>
              <CardTitle>Lugares com mais Problemas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer
                width="100%"
                height={400}
                className="text-sm"
              >
                <BarChart data={topPlaces} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(38, 92%, 50%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
