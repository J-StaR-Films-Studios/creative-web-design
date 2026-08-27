export type RoomId = 'image' | 'sound' | 'typography' | 'objects' | 'film' | 'digital' | 'finale';

export type ArtifactCategory = 'IMAGE' | 'SOUND' | 'FILM' | 'OBJECT' | 'TYPE' | 'DIGITAL';

export interface ArchiveArtifact {
  id: string;              // e.g. "ARC-1974-008391"
  numericId: number;       // For memory tracking
  title: string;
  year: string;
  category: ArtifactCategory;
  roomId: RoomId;
  maker: string;
  medium: string;
  dimensions?: string;
  provenance: string;
  description: string;
  visualData: {
    aspectRatio: number;
    colorPalette: string[];
    textureType: 'photograph' | 'waveform' | 'typographic' | 'blueprint' | 'celluloid' | 'cybernetic';
    glyph?: string;
    caption?: string;
  };
}

export type CursorState = 'DEFAULT' | 'VIEW' | 'EXAMINE' | 'ENTER' | 'SEARCH' | 'SOUND' | 'DRAG' | 'CLOSE';

export interface MemoryItem {
  artifact: ArchiveArtifact;
  timestamp: number;
  viewDurationMs: number;
}
