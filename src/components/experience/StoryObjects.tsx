"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import { cssFont, type BadgeState } from "./BadgeScene";
import { stateFor } from "./keyframes";
import { CREATOR_ICONS, drawCreatorIcon, type CreatorIcon } from "./creatorIcons";
import {
  DOT_FRAGMENT,
  LENS_VERTEX,
  PANEL_FRAGMENT,
  UV_VERTEX,
  WINDOW_FRAGMENT,
  WINDOW_VERTEX,
} from "./shaders";

type ObjectProps = { state: RefObject<BadgeState>; small: boolean };

const TAU = Math.PI * 2;
const placement = new THREE.Object3D();

// Deterministic random numbers, so layouts are the same on every visit.
function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The badge's center in world units, and the viewport's short side.
function anchor({ viewport }: RootState, s: BadgeState) {
  return {
    x: s.x * viewport.width,
    y: s.y * viewport.height,
    unit: Math.min(viewport.width, viewport.height),
  };
}

function dotMaterial(vertexShader: string, size: number) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: DOT_FRAGMENT,
    uniforms: {
      uMix: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// 2005: the record shatters into app windows.
function Windows({ state, small }: ObjectProps) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = small ? 14 : 24;

  const { geometry, material, layout } = useMemo(() => {
    const random = seededRandom(5);
    const layout = Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * TAU + random() * 0.4,
      radius: 0.4 + 0.6 * Math.sqrt(random()),
      depth: random() - 0.5,
      turn: random() - 0.5,
      scale: 0.6 + 0.5 * random(),
      seed: random(),
    }));
    const geometry = new THREE.PlaneGeometry(1.4, 1);
    geometry.setAttribute(
      "aTint",
      new THREE.InstancedBufferAttribute(Float32Array.from(layout, (_, i) => i % 3), 1)
    );
    geometry.setAttribute(
      "aSeed",
      new THREE.InstancedBufferAttribute(Float32Array.from(layout, (item) => item.seed), 1)
    );
    const material = new THREE.ShaderMaterial({
      vertexShader: WINDOW_VERTEX,
      fragmentShader: WINDOW_FRAGMENT,
      uniforms: { uMix: { value: 0 } },
      transparent: true,
      depthWrite: false,
    });
    return { geometry, material, layout };
  }, [count]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((root) => {
    const instances = mesh.current;
    if (!instances) return;
    const s = state.current;
    instances.visible = s.windows > 0.001;
    if (!instances.visible) return;

    const { x, y, unit } = anchor(root, s);
    const time = root.clock.elapsedTime;
    const spread = unit * 0.44 * s.windows;
    (instances.material as THREE.ShaderMaterial).uniforms.uMix.value = s.windows;

    layout.forEach((item, i) => {
      placement.position.set(
        x + Math.cos(item.angle) * item.radius * spread * 1.15 + Math.sin(time * 0.6 + item.seed * 9) * unit * 0.02,
        y + Math.sin(item.angle) * item.radius * spread * 0.75 + Math.cos(time * 0.5 + item.seed * 7) * unit * 0.02,
        item.depth * s.windows
      );
      placement.rotation.set(0, item.turn * 0.6, item.turn * 0.3);
      placement.scale.setScalar(unit * 0.15 * item.scale * (0.3 + 0.7 * s.windows));
      placement.updateMatrix();
      instances.setMatrixAt(i, placement.matrix);
    });
    instances.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}

// 2018: the seal lands as the logo of the sales app, beside a head-to-head card.
// Drawn in the same wireframe style as the 2005 windows. Labels stay generic (NDA).
const INK = "#f3e6c8";
const LINE = "rgba(140, 158, 204, 0.85)";
const HEX = { gold: "#d4b06a", blue: "#6d9cf0", crimson: "#e57888" };

// Panel sizes in units of the viewport's short side. The page's logo slot sits
// LOGO_SLOT of the way down the page, which is where the badge parks.
const PAGE = { width: 0.5, height: 0.62 };
const CARD = { width: 0.36, height: 0.44 };
const LOGO_SLOT = 0.242;
const LOGO_RADIUS = 0.17; // of the page width, matches the badge size in keyframes.ts

function bar(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  c.fillStyle = color;
  c.beginPath();
  c.roundRect(x, y, w, h, h / 2);
  c.fill();
}

function panelFrame(c: CanvasRenderingContext2D, tint: string, title: string) {
  const { width: w, height: h } = c.canvas;
  const mono = cssFont("--font-jetbrains-mono");
  c.clearRect(0, 0, w, h);
  c.fillStyle = "rgba(10, 18, 38, 0.94)";
  c.beginPath();
  c.roundRect(4, 4, w - 8, h - 8, w * 0.04);
  c.fill();
  c.save();
  c.clip();
  c.globalAlpha = 0.55;
  c.fillStyle = tint;
  c.fillRect(0, 0, w, h * 0.07);
  c.restore();
  for (let i = 0; i < 3; i++) {
    c.fillStyle = "#e6e6e6";
    c.beginPath();
    c.arc(w * 0.05 + i * w * 0.035, h * 0.035, w * 0.011, 0, TAU);
    c.fill();
  }
  c.fillStyle = INK;
  c.font = `500 ${Math.round(h * 0.028)}px ${mono}, monospace`;
  c.textBaseline = "middle";
  c.fillText(title, w * 0.18, h * 0.036);
  c.strokeStyle = tint;
  c.lineWidth = 3;
  c.shadowColor = tint;
  c.shadowBlur = 14;
  c.beginPath();
  c.roundRect(4, 4, w - 8, h - 8, w * 0.04);
  c.stroke();
  c.shadowBlur = 0;
  return mono;
}

// An infographic page with a slot at the top for the logo.
function drawPage(c: CanvasRenderingContext2D) {
  const { width: w, height: h } = c.canvas;
  const mono = panelFrame(c, HEX.gold, "sales-app / leaderboard");

  c.setLineDash([10, 10]);
  c.strokeStyle = "rgba(212, 176, 106, 0.6)";
  c.lineWidth = 3;
  c.beginPath();
  c.arc(w / 2, h * LOGO_SLOT, w * LOGO_RADIUS + 16, 0, TAU);
  c.stroke();
  c.setLineDash([]);

  bar(c, w * 0.28, h * 0.415, w * 0.44, h * 0.022, INK);
  bar(c, w * 0.34, h * 0.448, w * 0.32, h * 0.013, LINE);

  // KPI tiles
  [HEX.gold, HEX.blue, HEX.crimson].forEach((tint, i) => {
    const x = w * (0.06 + i * 0.305);
    const tileW = w * 0.27;
    c.strokeStyle = tint;
    c.lineWidth = 2;
    c.beginPath();
    c.roundRect(x, h * 0.49, tileW, h * 0.1, 10);
    c.stroke();
    bar(c, x + tileW * 0.12, h * 0.513, tileW * (0.45 + i * 0.1), h * 0.03, tint);
    c.fillStyle = LINE;
    c.font = `500 ${Math.round(h * 0.018)}px ${mono}, monospace`;
    c.fillText(["CALLS", "DEALS", "REVENUE"][i], x + tileW * 0.12, h * 0.574);
  });

  // Bar chart
  const left = w * 0.06;
  const bottom = h * 0.86;
  const chartH = h * 0.2;
  c.strokeStyle = "rgba(140, 158, 204, 0.4)";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(left, bottom);
  c.lineTo(w * 0.62, bottom);
  c.stroke();
  [0.35, 0.55, 0.45, 0.7, 0.6, 0.85, 0.75].forEach((value, i) => {
    c.fillStyle = i === 5 ? HEX.gold : HEX.blue;
    c.globalAlpha = i === 5 ? 1 : 0.75;
    c.beginPath();
    c.roundRect(left + w * 0.015 + i * w * 0.077, bottom - chartH * value, w * 0.05, chartH * value, 6);
    c.fill();
  });
  c.globalAlpha = 1;

  // Donut chart
  c.lineWidth = w * 0.045;
  let start = -Math.PI / 2;
  ([[HEX.gold, 0.45], [HEX.blue, 0.3], [HEX.crimson, 0.25]] as const).forEach(([tint, share]) => {
    c.strokeStyle = tint;
    c.beginPath();
    c.arc(w * 0.81, h * 0.755, w * 0.1, start + 0.06, start + share * TAU - 0.06);
    c.stroke();
    start += share * TAU;
  });

  // Leaderboard rows
  [0.9, 0.94].forEach((y, i) => {
    c.fillStyle = i ? HEX.blue : HEX.gold;
    c.beginPath();
    c.arc(w * 0.08, h * y, h * 0.011, 0, TAU);
    c.fill();
    bar(c, w * 0.12, h * y - h * 0.007, w * (0.5 - i * 0.12), h * 0.014, LINE);
  });
}

// Two rep profiles compared stat by stat.
function drawCard(c: CanvasRenderingContext2D) {
  const { width: w, height: h } = c.canvas;
  const mono = panelFrame(c, HEX.blue, "HEAD TO HEAD");

  [[0.25, HEX.blue, "REP A"], [0.75, HEX.crimson, "REP B"]].forEach(([fx, ring, name]) => {
    const cx = w * (fx as number);
    const cy = h * 0.24;
    const r = w * 0.12;
    c.save();
    c.beginPath();
    c.arc(cx, cy, r, 0, TAU);
    c.clip();
    c.fillStyle = "rgba(140, 158, 204, 0.6)";
    c.beginPath();
    c.arc(cx, cy - r * 0.18, r * 0.36, 0, TAU);
    c.fill();
    c.beginPath();
    c.ellipse(cx, cy + r * 0.85, r * 0.7, r * 0.55, 0, 0, TAU);
    c.fill();
    c.restore();
    c.strokeStyle = ring as string;
    c.lineWidth = 6;
    c.beginPath();
    c.arc(cx, cy, r, 0, TAU);
    c.stroke();
    c.fillStyle = INK;
    c.font = `600 ${Math.round(h * 0.03)}px ${mono}, monospace`;
    c.textAlign = "center";
    c.fillText(name as string, cx, h * 0.37);
    bar(c, cx - w * 0.09, h * 0.395, w * 0.18, h * 0.012, LINE);
  });

  c.fillStyle = HEX.gold;
  c.font = `800 ${Math.round(h * 0.075)}px ${cssFont("--font-sora")}, sans-serif`;
  c.fillText("VS", w / 2, h * 0.245);

  const stats: [string, number, number][] = [
    ["CALLS", 0.8, 0.65],
    ["DEALS", 0.6, 0.75],
    ["REVENUE", 0.9, 0.7],
    ["STREAK", 0.55, 0.85],
  ];
  stats.forEach(([label, a, b], i) => {
    const y = h * (0.49 + i * 0.105);
    c.fillStyle = LINE;
    c.font = `500 ${Math.round(h * 0.024)}px ${mono}, monospace`;
    c.fillText(label, w / 2, y);
    const span = w * 0.38;
    bar(c, w / 2 - w * 0.02 - span * a, y + h * 0.025, span * a, h * 0.02, HEX.blue);
    bar(c, w / 2 + w * 0.02, y + h * 0.025, span * b, h * 0.02, HEX.crimson);
  });
  c.textAlign = "left";
}

function panelTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 8;
  return texture;
}

function panelMaterial(texture: THREE.Texture, tint: [number, number, number]) {
  return new THREE.ShaderMaterial({
    vertexShader: UV_VERTEX,
    fragmentShader: PANEL_FRAGMENT,
    uniforms: {
      uMap: { value: texture },
      uMix: { value: 0 },
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uTint: { value: new THREE.Vector3(...tint) },
    },
    transparent: true,
    depthWrite: false,
  });
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function SalesApp({ state, small }: ObjectProps) {
  const page = useRef<THREE.Mesh>(null);
  const card = useRef<THREE.Mesh>(null);

  const { pageTexture, cardTexture, pageGeometry, cardGeometry, pageMaterial, cardMaterial } = useMemo(() => {
    const pageTexture = panelTexture(768, 952);
    const cardTexture = panelTexture(576, 704);
    return {
      pageTexture,
      cardTexture,
      pageGeometry: new THREE.PlaneGeometry(PAGE.width, PAGE.height),
      cardGeometry: new THREE.PlaneGeometry(CARD.width, CARD.height),
      pageMaterial: panelMaterial(pageTexture, [0.831, 0.69, 0.416]),
      cardMaterial: panelMaterial(cardTexture, [0.427, 0.612, 0.941]),
    };
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => {
      const pageContext = (pageTexture.image as HTMLCanvasElement).getContext("2d");
      const cardContext = (cardTexture.image as HTMLCanvasElement).getContext("2d");
      if (pageContext) drawPage(pageContext);
      if (cardContext) drawCard(cardContext);
      pageTexture.needsUpdate = true;
      cardTexture.needsUpdate = true;
    });
    return () => {
      [pageTexture, cardTexture, pageGeometry, cardGeometry, pageMaterial, cardMaterial].forEach((item) => item.dispose());
    };
  }, [pageTexture, cardTexture, pageGeometry, cardGeometry, pageMaterial, cardMaterial]);

  useFrame((root) => {
    if (!page.current || !card.current) return;
    const s = state.current;
    const visible = s.sales > 0.001;
    page.current.visible = card.current.visible = visible;
    if (!visible) return;

    // Panels stay put around the logo slot while the seal flies in to fill it.
    const slot = stateFor("scale", !small);
    const { width, height } = root.viewport;
    const x = slot.x * width;
    const y = slot.y * height;
    const unit = Math.min(width, height);
    const time = root.clock.elapsedTime;
    // The page draws in once the seal is on its way and the card follows;
    // scrolling back erases the card first, then the page.
    const panels: [THREE.Mesh, number, number, number, number, number][] = [
      [page.current, clamp01((s.sales - 0.3) / 0.55), 0, (0.5 - LOGO_SLOT) * PAGE.height, -0.12, -0.1],
      [card.current, clamp01((s.sales - 0.55) / 0.45), 0.43, (0.5 - LOGO_SLOT) * PAGE.height + 0.1, -0.04, 0.12],
    ];
    panels.forEach(([mesh, reveal, offsetX, offsetY, depth, turn], i) => {
      const settle = 1 - Math.pow(1 - reveal, 3);
      mesh.position.set(
        x + offsetX * unit,
        y - offsetY * unit + Math.sin(time * 0.6 + i * 2) * unit * 0.006 * settle,
        depth
      );
      mesh.scale.setScalar(unit * (0.88 + 0.12 * settle));
      mesh.rotation.set(0, turn * settle, 0);
      const { uniforms } = mesh.material as THREE.ShaderMaterial;
      uniforms.uReveal.value = reveal;
      uniforms.uMix.value = Math.min(1, reveal * 4);
      uniforms.uTime.value = time;
    });
  });

  return (
    <>
      <mesh ref={page} geometry={pageGeometry} material={pageMaterial} />
      <mesh ref={card} geometry={cardGeometry} material={cardMaterial} />
    </>
  );
}

// 2021: a lens of moving particles around the badge.
function Lens({ state, small }: ObjectProps) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<THREE.Points>(null);
  const pixelRatio = useThree((three) => three.viewport.dpr);

  const { geometry, material } = useMemo(() => {
    const random = seededRandom(11);
    const count = small ? 1000 : 1800;
    const radius = new Float32Array(count);
    const angle = new Float32Array(count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Half the particles crowd into an iris band; the rest fill the disc.
      radius[i] = i % 2 ? 0.42 + random() * 0.12 : 0.22 + Math.sqrt(random()) * 0.78;
      angle[i] = random() * TAU;
      seed[i] = random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
    geometry.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return { geometry, material: dotMaterial(LENS_VERTEX, 3) };
  }, [small]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((root) => {
    const node = group.current;
    if (!node || !dots.current) return;
    const s = state.current;
    node.visible = s.lens > 0.001;
    if (!node.visible) return;

    const { x, y, unit } = anchor(root, s);
    node.position.set(x, y, 0);
    node.scale.setScalar(unit * (small ? 0.44 : 0.42));
    const { uniforms } = dots.current.material as THREE.ShaderMaterial;
    uniforms.uMix.value = s.lens;
    uniforms.uTime.value = root.clock.elapsedTime;
    uniforms.uPixelRatio.value = pixelRatio;
  });

  return (
    <group ref={group}>
      <points ref={dots} geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

function iconTexture(icon: CreatorIcon) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  drawCreatorIcon(canvas, icon);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Staggered 2 × 2 cluster around the anchor, in units of the viewport's short side.
const CLUSTER = [
  [-0.15, 0.13],
  [0.13, 0.17],
  [-0.13, -0.13],
  [0.15, -0.09],
];

// Now: the badge splits into app, music, art and video badges. On phones the
// chapter shows tappable buttons instead (CreatorButtons.tsx), so these hide.
function Trio({ state, small }: ObjectProps) {
  const discs = useRef<(THREE.Mesh | null)[]>([]);

  const { geometry, materials } = useMemo(() => {
    // The cap texture comes out a quarter turn off once the cylinder faces the camera.
    const geometry = new THREE.CylinderGeometry(1, 1, 0.12, 64).rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
    const edge = new THREE.MeshBasicMaterial({ color: "#d4b06a" });
    const back = new THREE.MeshBasicMaterial({ color: "#0b1326" });
    const materials = CREATOR_ICONS.map((icon) => [
      edge,
      new THREE.MeshBasicMaterial({ map: iconTexture(icon) }),
      back,
    ]);
    return { geometry, materials };
  }, []);

  useEffect(() => () => {
    geometry.dispose();
    materials.flat().forEach((material) => {
      (material as THREE.MeshBasicMaterial).map?.dispose();
      material.dispose();
    });
  }, [geometry, materials]);

  useFrame((root) => {
    const s = state.current;
    const { x, y, unit } = anchor(root, s);
    const time = root.clock.elapsedTime;
    discs.current.forEach((disc, i) => {
      if (!disc) return;
      disc.visible = !small && s.trio > 0.001;
      if (!disc.visible) return;
      const [dx, dy] = CLUSTER[i];
      disc.position.set(
        x + dx * unit * s.trio,
        y + dy * unit * s.trio + Math.sin(time * 0.9 + i * 2) * unit * 0.015,
        0
      );
      disc.scale.setScalar(unit * 0.095 * s.trio);
      disc.rotation.set(Math.sin(time * 0.6 + i) * 0.15, (1 - s.trio) * Math.PI + Math.sin(time * 0.5 + i) * 0.25, 0);
    });
  });

  return (
    <>
      {materials.map((material, i) => (
        <mesh
          key={i}
          ref={(disc) => {
            discs.current[i] = disc;
          }}
          geometry={geometry}
          material={material}
        />
      ))}
    </>
  );
}

export default function StoryObjects({ state }: { state: RefObject<BadgeState> }) {
  const small = useThree((three) => three.size.width < 768);
  return (
    <>
      <Windows state={state} small={small} />
      <SalesApp state={state} small={small} />
      <Lens state={state} small={small} />
      <Trio state={state} small={small} />
    </>
  );
}
