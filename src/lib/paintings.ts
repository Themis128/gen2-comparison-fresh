export interface Painting {
  id: string;
  title: string;
  artist: string;
  year: number;
  imageUrl: string;
  description: string;
}

export const PAINTINGS: Painting[] = [
  {
    id: "1",
    title: "Starry Night",
    artist: "Vincent van Gogh",
    year: 1889,
    imageUrl: "/paintings/starry-night.jpg",
    description: "A swirling night sky over a village."
  },
  {
    id: "2",
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: 1831,
    imageUrl: "/paintings/great-wave.jpg",
    description: "A famous Japanese woodblock print."
  }
];