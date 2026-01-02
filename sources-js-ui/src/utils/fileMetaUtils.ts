export interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

export const formatFileMetadata = (metadata: FileMetadata): string => {
  return `${metadata.name}|${metadata.size}|${metadata.type}`;
};
