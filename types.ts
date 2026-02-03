
export enum ContactType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL'
}

export enum SecurityStatus {
  SAFE = 'SAFE',
  FLAGGED = 'FLAGGED',
  UNKNOWN = 'UNKNOWN'
}

export interface ContactReport {
  id: string;
  contact: string;
  type: ContactType;
  reason: string;
  timestamp: number;
  reporterName?: string;
}

export interface EnrichmentData {
  contact: string;
  type: ContactType;
  status: SecurityStatus;
  riskScore: number; // 0 to 100
  details: {
    carrier?: string;
    location?: string;
    profileName?: string;
    domainInfo?: string;
    isSpamLikely: boolean;
    lastFlagged?: string;
    summary: string;
  };
}

export interface AppState {
  reports: ContactReport[];
  isSearching: boolean;
  currentResult: EnrichmentData | null;
  showReportModal: boolean;
}
