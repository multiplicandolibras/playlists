export interface Lesson {
  id: string;
  title: string;
  youtubeId: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  modules: Module[];
}
