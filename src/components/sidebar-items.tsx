import {
  ChartColumn,
  ClipboardCheckIcon,
  FlaskConical,
  HistoryIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  TriangleAlertIcon,
  UsersRoundIcon,
} from 'lucide-react'

export const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Novo Check-in',
    href: '/checkins/create',
    icon: ClipboardCheckIcon,
  },
  {
    title: 'Histórico',
    href: '/history',
    icon: HistoryIcon,
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: ChartColumn,
  },
  {
    title: 'Laboratórios',
    href: '/laboratories',
    icon: FlaskConical,
  },
  {
    title: 'Lugares',
    href: '/places',
    icon: MapPinIcon,
  },
  {
    title: 'Problemas',
    href: '/problems',
    icon: TriangleAlertIcon,
  },
  {
    title: 'Pessoas',
    href: '/people',
    icon: UsersRoundIcon,
  },
]