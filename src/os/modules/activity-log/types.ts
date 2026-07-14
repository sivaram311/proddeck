export type ActivityLogEntry = {
  timestamp: string;
  session: string;
  provider: string;
  role: string;
  action: string;
  target: string;
  result: string;
  notes: string;
  redacted: boolean;
};

export type ActivityLogResponse = {
  at: string;
  source: string;
  query?: string;
  tailLimit: number;
  totalRows: number;
  matched: number;
  truncated: boolean;
  entries: ActivityLogEntry[];
};
