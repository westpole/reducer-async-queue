interface CalendarEntity {
  season: string;
  round: string;
  url: string;
  raceName: string;
  date: string;
  time: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
}

export interface AppState {
  baseUrl: string | null;
  year: string | null;
  calendar: CalendarEntity[] | null;
  current: {
    date: string | null;
    time: string | null;
  };
}

export interface ConverterOptions {
  date?: string;
  time?: string;
  now?: number;
}

export interface ErganResponse {
  MRData?: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable: {
      Races: CalendarEntity[];
    };
  };
  json: () => Promise<ErganResponse>;
}

// eslint-disable-next-line no-unused-vars
type QueueRunner = (appState: AppState) => Promise<AppState>;

export type Queue = QueueRunner[];
