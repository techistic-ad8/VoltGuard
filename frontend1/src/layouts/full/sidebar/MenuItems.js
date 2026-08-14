import { uniqueId } from 'lodash';

import {
  IconLayoutDashboard,
  IconCpu,
  IconActivity,
  IconTools,
  IconDatabase,
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'HOME',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'UTILITY SURVEILLANCE',
  },
  {
    id: uniqueId(),
    title: 'Meter Inventory',
    icon: IconCpu,
    href: '/dashboard#meters',
  },
  {
    id: uniqueId(),
    title: 'Live Telemetry',
    icon: IconActivity,
    href: '/dashboard#telemetry',
  },
  {
    id: uniqueId(),
    title: 'Work Orders',
    icon: IconTools,
    href: '/dashboard#work-orders',
  },
  {
    navlabel: true,
    subheader: 'DATABASE SYSTEM',
  },
  {
    id: uniqueId(),
    title: 'H2 Console',
    icon: IconDatabase,
    href: 'http://localhost:8085/h2-console',
    external: true,
  },
];

export default Menuitems;
