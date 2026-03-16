'use client'

import { useState } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { supabase } from '@/lib/supabase/client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { format, subDays, subMonths } from 'date-fns'

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

const PERIOD_OPTIONS = [
  { label: 'Últimos 7 dias', value: '7d' },
  { label: 'Último mês', value: '1m' },
  { label: 'Últimos 3 meses', value: '3m' },
  { label: 'Últimos 6 meses', value: '6m' },
  { label: 'Últimos 12 meses', value: '12m'}
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

  const startDate = format(getStartDate(period), 'yyyy-MM-dd')

  /**
   * ==============================
   * MOCK DATA (HARDCODE)
   * ==============================
   */

  const reportData = {
    totalCheckins: 42,
    totalItems: 120,
    organizedPercent: 78,

    pieData: [
      { name: 'Organizados', value: 94 },
      { name: 'Desorganizados', value: 26 },
    ],

    topPeople: [
      { name: 'Carlos', count: 12 },
      { name: 'Ana', count: 9 },
      { name: 'João', count: 8 },
      { name: 'Maria', count: 7 },
      { name: 'Pedro', count: 6 },
    ],

    topProblems: [
      { name: 'Equipamento fora do lugar', count: 15 },
      { name: 'Falta de etiqueta', count: 11 },
      { name: 'Cabo solto', count: 8 },
      { name: 'Material danificado', count: 5 },
      { name: 'Falta de limpeza', count: 3 },
    ],

    topPlaces: [
      { name: 'Laboratório A', count: 14 },
      { name: 'Laboratório B', count: 10 },
      { name: 'Sala 203', count: 8 },
      { name: 'Sala 105', count: 6 },
      { name: 'Depósito', count: 4 },
    ],
  }

  const isLoading = false

  /**
   * ==============================
   * BACKEND ORIGINAL (COMENTADO)
   * ==============================
   */

  /*
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', period],
    queryFn: async () => {
      const { data: checkins, error: cErr } = await supabase
        .from('checkins')
        .select('*, people(name)')
        .gte('date', startDate)

      if (cErr) throw cErr

      const checkinIds = checkins?.map((c) => c.id) ?? []

      let items: any[] = []

      if (checkinIds.length > 0) {
        const { data: itemsData } = await supabase
          .from('checkin_items')
          .select('*, places(name, laboratories(name))')
          .in('checkin_id', checkinIds)

        items = itemsData ?? []
      }

      const disorganizedItemIds = items
        .filter((i) => !i.is_organized)
        .map((i) => i.id)

      let problemEntries: any[] = []

      if (disorganizedItemIds.length > 0) {
        const { data: probData } = await supabase
          .from('checkin_item_problems')
          .select('*, problems(name)')
          .in('checkin_item_id', disorganizedItemIds)

        problemEntries = probData ?? []
      }

      ...
    }
  })
  */

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start rounded-t-xl bg-gray-50 md:mt-2">
      <div className="m-5 rounded-t-xl bg-gray-50">
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
                <SelectItem key={opt.value} value={opt.value} className="data-highlighted:bg-green-100 data-[state=checked]:bg-green-200 ">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-sm">Carregando...</p>
        ) : (
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
                      data={reportData.pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {reportData.pieData.map((_, i) => (
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
                  <BarChart data={reportData.topPeople} layout="vertical">
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
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reportData.topProblems} layout="vertical">
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
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={reportData.topPlaces} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(38, 92%, 50%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
