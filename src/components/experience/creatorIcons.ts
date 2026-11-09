// Icons for the "Now" chapter. The 3D badges (desktop) and the round icon
// buttons (phone) are both drawn from these, so they always match.

const TAU = Math.PI * 2;
const INK = "#f3e6c8";

export type CreatorIcon = {
  href: string;
  label: string;
  background: string;
  draw: (context: CanvasRenderingContext2D) => void;
};

// Coordinates are on a 512 × 512 canvas.
export const CREATOR_ICONS: CreatorIcon[] = [
  {
    href: "/work",
    label: "Apps",
    background: "#1d3f8f",
    draw: (c) => {
      c.lineWidth = 30;
      c.beginPath();
      c.moveTo(190, 180); c.lineTo(120, 256); c.lineTo(190, 332);
      c.moveTo(290, 168); c.lineTo(222, 344);
      c.moveTo(322, 180); c.lineTo(392, 256); c.lineTo(322, 332);
      c.stroke();
    },
  },
  {
    href: "/music",
    label: "Music",
    background: "#8c1a2e",
    draw: (c) => {
      c.beginPath();
      c.ellipse(196, 340, 46, 34, -0.4, 0, TAU);
      c.ellipse(336, 310, 46, 34, -0.4, 0, TAU);
      c.fill();
      c.lineWidth = 22;
      c.beginPath();
      c.moveTo(236, 330); c.lineTo(236, 170);
      c.moveTo(376, 300); c.lineTo(376, 140);
      c.stroke();
      c.beginPath();
      c.moveTo(225, 160); c.lineTo(387, 130); c.lineTo(387, 176); c.lineTo(225, 206);
      c.fill();
    },
  },
  {
    href: "/art",
    label: "Art",
    background: "#9a7840",
    draw: (c) => {
      c.beginPath();
      c.ellipse(256, 256, 170, 136, -0.2, 0, TAU);
      c.fill();
      c.fillStyle = "#9a7840";
      c.beginPath();
      c.arc(320, 320, 30, 0, TAU);
      c.fill();
      [["#2855c8", 190, 200], ["#a11f36", 270, 170], ["#0b1326", 190, 290], ["#d4b06a", 345, 220]].forEach(
        ([color, cx, cy]) => {
          c.fillStyle = color as string;
          c.beginPath();
          c.arc(cx as number, cy as number, 30, 0, TAU);
          c.fill();
        }
      );
    },
  },
  {
    href: "/videos",
    label: "Videos",
    background: "#16223f",
    draw: (c) => {
      // A screen with a play button
      c.lineWidth = 22;
      c.beginPath();
      c.roundRect(116, 156, 280, 200, 26);
      c.stroke();
      c.fillStyle = "#d4b06a";
      c.beginPath();
      c.moveTo(226, 206); c.lineTo(226, 306); c.lineTo(310, 256);
      c.closePath();
      c.fill();
    },
  },
];

// Fills a square canvas with the icon, scaled from its 512px design.
export function drawCreatorIcon(canvas: HTMLCanvasElement, { background, draw }: CreatorIcon) {
  const c = canvas.getContext("2d");
  if (!c) return;
  c.setTransform(canvas.width / 512, 0, 0, canvas.height / 512, 0, 0);
  c.fillStyle = background;
  c.fillRect(0, 0, 512, 512);
  c.strokeStyle = c.fillStyle = INK;
  c.lineCap = c.lineJoin = "round";
  draw(c);
}
