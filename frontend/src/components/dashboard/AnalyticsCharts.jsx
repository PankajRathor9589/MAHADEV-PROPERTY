import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const tooltipStyle = {
  borderRadius: "18px",
  border: "1px solid rgba(226,232,240,0.9)",
  boxShadow: "0 18px 44px -24px rgba(15,23,42,0.28)"
};

const ChartCardShell = ({ eyebrow = "Analytics", title, description, children }) => (
  <article className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-card">
    <p className="surface-label">{eyebrow}</p>
    <h3 className="mt-2 text-2xl font-semibold text-ink">{title}</h3>
    {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
    <div className="mt-5 h-72 w-full">{children}</div>
  </article>
);

export const AnalyticsBarCard = ({ title, description, data, dataKey = "value", color = "#0f7a67" }) => (
  <ChartCardShell title={title} description={description}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={dataKey} fill={color} radius={[10, 10, 0, 0]} barSize={42} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCardShell>
);

export const AnalyticsAreaCard = ({
  title,
  description,
  data,
  primaryKey = "value",
  secondaryKey,
  primaryColor = "#0f7a67",
  secondaryColor = "#d97706"
}) => (
  <ChartCardShell title={title} description={description}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="primaryArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.36} />
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0.04} />
          </linearGradient>
          <linearGradient id="secondaryArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
            <stop offset="95%" stopColor={secondaryColor} stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Area type="monotone" dataKey={primaryKey} stroke={primaryColor} fill="url(#primaryArea)" strokeWidth={3} />
        {secondaryKey && <Area type="monotone" dataKey={secondaryKey} stroke={secondaryColor} fill="url(#secondaryArea)" strokeWidth={3} />}
      </AreaChart>
    </ResponsiveContainer>
  </ChartCardShell>
);

export const AnalyticsComparisonBarCard = ({
  title,
  description,
  data,
  primaryKey = "primary",
  secondaryKey = "secondary",
  primaryLabel = "Primary",
  secondaryLabel = "Secondary",
  primaryColor = "#0f7a67",
  secondaryColor = "#d97706"
}) => (
  <ChartCardShell title={title} description={description}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={10}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Bar dataKey={primaryKey} name={primaryLabel} fill={primaryColor} radius={[8, 8, 0, 0]} barSize={26} />
        <Bar dataKey={secondaryKey} name={secondaryLabel} fill={secondaryColor} radius={[8, 8, 0, 0]} barSize={26} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCardShell>
);

export const AnalyticsDonutCard = ({
  title,
  description,
  data,
  colors = ["#0f7a67", "#d97706", "#102033", "#69bfae"]
}) => (
  <ChartCardShell title={title} description={description}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={72}
          outerRadius={102}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`${entry.label}-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </ChartCardShell>
);
