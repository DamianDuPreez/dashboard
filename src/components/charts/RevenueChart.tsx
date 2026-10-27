import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '@/context/ThemeContext';
import { useWallet } from '@/context/WalletContext';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCompact, formatMoney } from '@/lib/utils';

export function RevenueChart({ months = 6 }: { months?: number }) {
  const { palette } = useTheme();
  const { activeRevenue, isLoading } = useWallet();

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-2xl" />;
  }

  const data = activeRevenue.slice(-months);
  const axisColor = '#A8A29E'; // stone-400

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={palette.primary} stopOpacity={0.22} />
            <stop offset="100%" stopColor={palette.primary} stopOpacity={0}    />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} stroke="#EDEAE4" strokeDasharray="3 5" />
        <XAxis
          dataKey="name"
          tick={{ fill: axisColor, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: axisColor, fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatCompact}
          width={56}
        />
        <Tooltip
          cursor={{ stroke: palette.primary, strokeOpacity: 0.25, strokeDasharray: '4 4' }}
          content={({ active, payload, label }) =>
            active && payload?.length ? (
              <div className="rounded-xl bg-ink text-white px-3 py-2 shadow-xl">
                <p className="text-[11px] text-white/60">{label}</p>
                <p className="text-sm font-semibold tabular">{formatMoney(Number(payload[0].value))}</p>
              </div>
            ) : null
          }
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={palette.primary}
          strokeWidth={2.25}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{ r: 5, fill: palette.primary, stroke: '#fff', strokeWidth: 2.5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
