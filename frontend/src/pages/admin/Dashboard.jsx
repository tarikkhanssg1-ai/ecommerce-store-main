import { useEffect, useState } from "react";
import { FiUsers, FiBox, FiShield, FiPackage } from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../api/axios";

const CATEGORICAL = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#4a3aa7", "#e34948"];
const INK_SECONDARY = "#52514e";
const INK_MUTED = "#898781";
const GRIDLINE = "#e1e0d9";
const SURFACE = "#fcfcfb";

const foldToTop = (items, key, max = 7) => {
  if (items.length <= max) return items;
  const sorted = [...items].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, max);
  const rest = sorted.slice(max);
  const otherCount = rest.reduce((sum, item) => sum + item.count, 0);
  return [...top, { [key]: "Other", count: otherCount }];
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
      <Icon size={22} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

const ChartTooltip = ({ active, payload, label, nameKey }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900">{label ?? entry.payload[nameKey]}</p>
      <p className="text-gray-500">{entry.value} {entry.value === 1 ? "item" : "items"}</p>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 max-w-md">
        {error}
      </div>
    );
  }

  const usersByRole = foldToTop(stats.usersByRole, "role");
  const productsByCategory = foldToTop(stats.productsByCategory, "category");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiUsers} label="Total Users" value={stats.totalUsers} />
        <StatCard icon={FiShield} label="Admins" value={stats.totalAdmins} />
        <StatCard icon={FiBox} label="Total Products" value={stats.totalProducts} />
        <StatCard icon={FiPackage} label="Total Stock" value={stats.totalStock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Products by category">
          {productsByCategory.length === 0 ? (
            <p className="text-sm text-gray-500">No products yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={productsByCategory} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid vertical={false} stroke={GRIDLINE} />
                  <XAxis
                    dataKey="category"
                    tick={{ fill: INK_MUTED, fontSize: 12 }}
                    axisLine={{ stroke: GRIDLINE }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: INK_MUTED, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip content={<ChartTooltip nameKey="category" />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={44}>
                    {productsByCategory.map((entry, index) => (
                      <Cell key={entry.category} fill={CATEGORICAL[index % CATEGORICAL.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                {productsByCategory.map((entry, index) => (
                  <li key={entry.category} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CATEGORICAL[index % CATEGORICAL.length] }}
                    />
                    {entry.category}: <span className="font-medium text-gray-900">{entry.count}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </ChartCard>

        <ChartCard title="Users by role">
          {usersByRole.length === 0 ? (
            <p className="text-sm text-gray-500">No users yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={usersByRole}
                    dataKey="count"
                    nameKey="role"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={usersByRole.length > 1 ? 3 : 0}
                    stroke={SURFACE}
                    strokeWidth={2}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell key={entry.role} fill={CATEGORICAL[index % CATEGORICAL.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip nameKey="role" />} />
                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => <span style={{ color: INK_SECONDARY, fontSize: 12 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
