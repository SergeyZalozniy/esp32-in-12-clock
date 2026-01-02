import { TimeMode } from '@utils/constants.ts';

export interface NightModeData {
  enabled: boolean;
  startTime: string;
  endTime: string;
  brightness: number;
  disableBacklight: boolean;
}

export interface AppData {
  brightness: number;
  timeMode: TimeMode;
  timezoneMode: 'auto' | 'manual';
  selectedTimezone: string;
  nightMode: NightModeData;
}
