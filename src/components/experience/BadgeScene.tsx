"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { APPS } from "@/content/apps";
import StoryObjects from "./StoryObjects";
import { BACKDROP_FRAGMENT, FACE_FRAGMENT, FULLSCREEN_VERTEX, UV_VERTEX } from "./shaders";
import { HOVER_QUERY, input, isControl, toScreen } from "./interaction";

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
  sales: number; // 2018 sales app page and head-to-head card
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

// The face shader has four image slots, one per app, using each app's square badge image.
const SCREENSHOTS = APPS.slice(0, 4).map((app) => app.badge);

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

export function cssFont(variable: string) {
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

// Feeds the shared input object: pointer (mouse hover, or a fading pulse after a tap),
// scroll speed, and the cursor the objects ask for. Mounted first so it runs first each frame.
function InputTracker() {
  const pointer = useRef({ ndcX: 0, ndcY: 0, target: 0, lastScroll: 0 });

  useEffect(() => {
    const p = pointer.current;
    p.lastScroll = window.scrollY;
    const hover = window.matchMedia(HOVER_QUERY);
    const place = (event: PointerEvent) => {
      p.ndcX = (event.clientX / window.innerWidth) * 2 - 1;
      p.ndcY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !hover.matches) return;
      place(event);
      p.target = 1;
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      place(event);
      input.strength = 1;
      p.target = 0;
    };
    const onLeave = () => {
      p.target = 0;
    };
    const root = document.documentElement;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointerleave", onLeave);
      root.style.cursor = "";
      input.strength = 0;
      input.velocity = 0;
      input.cursor = {};
    };
  }, []);

  useFrame(({ viewport }, delta) => {
    const p = pointer.current;
    input.x = (p.ndcX * viewport.width) / 2;
    input.y = (-p.ndcY * viewport.height) / 2;
    // Hover eases in; a tap pulse fades over about a second.
    input.strength += (p.target - input.strength) * (1 - Math.exp(-delta * (p.target ? 6 : 2.5)));

    const scroll = window.scrollY;
    const speed = (scroll - p.lastScroll) / window.innerHeight / Math.max(delta, 1 / 240);
    p.lastScroll = scroll;
    input.velocity += (Math.max(-4, Math.min(4, speed)) - input.velocity) * (1 - Math.exp(-delta * 5));

    const cursor = Object.values(input.cursor).find(Boolean) ?? "";
    const root = document.documentElement;
    if (root.style.cursor !== cursor) root.style.cursor = cursor;
  });

  return null;
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
  const shots = useRef<(THREE.Texture | null)[]>([null, null, null, null]);
  const motion = useRef({
    enter: 0,
    spin: 0,
    pointerX: 0,
    pointerY: 0,
    targetX: 0,
    targetY: 0,
    // The visitor's own spin around the vertical axis: drag, click, or tap on phones.
    flip: 0,
    flipSpeed: 0,
    hover: 0,
    lean: 0,
  });
  // Where the badge is on screen (for hit tests), and the drag in progress.
  const hit = useRef({ x: 0, y: 0, r: 0, active: false });
  const drag = useRef({ on: false, lastX: 0, moved: 0, speed: 0, time: 0 });

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
      uShot3: { value: null },
      uShotAspect: { value: new THREE.Vector4(1, 1, 1, 1) },
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
    const m = motion.current;
    const d = drag.current;
    const onBadge = (event: MouseEvent) => {
      const h = hit.current;
      return h.active && !isControl(event.target) && Math.hypot(event.clientX - h.x, event.clientY - h.y) < h.r;
    };
    const onPointerMove = (event: PointerEvent) => {
      m.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      m.targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (event.pointerType === "mouse") input.cursor.badge = d.on ? "grabbing" : onBadge(event) ? "grab" : "";
      if (!d.on) return;
      const now = performance.now();
      const turn = (event.clientX - d.lastX) * 0.012;
      m.flip += turn;
      d.speed = turn / Math.max((now - d.time) / 1000, 1 / 120);
      d.moved += Math.abs(event.clientX - d.lastX);
      d.lastX = event.clientX;
      d.time = now;
    };
    // Mouse: drag to spin. On phones a swipe scrolls the page, so a tap flips the badge instead.
    const onPointerDown = (event: PointerEvent) => {
      d.moved = 0;
      if (event.pointerType !== "mouse" || event.button !== 0 || !onBadge(event)) return;
      event.preventDefault(); // no text selection while dragging
      Object.assign(d, { on: true, lastX: event.clientX, speed: 0, time: performance.now() });
      input.cursor.badge = "grabbing";
    };
    const onPointerUp = () => {
      if (!d.on) return;
      d.on = false;
      // Keep the flick's speed only if the pointer was still moving when released.
      m.flipSpeed = performance.now() - d.time < 80 ? d.speed : 0;
      input.cursor.badge = "grab";
    };
    const onClick = (event: MouseEvent) => {
      if (d.moved > 4 || !onBadge(event)) return;
      m.flipSpeed += TAU * 2.4; // about one full flip
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("click", onClick);
      delete input.cursor.badge;
    };
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
    // Too small to grab while it's the sales app logo or the 2021 lens hub.
    hit.current.active = group.visible && s.size > 0.25;
    if (!hit.current.active && input.cursor.badge) input.cursor.badge = "";
    if (!group.visible) return;

    m.enter += (1 - m.enter) * (1 - Math.exp(-delta * 2.2));
    m.pointerX += (m.targetX - m.pointerX) * ease;
    m.pointerY += (m.targetY - m.pointerY) * ease;

    // The visitor's spin coasts after a flick, then springs back to the nearest full turn.
    if (!drag.current.on) {
      if (Math.abs(m.flipSpeed) > 2.5) {
        m.flipSpeed *= Math.exp(-delta * 1.4);
      } else {
        const rest = Math.round(m.flip / TAU) * TAU;
        m.flipSpeed += ((rest - m.flip) * 40 - m.flipSpeed * 9) * delta;
      }
      m.flip += m.flipSpeed * delta;
    }
    // Lean back with the scroll, like a sign catching the wind.
    m.lean += (Math.max(-1, Math.min(1, input.velocity * 0.35)) - m.lean) * (1 - Math.exp(-delta * 3));

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
    // Hold still while parked as the sales app's logo, so it sits square in the page.
    const idle = (1 - record) * (1 - 0.85 * s.sales);
    m.hover += ((input.cursor.badge ? 1 : 0) - m.hover) * ease;
    const scale = radius * stamp * (0.72 + 0.28 * m.enter) * (1 + 0.045 * m.hover);
    group.position.set(s.x * viewport.width, s.y * viewport.height, 0);
    group.scale.setScalar(scale);
    group.rotation.set(
      s.tiltX + m.pointerY * 0.1 + Math.sin(time * 0.5) * 0.05 * idle - m.lean * 0.32 * idle,
      s.tiltY + m.pointerX * 0.16 + Math.sin(time * 0.35) * 0.16 * idle - (1 - m.enter) * 2.2 + m.flip,
      m.lean * 0.05 * idle
    );
    const screen = toScreen(group.position.x, group.position.y, viewport);
    Object.assign(hit.current, { x: screen.x, y: screen.y, r: scale * screen.scale });
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
      <InputTracker />
      <Backdrop state={state} />
      <StoryObjects state={state} />
      <Suspense fallback={null}>
        <Badge state={state} onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
