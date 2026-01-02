export const parseNightModeData = (
  data: string
): {
  enabled: boolean;
  startTime: string;
  endTime: string;
  disableBacklight: boolean;
  brightness: number;
} | null => {
  const parts = data.split('|').map((p) => p.trim());

  if (parts.length !== 5) {
    console.error('Invalid night mode data format:', data);
    return null;
  }

  const [enabled, startTime, endTime, disableBacklight, brightness] = parts;

  return {
    enabled: enabled === 'true',
    startTime,
    endTime,
    disableBacklight: disableBacklight === 'true',
    brightness: Number(brightness)
  };
};

export const formatNightModeData = (
  enabled: boolean,
  startTime: string,
  endTime: string,
  disableBacklight: boolean,
  brightness: number
): string => {
  return `${enabled} | ${startTime} | ${endTime} | ${disableBacklight} | ${brightness}`;
};
