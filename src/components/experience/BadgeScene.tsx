"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { APPS } from "@/content/apps";
import StoryObjects from "./StoryObjects";
import { BACKDROP_FRAGMENT, FACE_FRAGMENT, FULLSCREEN_VERTEX, UV_VERTEX } from "./shaders";

// Every value is tweened by scroll; see keyframes.ts for each chapter's state.
export type BadgeState = {
  code: number; // rings of code
  vinyl: number; // vinyl grooves
  coin: number; // gold coin
  seal: number; // company seal
  work: number; // app screenshots
  shot: number; // which app (fractional while crossfading)
  label: number; // logo radius on the face; 0 hides it
  harbor: number; // night harbor backdrop
  windows: number; // 2005 app windows
  network: number; // 2018 network
  lens: number; // 2021 particle lens
  trio: number; // app, music and art badges
  x: number; // fraction of viewport width from center
  y: number; // fraction of viewport height from center
  size: number; // diameter as a fraction of the viewport's short side
  tiltX: number;
  tiltY: number;
};

type SceneProps = {
  state: RefObject<BadgeState>;
  onReady: () => void;
};

// Replace this one file to change the badge face.
const FACE_IMAGE = "/badge-face.webp";

// The face shader has three screenshot slots, then an NDA treatment for the
// fourth app. Keep apps with screenshots first in src/content/apps.ts.
const SCREENSHOTS = APPS.slice(0, 3).map((app) => (app.nda ? undefined : app.image));

const TAU = Math.PI * 2;
const RING_ROWS = 12;
const THICKNESS = 0.045;
const GOLD = new THREE.Color("#d4b06a");
const RECORD_EDGE = new THREE.Color("#0b0c12");

const CODE_LINES = [
  "<table bgcolor='#0b1326' width='100%'><tr><td align='center'>",
  "function play(track) { deck.load(track); deck.cue(0); return deck.start(); }",
  "SELECT title, bpm FROM crates WHERE crowd = 'ready' ORDER BY energy DESC;",
  "for (var i = 0; i < setlist.length; i++) { mix(setlist[i], setlist[i + 1]); }",
  "#!/usr/bin/perl  print \"Content-type: text/html\\n\\n\";",
  "const room = await read(crowd); if (room.energy < peak) next.drop();",
];

const SEAL_TEXT = "DAVENTERTAINMENT INC  ·  ESTABLISHED 2016  ·  ENTERTAINMENT & WEB DEVELOPMENT  ·  ";

function cssFont(variable: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(variable);
}

function drawCodeStrip(context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;
  const rowHeight = height / RING_ROWS;
  context.font = `500 ${Math.round(rowHeight * 0.68)}px ${cssFont("--font-jetbrains-mono")}, monospace`;
  for (let row = 0; row < RING_ROWS; row++) {
    let x = -row * 37;
    let line = row;
    while (x < width) {
      const text = `${CODE_LINES[line % CODE_LINES.length]}   `;
      context.fillText(text, x, (row + 0.5) * rowHeight);
      x += context.measureText(text).width;
      line++;
    }
  }
}

// One row of lettering, stretched so a whole number of repeats wraps seamlessly.
function drawSealStrip(context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;
  context.font = `700 ${Math.round(height * 0.62)}px ${cssFont("--font-sora")}, sans-serif`;
  const textWidth = context.measureText(SEAL_TEXT).width;
  const repeats = Math.max(1, Math.round(width / textWidth));
  context.setTransform(width / (repeats * textWidth), 0, 0, 1, 0, 0);
  for (let i = 0; i < repeats; i++) context.fillText(SEAL_TEXT, i * textWidth, height / 2);
}

function useStripTexture(width: number, height: number, draw: (c: CanvasRenderingContext2D) => void) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const strip = new THREE.CanvasTexture(canvas);
    strip.wrapS = THREE.RepeatWrapping;
    strip.minFilter = THREE.LinearMipmapLinearFilter;
    strip.anisotropy = 8;
    return strip;
  }, [width, height]);

  useEffect(() => {
    const context = (texture.image as HTMLCanvasElement).getContext("2d");
    document.fonts.ready.then(() => {
      if (!context) return;
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "#fff";
      context.textBaseline = "middle";
      draw(context);
      texture.needsUpdate = true;
    });
    return () => texture.dispose();
  }, [texture, width, height, draw]);

  return texture;
}

function Backdrop({ state }: Pick<SceneProps, "state">) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHarbor: { value: 0 },
      uPulse: { value: 0 },
      uAspect: { value: 1 },
      uBadge: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    []
  );

  useFrame(({ clock, viewport }) => {
    const shader = material.current;
    if (!shader) return;
    const { harbor, seal, x, y } = state.current;
    shader.uniforms.uTime.value = clock.elapsedTime;
    shader.uniforms.uHarbor.value = harbor;
    shader.uniforms.uPulse.value = seal;
    shader.uniforms.uAspect.value = viewport.aspect;
    shader.uniforms.uBadge.value.set(0.5 + x, 0.5 + y);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={FULLSCREEN_VERTEX}
        fragmentShader={BACKDROP_FRAGMENT}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function Badge({ state, onReady }: SceneProps) {
  const gl = useThree((three) => three.gl);
  const logo = useLoader(THREE.TextureLoader, FACE_IMAGE);
  const code = useStripTexture(4096, 512, drawCodeStrip);
  const sealText = useStripTexture(4096, 128, drawSealStrip);
  const tilt = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const face = useRef<THREE.ShaderMaterial>(null);
  const rim = useRef<THREE.MeshStandardMaterial>(null);
  const shots = useRef<(THREE.Texture | null)[]>([null, null, null]);
  const motion = useRef({ enter: 0, spin: 0, pointerX: 0, pointerY: 0, targetX: 0, targetY: 0 });

  const edge = useMemo(() => {
    const t = THICKNESS;
    const profile = [
      [0, -t],
      [0.975, -t],
      [1, -t * 0.4],
      [1, t * 0.4],
      [0.975, t],
      [0, t],
    ].map(([radius, height]) => new THREE.Vector2(radius, height));
    return new THREE.LatheGeometry(profile, 128).rotateX(Math.PI / 2);
  }, []);

  const uniforms = useMemo(
    () => ({
      uLogo: { value: logo },
      uCode: { value: code },
      uSealText: { value: sealText },
      uShot0: { value: null },
      uShot1: { value: null },
      uShot2: { value: null },
      uShotAspect: { value: new THREE.Vector3(1, 1, 1) },
      uShot: { value: 0 },
      uTime: { value: 0 },
      uCodeMix: { value: 0 },
      uVinyl: { value: 0 },
      uCoin: { value: 0 },
      uSealMix: { value: 0 },
      uWork: { value: 0 },
      uLabel: { value: 1 },
      uSpin: { value: 0 },
      uTilt: { value: 0 },
      uRows: { value: RING_ROWS },
    }),
    [logo, code, sealText]
  );

  useEffect(() => {
    if (!rim.current) return;
    const generator = new THREE.PMREMGenerator(gl);
    const environment = generator.fromScene(new RoomEnvironment(), 0.04);
    rim.current.envMap = environment.texture;
    rim.current.needsUpdate = true;
    return () => {
      environment.dispose();
      generator.dispose();
    };
  }, [gl]);

  // Screenshots load after the badge appears; they aren't needed until The Work.
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const loaded: THREE.Texture[] = [];
    const slots = shots.current;
    SCREENSHOTS.forEach((src, i) => {
      if (!src) return;
      loader.load(src, (texture) => {
        loaded.push(texture);
        slots[i] = texture;
      });
    });
    return () => loaded.forEach((texture) => texture.dispose());
  }, []);

  useEffect(() => {
    onReady();
    const onPointerMove = (event: PointerEvent) => {
      motion.current.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      motion.current.targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [onReady]);

  useFrame(({ clock, viewport }, delta) => {
    const group = tilt.current;
    const spinGroup = spinner.current;
    const shader = face.current;
    const edgeMaterial = rim.current;
    if (!group || !spinGroup || !shader || !edgeMaterial) return;

    const s = state.current;
    const m = motion.current;
    const time = clock.elapsedTime;
    const ease = 1 - Math.exp(-delta * 4);

    group.visible = s.size > 0.003;
    if (!group.visible) return;

    m.enter += (1 - m.enter) * (1 - Math.exp(-delta * 2.2));
    m.pointerX += (m.targetX - m.pointerX) * ease;
    m.pointerY += (m.targetY - m.pointerY) * ease;

    // The record spins up with the vinyl state and settles upright when it reverses.
    const record = s.vinyl * (1 - s.coin);
    m.spin += delta * 1.9 * record;
    if (record < 0.02) {
      const upright = Math.round(m.spin / TAU) * TAU;
      m.spin += (upright - m.spin) * ease;
    }

    // The seal "stamps": a quick dip in size while it arrives.
    const stamp = 1 - 0.16 * Math.sin(Math.PI * s.seal);
    const radius = (s.size * Math.min(viewport.width, viewport.height)) / 2;
    const idle = 1 - record;
    group.position.set(s.x * viewport.width, s.y * viewport.height, 0);
    group.scale.setScalar(radius * stamp * (0.72 + 0.28 * m.enter));
    group.rotation.set(
      s.tiltX + m.pointerY * 0.1 + Math.sin(time * 0.5) * 0.05 * idle,
      s.tiltY + m.pointerX * 0.16 + Math.sin(time * 0.35) * 0.16 * idle - (1 - m.enter) * 2.2,
      0
    );
    spinGroup.rotation.z = -m.spin;
    spinGroup.scale.z = 1 - 0.7 * record; // a coin is thick, a record is not

    const u = shader.uniforms;
    u.uTime.value = time;
    u.uCodeMix.value = s.code;
    u.uVinyl.value = s.vinyl;
    u.uCoin.value = s.coin;
    u.uSealMix.value = s.seal;
    u.uWork.value = s.work;
    u.uShot.value = s.shot;
    u.uLabel.value = s.label;
    u.uSpin.value = m.spin;
    u.uTilt.value = group.rotation.y;
    shots.current.forEach((texture, i) => {
      if (!texture) return;
      u[`uShot${i}` as "uShot0"].value = texture;
      const image = texture.image as HTMLImageElement;
      u.uShotAspect.value.setComponent(i, image.width / image.height);
    });
    edgeMaterial.color.lerpColors(GOLD, RECORD_EDGE, record);
    edgeMaterial.roughness = 0.28 + 0.2 * record;
  });

  return (
    <group ref={tilt}>
      <group ref={spinner}>
        <mesh geometry={edge}>
          <meshStandardMaterial ref={rim} metalness={1} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, THICKNESS + 0.001]}>
          <circleGeometry args={[0.975, 128]} />
          <shaderMaterial
            ref={face}
            vertexShader={UV_VERTEX}
            fragmentShader={FACE_FRAGMENT}
            uniforms={uniforms}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function BadgeScene({ state, onReady }: SceneProps) {
  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Backdrop state={state} />
      <StoryObjects state={state} />
      <Suspense fallback={null}>
        <Badge state={state} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
