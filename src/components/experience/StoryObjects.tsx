"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree, type RootState } from "@react-three/fiber";
import * as THREE from "three";
import type { BadgeState } from "./BadgeScene";
import {
  DOT_FRAGMENT,
  LENS_VERTEX,
  NETWORK_VERTEX,
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

// 2018: the seal spreads into a national network of nodes.
function Network({ state, small }: ObjectProps) {
  const group = useRef<THREE.Group>(null);
  const dots = useRef<THREE.Points>(null);
  const links = useRef<THREE.LineSegments>(null);
  const pixelRatio = useThree((three) => three.viewport.dpr);

  const { points, lines, pointMaterial, lineMaterial } = useMemo(() => {
    const random = seededRandom(7);
    const count = small ? 40 : 70;
    const nodes = Array.from({ length: count }, () => {
      const angle = random() * TAU;
      const radius = Math.sqrt(random());
      return [Math.cos(angle) * radius, Math.sin(angle) * radius, (random() - 0.5) * 0.3];
    });

    const points = new THREE.BufferGeometry();
    points.setAttribute("position", new THREE.Float32BufferAttribute(nodes.flat(), 3));
    points.setAttribute("aSeed", new THREE.Float32BufferAttribute(nodes.map(() => random()), 1));

    // Connect each node to its two nearest neighbors.
    const segments: number[] = [];
    nodes.forEach((node, i) => {
      nodes
        .map((other, j) => ({ j, d: Math.hypot(other[0] - node[0], other[1] - node[1]) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => segments.push(...node, ...nodes[j]));
    });
    const lines = new THREE.BufferGeometry();
    lines.setAttribute("position", new THREE.Float32BufferAttribute(segments, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#6d9cf0",
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { points, lines, pointMaterial: dotMaterial(NETWORK_VERTEX, 7), lineMaterial };
  }, [small]);

  useEffect(() => () => {
    points.dispose();
    lines.dispose();
    pointMaterial.dispose();
    lineMaterial.dispose();
  }, [points, lines, pointMaterial, lineMaterial]);

  useFrame((root) => {
    const node = group.current;
    if (!node || !dots.current || !links.current) return;
    const s = state.current;
    node.visible = s.network > 0.001;
    if (!node.visible) return;

    const { x, y } = anchor(root, s);
    const { width, height } = root.viewport;
    node.position.set(x, y, 0);
    node.scale.set(width * (small ? 0.46 : 0.34) * s.network, height * (small ? 0.3 : 0.38) * s.network, 1);
    const { uniforms } = dots.current.material as THREE.ShaderMaterial;
    uniforms.uMix.value = s.network;
    uniforms.uTime.value = root.clock.elapsedTime;
    uniforms.uPixelRatio.value = pixelRatio;
    (links.current.material as THREE.LineBasicMaterial).opacity = 0.28 * s.network;
  });

  return (
    <group ref={group}>
      <lineSegments ref={links} geometry={lines} material={lineMaterial} />
      <points ref={dots} geometry={points} material={pointMaterial} />
    </group>
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

type IconDrawer = (context: CanvasRenderingContext2D) => void;

const ICONS: { background: string; draw: IconDrawer }[] = [
  {
    // Apps: </>
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
    // Music: two beamed notes
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
    // Art: a palette
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
];

function iconTexture({ background, draw }: (typeof ICONS)[number]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 512;
  const c = canvas.getContext("2d");
  if (c) {
    c.fillStyle = background;
    c.fillRect(0, 0, 512, 512);
    c.strokeStyle = c.fillStyle = "#f3e6c8";
    c.lineCap = c.lineJoin = "round";
    draw(c);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Now: the badge splits into app, music and art badges.
function Trio({ state }: ObjectProps) {
  const discs = useRef<(THREE.Mesh | null)[]>([]);

  const { geometry, materials } = useMemo(() => {
    // The cap texture comes out a quarter turn off once the cylinder faces the camera.
    const geometry = new THREE.CylinderGeometry(1, 1, 0.12, 64).rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
    const edge = new THREE.MeshBasicMaterial({ color: "#d4b06a" });
    const back = new THREE.MeshBasicMaterial({ color: "#0b1326" });
    const materials = ICONS.map((icon) => [
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
      disc.visible = s.trio > 0.001;
      if (!disc.visible) return;
      const offset = i - 1;
      disc.position.set(
        x + offset * unit * 0.26 * s.trio,
        y + Math.sin(time * 0.9 + i * 2) * unit * 0.02 + (offset === 0 ? unit * 0.06 : -unit * 0.03) * s.trio,
        0
      );
      disc.scale.setScalar(unit * 0.11 * s.trio);
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
      <Network state={state} small={small} />
      <Lens state={state} small={small} />
      <Trio state={state} small={small} />
    </>
  );
}
