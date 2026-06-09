import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { Skeleton } from '@/components/ui/Skeleton';

export function RevenueChart() {
  const { palette } = useTheme();
  const { activeRevenue, isLoading } = useWallet();

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-2xl" />;
  }

  // Always slate for axis text — it sits on a white card
  const axisColor = '#94a3b8'; // slate-400

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={activeRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={palette.primary} stopOpacity={0.15} />
            <stop offset="95%" stopColor={palette.primary} stopOpacity={0}    />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="name"
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={axisColor}
          tick={{ fill: axisColor, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v.toLocaleString()}`}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            borderColor: '#e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            color: '#0f172a',
            fontSize: 13,
          }}
          labelStyle={{ color: '#64748b', fontWeight: 600 }}
          itemStyle={{ color: palette.primary, fontWeight: 700 }}
          cursor={{ stroke: palette.primary, strokeOpacity: 0.15, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={palette.primary}
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{ r: 5, fill: palette.primary, stroke: '#fff', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
