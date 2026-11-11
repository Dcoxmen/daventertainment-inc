// The 12 radio stations for the /music dial. Each loop is a seamless cut
// (at most 1:30, 48 kHz) from one of David's songs; the link opens the full song.

export type Station = {
  id: string;
  title: string;
  src: string;
  youtube: string;
  /** Exact loop length. The MP3s add ~23 ms of silence at the start, which the player skips. */
  seconds: number;
};

const CHANNEL = "https://www.youtube.com/@daventertainmentdj/videos";
const watch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const STATIONS: Station[] = [
  { id: "cup-of-joe", title: "Cup of Joe", src: "/audio/stations/cup-of-joe.mp3", seconds: 77.237500, youtube: watch("v8q06zzUpo8") },
  { id: "night-out", title: "Night Out", src: "/audio/stations/night-out.mp3", seconds: 80.002083, youtube: watch("-5DmnuNbhgE") },
  { id: "hypnotically-cool", title: "Hypnotically Cool x Funk Feelin", src: "/audio/stations/hypnotically-cool.mp3", seconds: 82.657542, youtube: watch("54B_cwJ5oPQ") },
  { id: "up-and-running", title: "Up & Running", src: "/audio/stations/up-and-running.mp3", seconds: 84.900875, youtube: watch("Gi1Enlr7J-g") },
  { id: "evening-dine", title: "Evening Dine", src: "/audio/stations/evening-dine.mp3", seconds: 84.890000, youtube: watch("I9xbNDHCvjc") },
  { id: "aghaz-e-rooz", title: "Aghaz-e Rooz (Begin the Day)", src: "/audio/stations/aghaz-e-rooz.mp3", seconds: 85.332583, youtube: watch("ZCbAeAyIuMg") },
  { id: "the-row", title: "The Row", src: "/audio/stations/the-row.mp3", seconds: 83.669583, youtube: watch("xB6esrN9sNI") },
  { id: "spanish-coffee", title: "Spanish Coffee", src: "/audio/stations/spanish-coffee.mp3", seconds: 75.791542, youtube: watch("CjRLfdPre4k") },
  { id: "matiz-tropical", title: "Matiz Tropical", src: "/audio/stations/matiz-tropical.mp3", seconds: 78.438125, youtube: watch("oX00L3VZDhE") },
  { id: "rizz-risen", title: "Rizz Risen", src: "/audio/stations/rizz-risen.mp3", seconds: 75.345250, youtube: CHANNEL },
  { id: "landing-in-funkify", title: "Landing in Funkify", src: "/audio/stations/landing-in-funkify.mp3", seconds: 80.197708, youtube: CHANNEL },
  { id: "mi-special-butterfly", title: "Mi Special Butterfly", src: "/audio/stations/mi-special-butterfly.mp3", seconds: 84.321208, youtube: CHANNEL },
];
