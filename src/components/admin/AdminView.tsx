import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Server, Clock, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.js';

export const AdminView: React.FC = () => {
  const [data, setData] = useState<{
    metrics: Array<{ provider: string; operation: string; durationMs: number; success: boolean }>;
    auditLogs: Array<{ id: string; userId: string; action: string; timestamp: string; details: string }>;
    aiProvider: string;
  } | null>(null);

  useEffect(() => {
    api.getAdminOverview().then(setData).catch(console.error);
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="border-b border-[#2A2F40] pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
          <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
          <span>ENTERPRISE GOVERNANCE & TELEMETRY</span>
        </div>
        <h1 className="text-xl font-bold text-white mt-1">Platform Admin Switchboard</h1>
        <p className="text-xs text-[#94A3B8]">
          Real-time model provider latency, execution reliability, and user audit trails.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Execution Latency */}
        <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2A2F40]">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#00F0FF]" />
              Recent AI Provider Invocations
            </span>
            <span className="text-[11px] text-[#10B981] font-mono">Live</span>
          </div>

          <div className="space-y-2">
            {data?.metrics && data.metrics.length > 0 ? (
              data.metrics.slice(-5).map((m, i) => (
                <div key={i} className="p-2.5 bg-[#0A0C10] border border-[#2A2F40] rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white">{m.operation}</div>
                    <div className="text-[11px] text-[#64748B]">{m.provider}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[#00F0FF]">{m.durationMs}ms</span>
                    <span className={`block text-[10px] ${m.success ? 'text-[#10B981]' : 'text-red-400'}`}>
                      {m.success ? 'Success' : 'Fallback'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#64748B]">No recent provider calls recorded.</div>
            )}
          </div>
        </div>

        {/* Security Audit Log */}
        <div className="bg-[#12141A] border border-[#2A2F40] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2A2F40]">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-[#FFB800]" />
              Immutable Audit Log
            </span>
            <span className="text-[11px] text-[#64748B] font-mono">Tenant Isolation Enforced</span>
          </div>

          <div className="space-y-2">
            {data?.auditLogs && data.auditLogs.length > 0 ? (
              data.auditLogs.slice(-5).map(log => (
                <div key={log.id} className="p-2.5 bg-[#0A0C10] border border-[#2A2F40] rounded-lg text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase text-[10px] text-[#00F0FF]">{log.action}</span>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8] truncate">{log.details}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-[#64748B]">Audit logs initialized.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
