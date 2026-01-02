export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const base = 1024;
  const units = ['Bytes', 'KB', 'MB'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

  const size = Math.round((bytes / Math.pow(base, unitIndex)) * 100) / 100;

  return `${size} ${units[unitIndex]}`;
};
