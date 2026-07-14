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

/** Staging row awaiting Lead drain into MyAgent ACTIVITY-LOG. */
export type ActivityQueueRow = {
  at: string;
  timestamp: string;
  session: string;
  provider: string;
  role: string;
  action: string;
  target: string;
  result: string;
  notes: string;
};

export type ActivityQueueInput = {
  timestamp?: string;
  session?: string;
  provider?: string;
  role?: string;
  action: string;
  target?: string;
  result?: string;
  notes?: string;
};

export type ActivityQueueResponse = {
  at: string;
  source: string;
  queue: true;
  query?: string;
  matched: number;
  truncated: boolean;
  entries: ActivityQueueRow[];
};
