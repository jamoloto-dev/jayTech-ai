import React from 'react';
import { BarChart3, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';
import { AnalyticsSummary } from '../../types/index.js';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics }) => {
  if (!analytics) return null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="border-b border-[#2A2F40] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
          <BarChart3 className="w-4 h-4 text-[#00F0FF]" />
          <span>PRODUCTION TELEMETRY & USAGE LEDGER</span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Platform Analytics & AI Credits</h1>
        <p className="text-xs text-[#94A3B8]">
          Real-time tracking of AI token consumption, video rendering duration, and provider performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#12141A] border border-[#2A2F40] p-5 rounded-xl space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase">Total Videos</span>
          <div className="text-2xl font-bold text-white">{analytics.videosCreated}</div>
          <div className="text-xs text-[#10B981] font-mono">{analytics.videosCompleted} fully ready</div>
        </div>

        <div className="bg-[#12141A] border border-[#2A2F40] p-5 rounded-xl space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase">Render Seconds</span>
          <div className="text-2xl font-bold text-[#00F0FF]">{analytics.totalRenderSeconds}s</div>
          <div className="text-xs text-[#94A3B8]">1080x1920 9:16 format</div>
        </div>

        <div className="bg-[#12141A] border border-[#2A2F40] p-5 rounded-xl space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase">Average Latency</span>
          <div className="text-2xl font-bold text-white">{analytics.averageGenerationTimeSeconds}s</div>
          <div className="text-xs text-[#94A3B8]">Gemini 3.8 Flash pipeline</div>
        </div>

        <div className="bg-[#12141A] border border-[#2A2F40] p-5 rounded-xl space-y-1">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase">Provider Uptime</span>
          <div className="text-2xl font-bold text-[#FFB800]">{analytics.providerSuccessRate}%</div>
          <div className="text-xs text-[#10B981]">Automatic retry enabled</div>
        </div>
      </div>

      {/* Usage Ledger */}
      <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl overflow-hidden space-y-3 p-5">
        <span className="text-xs font-semibold text-white uppercase tracking-wider block">
          Recent Usage Ledger Entries
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2A2F40] text-[#64748B] text-[11px]">
                <th className="pb-2">Feature / Operation</th>
                <th className="pb-2">Units Consumed</th>
                <th className="pb-2">Credits Deducted</th>
                <th className="pb-2 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2330]">
              {analytics.recentUsageLedger.map(item => (
                <tr key={item.id} className="text-[#94A3B8]">
                  <td className="py-2.5 font-medium text-white">{item.feature}</td>
                  <td className="py-2.5 font-mono">{item.units}</td>
                  <td className="py-2.5 text-[#FFB800] font-mono">-{item.creditsDeducted}</td>
                  <td className="py-2.5 text-right font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
