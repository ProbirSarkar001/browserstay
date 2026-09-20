export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  cleanedSize?: number;
}

export interface MetadataRemovalSettings {
  /** Re-encode at maximum quality in the original format when supported. */
  preserveFormat: boolean;
}
