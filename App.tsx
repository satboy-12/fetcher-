
import React, { useState, useEffect } from 'react';
import { AppState, ContactReport, ContactType, SecurityStatus, EnrichmentData } from './types';
import { APP_NAME, Icons } from './constants';
import SearchBox from './components/SearchBox';
import ResultCard from './components/ResultCard';
import ReportForm from './components/ReportForm';
import Button from './components/Button';
import { lookupContact } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'unauthorized_contacts_reports';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    reports: [],
    isSearching: false,
    currentResult: null,
    showReportModal: false,
  });

  // Load reports from local storage (Simulating SQLite)
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setState(prev => ({ ...prev, reports: JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to load reports", e);
      }
    }
  }, []);

  // Save reports to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.reports));
  }, [state.reports]);

  const handleSearch = async (query: string, type: ContactType) => {
    setState(prev => ({ ...prev, isSearching: true, currentResult: null }));

    try {
      // Step 1: Check Local DB (Simulated)
      const localReport = state.reports.find(r => r.contact.toLowerCase() === query.toLowerCase());

      if (localReport) {
        // Mock result based on local report
        const mockResult: EnrichmentData = {
          contact: localReport.contact,
          type: localReport.type,
          status: SecurityStatus.FLAGGED,
          riskScore: 95,
          details: {
            isSpamLikely: true,
            summary: `This contact was manually reported by our users. Reason: ${localReport.reason}`,
            lastFlagged: new Date(localReport.timestamp).toLocaleDateString()
          }
        };
        setState(prev => ({ ...prev, currentResult: mockResult, isSearching: false }));
        return;
      }

      // Step 2: Consult External APIs (Via Gemini Service)
      const result = await lookupContact(query, type);
      setState(prev => ({ ...prev, currentResult: result, isSearching: false }));
    } catch (error) {
      console.error("Search failed:", error);
      alert("Verification failed. Please check your API configuration.");
      setState(prev => ({ ...prev, isSearching: false }));
    }
  };

  const handleReport = (reportData: Omit<ContactReport, 'id' | 'timestamp'>) => {
    const newReport: ContactReport = {
      ...reportData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };

    setState(prev => ({
      ...prev,
      reports: [newReport, ...prev.reports],
      showReportModal: false
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Icons.Shield />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{APP_NAME}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              onClick={() => setState(prev => ({ ...prev, showReportModal: true }))}
              className="hidden sm:flex"
            >
              <Icons.Plus /> Report Spam
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Unauthorized Contact Tracker
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Securely verify phone numbers and email addresses against our database and real‑time enrichment APIs.
          </p>
        </div>

        {/* Search Section */}
        <SearchBox onSearch={handleSearch} isSearching={state.isSearching} />

        {/* Results Section */}
        {state.currentResult && <ResultCard data={state.currentResult} />}

        {/* Local Reports / Stats */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Icons.History />
              <h3 className="text-xl font-bold text-slate-900">Recent Community Reports</h3>
            </div>
            <div className="text-sm font-medium text-slate-500">
              {state.reports.length} contacts flagged
            </div>
          </div>

          {state.reports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Icons.Shield />
              </div>
              <h4 className="text-lg font-semibold text-slate-900">No reports yet</h4>
              <p className="text-slate-500 mt-2">The community is currently safe. Help by reporting suspicious contacts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.reports.slice(0, 6).map(report => (
                <div key={report.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      report.type === ContactType.PHONE ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {report.type}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 truncate mb-1">{report.contact}</h4>
                  <p className="text-sm text-slate-600 line-clamp-2 italic">
                    "{report.reason}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Reported by {report.reporterName || 'Anonymous'}</span>
                    <span className="text-red-500"><Icons.Alert /></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => setState(prev => ({ ...prev, showReportModal: true }))}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <Icons.Plus />
      </button>

      {/* Report Modal */}
      {state.showReportModal && (
        <ReportForm 
          onSubmit={handleReport} 
          onCancel={() => setState(prev => ({ ...prev, showReportModal: false }))} 
        />
      )}
    </div>
  );
};

export default App;
