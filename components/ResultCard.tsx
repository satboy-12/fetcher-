
import React from 'react';
import { EnrichmentData, SecurityStatus } from '../types';
import { Icons } from '../constants';

interface ResultCardProps {
  data: EnrichmentData;
}

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const isFlagged = data.status === SecurityStatus.FLAGGED || data.riskScore > 60;
  
  return (
    <div className={`mt-8 w-full max-w-2xl mx-auto rounded-2xl border overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isFlagged ? 'border-red-200 bg-red-50/30' : 'border-emerald-200 bg-emerald-50/30'
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className={`p-3 rounded-xl ${isFlagged ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isFlagged ? <Icons.Alert /> : <Icons.Check />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{data.contact}</h3>
              <p className={`text-sm font-semibold uppercase tracking-wider mt-1 ${
                isFlagged ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {isFlagged ? 'Flagged / High Risk' : 'Verified / Likely Safe'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${isFlagged ? 'text-red-600' : 'text-emerald-600'}`}>
              {data.riskScore}%
            </div>
            <p className="text-xs text-slate-500 uppercase font-medium">Risk Score</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.details.carrier && (
            <div className="bg-white/60 p-3 rounded-lg border border-slate-100">
              <span className="block text-xs text-slate-400 uppercase font-bold">Carrier</span>
              <span className="text-slate-700 font-medium">{data.details.carrier}</span>
            </div>
          )}
          {data.details.location && (
            <div className="bg-white/60 p-3 rounded-lg border border-slate-100">
              <span className="block text-xs text-slate-400 uppercase font-bold">Location</span>
              <span className="text-slate-700 font-medium">{data.details.location}</span>
            </div>
          )}
          {data.details.profileName && (
            <div className="bg-white/60 p-3 rounded-lg border border-slate-100">
              <span className="block text-xs text-slate-400 uppercase font-bold">Profile Name</span>
              <span className="text-slate-700 font-medium">{data.details.profileName}</span>
            </div>
          )}
          {data.details.domainInfo && (
            <div className="bg-white/60 p-3 rounded-lg border border-slate-100">
              <span className="block text-xs text-slate-400 uppercase font-bold">Domain Status</span>
              <span className="text-slate-700 font-medium">{data.details.domainInfo}</span>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white border border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-1">Security Analysis</h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            {data.details.summary}
          </p>
        </div>
        
        {isFlagged && (
          <div className="mt-4 flex items-center gap-2 text-xs text-red-600 bg-red-100/50 p-2 rounded-lg">
            <Icons.Alert />
            <span>This contact matches patterns of unauthorized automated contact systems. Proceed with caution.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
