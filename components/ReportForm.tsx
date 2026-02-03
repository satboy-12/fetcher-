
import React, { useState } from 'react';
import { ContactType, ContactReport } from '../types';
import Button from './Button';

interface ReportFormProps {
  onSubmit: (report: Omit<ContactReport, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, onCancel }) => {
  const [contact, setContact] = useState('');
  const [type, setType] = useState<ContactType>(ContactType.PHONE);
  const [reason, setReason] = useState('');
  const [reporterName, setReporterName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact || !reason) return;
    onSubmit({ contact, type, reason, reporterName });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Report Unauthorized Contact</h2>
          <p className="text-sm text-slate-500 mt-1">Help others stay safe by reporting spam.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType(ContactType.PHONE)}
                className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
                  type === ContactType.PHONE 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Phone Number
              </button>
              <button
                type="button"
                onClick={() => setType(ContactType.EMAIL)}
                className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${
                  type === ContactType.EMAIL 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Email Address
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {type === ContactType.PHONE ? 'Phone Number' : 'Email Address'}
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={type === ContactType.PHONE ? '+1 (555) 000-0000' : 'name@example.com'}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Reason for Reporting</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Aggressive marketing, Phishing attempt, Automated bot..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Anonymous"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="danger" className="flex-1">
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
