export interface Profile {
  id?: number;
  name: string;
  progress: { [key: string]: any }; // Assuming progress is an object with string keys and any values
}
