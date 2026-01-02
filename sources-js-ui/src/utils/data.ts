import { TimeMode } from './constants';
import type { AppData } from '@app-types/dataTypes.ts';

export const data: AppData = {
  brightness: 80,
  timeMode: TimeMode.TWENTY_FOUR_HOUR,
  timezoneMode: 'auto',
  selectedTimezone: 'UTC+00:00',
  nightMode: {
    enabled: false,
    startTime: '22:00',
    endTime: '07:00',
    brightness: 30,
    disableBacklight: false
  }
};

export const getData = (): AppData => {
  return { ...data };
};

export const updateData = (updates: Partial<AppData>): void => {
  Object.assign(data, updates);
};
