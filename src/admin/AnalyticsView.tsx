import { ArrowUpRight, Monitor, Smartphone, Tablet, Globe, TrendingUp } from 'lucide-react';

// Analytics data — display-only metrics (not managed via CMS)
const trafficData = [
    { month: 'Oct', value: 320 },
    { month: 'Nov', value: 480 },
    { month: 'Dec', value: 410 },
    { month: 'Jan', value: 560 },
    { month: 'Feb', value: 620 },
    { month: 'Mar', value: 750 },
    { month: 'Apr', value: 890 },
];

const weeklyTraffic = [
    { day: 'Mon', visitors: 142, pageViews: 380 },
    { day: 'Tue', visitors: 168, pageViews: 420 },
    { day: 'Wed', visitors: 195, pageViews: 510 },
    { day: 'Thu', visitors: 210, pageViews: 560 },
    { day: 'Fri', visitors: 178, pageViews: 440 },
    { day: 'Sat', visitors: 95, pageViews: 210 },
    { day: 'Sun', visitors: 82, pageViews: 180 },
];

const topPages = [
    { path: '/', title: 'Homepage', views: 4280, uniqueVisitors: 3120, avgDuration: '2:45', bounceRate: '32%' },
    { path: '/services', title: 'Services', views: 2150, uniqueVisitors: 1680, avgDuration: '3:12', bounceRate: '28%' },
    { path: '/projects', title: 'Projects', views: 1890, uniqueVisitors: 1420, avgDuration: '4:05', bounceRate: '22%' },
    { path: '/about', title: 'About', views: 1240, uniqueVisitors: 980, avgDuration: '1:58', bounceRate: '45%' },
    { path: '/contact', title: 'Contact', views: 890, uniqueVisitors: 720, avgDuration: '1:22', bounceRate: '38%' },
];

const deviceBreakdown = [
    { device: 'Desktop', percentage: 62, sessions: 6820 },
    { device: 'Mobile', percentage: 31, sessions: 3410 },
    { device: 'Tablet', percentage: 7, sessions: 770 },
];

const trafficSources = [
    { source: 'Organic Search', visitors: 4850, percentage: 44 },
    { source: 'Direct', visitors: 2640, percentage: 24 },
    { source: 'LinkedIn', visitors: 1760, percentage: 16 },
    { source: 'Referral', visitors: 1100, percentage: 10 },
    { source: 'Email', visitors: 650, percentage: 6 },
];

// ── Bar Chart (Weekly) ──
function WeeklyChart() {
    const maxVal = Math.max(...weeklyTraffic.map(d => d.pageViews));

    return (
        <div className="border border-white/10 p-5" style={{ background: '#161616' }}>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40 mb-1">Weekly Traffic</h3>
                    <p className="text-[22px] font-black tracking-tight">1,070</p>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-mono text-white/30">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-[#F26522]" /> Page Views</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-sky-500" /> Visitors</span>
                </div>
            </div>
            <div className="flex items-end justify-between gap-2 h-[120px]">
                {weeklyTraffic.map(d => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex gap-[2px] items-end" style={{ height: '100px' }}>
                            <div className="flex-1 transition-all" style={{ height: `${(d.visitors / maxVal) * 100}%`, background: '#0ea5e9' }} />
                            <div className="flex-1 transition-all" style={{ height: `${(d.pageViews / maxVal) * 100}%`, background: '#F26522' }} />
                        </div>
                        <span className="text-[8px] font-mono text-white/25 uppercase">{d.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Monthly Line Chart ──
function MonthlyChart() {
    const maxVal = Math.max(...trafficData.map(d => d.value));
    const chartH = 140;
    const chartW = 500;
    const p = 16;

    const points = trafficData.map((d, i) => {
        const x = p + (i / (trafficData.length - 1)) * (chartW - p * 2);
        const y = chartH - p - ((d.value / maxVal) * (chartH - p * 2));
        return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${p},${chartH - p} ${points} ${chartW - p},${chartH - p}`;

    return (
        <div className="border border-white/10 p-5" style={{ background: '#161616' }}>
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40 mb-1">Monthly Trend</h3>
                    <p className="text-[22px] font-black tracking-tight">4,030</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                    <ArrowUpRight size={12} />
                    <span className="text-[10px] font-mono tracking-wider">+18.7%</span>
                </div>
            </div>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="none">
                <polygon points={areaPoints} fill="url(#aGrad)" opacity={0.25} />
                <polyline points={points} fill="none" stroke="#F26522" strokeWidth={2} strokeLinejoin="round" />
                {trafficData.map((d, i) => {
                    const x = p + (i / (trafficData.length - 1)) * (chartW - p * 2);
                    const y = chartH - p - ((d.value / maxVal) * (chartH - p * 2));
                    return <circle key={i} cx={x} cy={y} r={2.5} fill="#F26522" stroke="#161616" strokeWidth={2} />;
                })}
                {trafficData.map((d, i) => {
                    const x = p + (i / (trafficData.length - 1)) * (chartW - p * 2);
                    return <text key={i} x={x} y={chartH - 2} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace">{d.month}</text>;
                })}
                <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F26522" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#F26522" stopOpacity={0} />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// ── Device Stats ──
function DeviceStats() {
    const icons: Record<string, typeof Monitor> = { Desktop: Monitor, Mobile: Smartphone, Tablet: Tablet };

    return (
        <div className="border border-white/10 p-5" style={{ background: '#161616' }}>
            <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40 mb-4">Devices</h3>
            <div className="space-y-4">
                {deviceBreakdown.map(d => {
                    const Icon = icons[d.device] || Monitor;
                    return (
                        <div key={d.device}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <Icon size={13} className="text-white/30" />
                                    <span className="text-[11px] font-mono text-white/60">{d.device}</span>
                                </div>
                                <span className="text-[11px] font-mono text-white/80">{d.percentage}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5">
                                <div className="h-full bg-[#F26522] transition-all" style={{ width: `${d.percentage}%` }} />
                            </div>
                            <span className="text-[9px] font-mono text-white/20 mt-1 block">{d.sessions.toLocaleString()} sessions</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Traffic Sources ──
function SourcesTable() {
    return (
        <div className="border border-white/10" style={{ background: '#161616' }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <Globe size={14} className="text-white/30" />
                <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40">Traffic Sources</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
                {trafficSources.map(src => (
                    <div key={src.source} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                        <span className="text-[11px] font-mono text-white/60">{src.source}</span>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-1 bg-white/5 hidden sm:block">
                                <div className="h-full bg-[#F26522]/60" style={{ width: `${src.percentage}%` }} />
                            </div>
                            <span className="text-[11px] font-mono text-white/40 w-14 text-right">{src.visitors.toLocaleString()}</span>
                            <span className="text-[10px] font-mono text-[#F26522]/60 w-10 text-right">{src.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Top Pages Table ──
function TopPagesTable() {
    return (
        <div className="border border-white/10" style={{ background: '#161616' }}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <TrendingUp size={14} className="text-white/30" />
                <h3 className="text-[10px] font-mono tracking-[0.15em] uppercase text-white/40">Top Pages</h3>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-white/[0.06]">
                        <th className="text-left text-[9px] font-mono tracking-[0.15em] uppercase text-white/20 px-5 py-2.5">Page</th>
                        <th className="text-right text-[9px] font-mono tracking-[0.15em] uppercase text-white/20 px-5 py-2.5">Views</th>
                        <th className="text-right text-[9px] font-mono tracking-[0.15em] uppercase text-white/20 px-5 py-2.5 hidden sm:table-cell">Unique</th>
                        <th className="text-right text-[9px] font-mono tracking-[0.15em] uppercase text-white/20 px-5 py-2.5 hidden md:table-cell">Avg. Time</th>
                        <th className="text-right text-[9px] font-mono tracking-[0.15em] uppercase text-white/20 px-5 py-2.5">Bounce</th>
                    </tr>
                </thead>
                <tbody>
                    {topPages.map(page => (
                        <tr key={page.path} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3">
                                <div>
                                    <span className="text-[11px] font-mono text-white/70 block">{page.title}</span>
                                    <span className="text-[9px] font-mono text-white/20">{page.path}</span>
                                </div>
                            </td>
                            <td className="px-5 py-3 text-right text-[11px] font-mono text-white/60">{page.views.toLocaleString()}</td>
                            <td className="px-5 py-3 text-right text-[11px] font-mono text-white/40 hidden sm:table-cell">{page.uniqueVisitors.toLocaleString()}</td>
                            <td className="px-5 py-3 text-right text-[11px] font-mono text-white/40 hidden md:table-cell">{page.avgDuration}</td>
                            <td className="px-5 py-3 text-right text-[11px] font-mono text-white/30">{page.bounceRate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── ANALYTICS VIEW ─────────────────────────────
export function AnalyticsView() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[28px] md:text-[36px] font-black uppercase tracking-tight leading-none" style={{ fontFamily: "'Archivo Black', sans-serif" }}>Analytics</h1>
                <p className="text-[11px] font-mono tracking-[0.1em] text-white/30 uppercase mt-1.5">Website Performance & Visitor Insights</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {[
                    { label: 'Total Visitors', value: '11,000', change: '+18.7%' },
                    { label: 'Page Views', value: '28,450', change: '+12.3%' },
                    { label: 'Avg. Session', value: '2:42', change: '+0:15' },
                    { label: 'Bounce Rate', value: '33.2%', change: '-2.1%' },
                ].map(m => (
                    <div key={m.label} className="border border-white/10 p-4" style={{ background: '#161616' }}>
                        <span className="text-[9px] font-mono tracking-[0.15em] uppercase text-white/30 block mb-2">{m.label}</span>
                        <p className="text-[24px] font-black tracking-tight leading-none mb-1">{m.value}</p>
                        <span className="text-[9px] font-mono text-emerald-400">{m.change}</span>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <WeeklyChart />
                <MonthlyChart />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <DeviceStats />
                <div className="lg:col-span-2">
                    <SourcesTable />
                </div>
            </div>

            {/* Top Pages */}
            <TopPagesTable />
        </div>
    );
}
