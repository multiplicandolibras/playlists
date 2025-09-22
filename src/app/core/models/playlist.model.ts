export interface Video {
  title: string;
  youtubeId: string;
}

export interface Module {
  id: string;
  title: string;
  videos: Video[];
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  modules: Module[];
}