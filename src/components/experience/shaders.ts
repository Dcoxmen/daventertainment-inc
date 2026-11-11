export const UV_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const FULLSCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`;

const PALETTE = /* glsl */ `
  const float TAU = 6.28318530718;
  const vec3 GOLD = vec3(0.831, 0.690, 0.416);
  const vec3 BLUE = vec3(0.427, 0.612, 0.941);
  const vec3 CRIMSON = vec3(0.898, 0.471, 0.533);
`;

const NOISE = /* glsl */ `
  float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash2(i), hash2(i + vec2(1.0, 0.0)), f.x),
      mix(hash2(i + vec2(0.0, 1.0)), hash2(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
`;

// One disc, many looks, layered in story order: rings of code, vinyl grooves,
// a gold coin, the company seal, and app screenshots. The logo sits on top at
// whatever size uLabel gives it.
export const FACE_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uLogo;
  uniform sampler2D uCode;
  uniform sampler2D uSealText;
  uniform sampler2D uShot0;
  uniform sampler2D uShot1;
  uniform sampler2D uShot2;
  uniform sampler2D uShot3;
  uniform vec4 uShotAspect;
  uniform float uShot;
  uniform float uTime;
  uniform float uCodeMix;
  uniform float uVinyl;
  uniform float uCoin;
  uniform float uSealMix;
  uniform float uWork;
  uniform float uLabel;
  uniform float uSpin;
  uniform float uTilt;
  uniform float uRows;

  const float INNER = 0.36;
  const float OUTER = 0.96;

  ${PALETTE}
  ${NOISE}

  // Picks the unwrapped coordinate without a jump, so the atan seam never shows.
  float seamless(float u) {
    float a = fract(u);
    float b = fract(u + 0.5) - 0.5;
    return fwidth(a) < fwidth(b) + 0.0001 ? a : b;
  }

  // Fills the disc with an image, cropping whichever side is longer.
  vec3 cover(sampler2D image, float aspect, vec2 p) {
    vec2 uv = p * 0.5;
    if (aspect > 1.0) uv.x /= aspect; else uv.y *= aspect;
    return texture2D(image, uv + 0.5).rgb;
  }

  vec3 shotColor(float index, vec2 p) {
    if (index < 0.5) return cover(uShot0, uShotAspect.x, p);
    if (index < 1.5) return cover(uShot1, uShotAspect.y, p);
    if (index < 2.5) return cover(uShot2, uShotAspect.z, p);
    return cover(uShot3, uShotAspect.w, p);
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float angle = atan(p.y, p.x);

    // Rings of code
    float ring = clamp((r - INNER) / (OUTER - INNER), 0.0, 0.9999);
    float row = floor(ring * uRows);
    float direction = mod(row, 2.0) * 2.0 - 1.0;
    float drift = (0.012 + 0.03 * hash(row + 3.0)) * direction * (1.0 - uVinyl);
    float u = seamless(-angle / TAU + drift * uTime + hash(row));
    vec2 stripUv = vec2(u, ring);
    float ink = texture2D(uCode, stripUv).r;
    float glow = texture2D(uCode, stripUv, 3.5).r;

    float pick = hash(row + 11.0);
    vec3 inkColor = pick < 0.5 ? GOLD : (pick < 0.85 ? BLUE : CRIMSON);
    float sweep = pow(0.5 + 0.5 * cos(angle - uTime * 0.7 + row * 0.35), 10.0);
    float wipe = smoothstep(0.0, 0.14, uCodeMix * 1.2 - ring);
    vec3 codeColor = vec3(0.014, 0.03, 0.075);
    codeColor += inkColor * (ink * (0.62 + 1.1 * sweep) + glow * 0.5) * wipe;

    // Vinyl grooves
    float groovePhase = r * 380.0;
    float grooveFade = 1.0 - smoothstep(0.25, 0.7, fwidth(groovePhase) / TAU);
    float groove = 0.5 + 0.5 * sin(groovePhase);
    float band = smoothstep(0.0, 0.012, abs(fract(ring * 5.0) - 0.5) - 0.012);
    vec3 vinylColor = vec3(0.022, 0.024, 0.034) * (0.75 + 0.5 * groove * grooveFade) * (0.6 + 0.4 * band);
    float worldAngle = angle + uSpin;
    float sheen = pow(abs(cos(worldAngle - 0.9)), 26.0);
    float warm = pow(abs(cos(worldAngle + 0.55)), 60.0);
    vinylColor += vec3(0.62, 0.68, 0.86) * sheen * 0.3 * (0.6 + 0.4 * groove * grooveFade);
    vinylColor += GOLD * warm * 0.22;
    // The last of the code stays pressed into the grooves as the record arrives.
    vinylColor += inkColor * ink * 0.05;

    vec3 color = mix(codeColor, vinylColor, uVinyl);

    // Gold coin with a raised bead near the edge
    float coinPhase = r * 520.0;
    float coinFade = 1.0 - smoothstep(0.25, 0.7, fwidth(coinPhase) / TAU);
    float shine = 0.5 + 0.5 * cos(angle * 2.0 - uTilt * 2.0 + 0.6);
    vec3 coin = mix(vec3(0.42, 0.3, 0.13), vec3(0.96, 0.83, 0.55), 0.3 + 0.6 * shine);
    coin *= 0.93 + 0.07 * (0.5 + 0.5 * sin(coinPhase)) * coinFade;
    float bead = smoothstep(0.86, 0.87, r) * (1.0 - smoothstep(0.9, 0.91, r));
    coin += vec3(0.22, 0.17, 0.08) * bead;
    color = mix(color, coin, uCoin);

    // Company seal: navy center, crimson band with lettering, gold borders
    float sealBand = step(0.74, r);
    vec3 seal = mix(vec3(0.03, 0.06, 0.15), vec3(0.3, 0.05, 0.1), sealBand);
    float sealV = clamp((r - 0.765) / 0.17, 0.0, 0.999);
    float lettering = texture2D(uSealText, vec2(seamless(-angle / TAU + uTime * 0.008), sealV)).r;
    seal += GOLD * lettering * sealBand;
    float borders = smoothstep(0.012, 0.0, abs(r - 0.74)) + smoothstep(0.012, 0.0, abs(r - 0.955));
    seal = mix(seal, GOLD, clamp(borders, 0.0, 1.0));
    color = mix(color, seal, uSealMix);

    // App screenshots, crossfading as uShot moves between apps
    float first = floor(uShot);
    vec3 shot = mix(
      shotColor(first, p),
      shotColor(first + 1.0, p),
      smoothstep(0.0, 1.0, fract(uShot))
    );
    shot *= 1.0 - 0.35 * smoothstep(0.7, 1.0, r);
    color = mix(color, shot, uWork);

    // Logo, sized by uLabel; on the coin it reads as embossed gold
    if (uLabel > 0.001) {
      vec4 logo = texture2D(uLogo, (p / uLabel) * 0.5 + 0.5);
      float inside = 1.0 - smoothstep(uLabel - 0.006, uLabel, r);
      float lum = dot(logo.rgb, vec3(0.3, 0.59, 0.11));
      vec3 embossed = mix(vec3(0.45, 0.33, 0.15), vec3(1.0, 0.88, 0.6), lum);
      vec3 labelColor = mix(logo.rgb, embossed, uCoin * (1.0 - uSealMix));
      float gloss = pow(max(0.0, 1.0 - abs(p.x * 0.7 + p.y * 0.7 + sin(uTime * 0.3) * 0.9)), 7.0);
      labelColor += gloss * 0.14 * (1.0 - uCodeMix);
      color = mix(color, labelColor, logo.a * inside);
    }

    // Spindle hole
    float hole = 1.0 - smoothstep(0.016, 0.02, r);
    color = mix(color, vec3(0.01), hole * uVinyl * (1.0 - uCoin));

    gl_FragColor = vec4(color, 1.0);
  }
`;

// Screen-space backdrop: a soft glow behind the badge that gives way to a night
// harbor, plus a shockwave ring when the seal stamps.
export const BACKDROP_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHarbor;
  uniform float uPulse;
  uniform float uAspect;
  uniform vec2 uBadge;

  const float HORIZON = 0.6;
  const int LIGHTS = 16;

  ${PALETTE}
  ${NOISE}

  vec3 lightColor(float i) {
    float pick = hash(i + 7.0);
    return pick < 0.6 ? GOLD : (pick < 0.82 ? CRIMSON : BLUE);
  }

  float lightX(float i) {
    return (i + 0.5 + (hash(i) - 0.5) * 0.8) / float(LIGHTS);
  }

  vec3 harborScene(vec2 uv) {
    // Sky
    float above = max(uv.y - HORIZON, 0.0) / (1.0 - HORIZON);
    vec3 sky = mix(vec3(0.17, 0.075, 0.13), vec3(0.018, 0.035, 0.09), pow(above, 0.45));
    vec2 starGrid = uv * vec2(uAspect, 1.0) * 120.0;
    vec2 starCell = floor(starGrid);
    float starSpot = length(fract(starGrid) - 0.5 - (vec2(hash2(starCell + 1.0), hash2(starCell + 2.0)) - 0.5) * 0.6);
    float star = step(0.975, hash2(starCell)) * smoothstep(0.1, 0.02, starSpot);
    float twinkle = 0.55 + 0.45 * sin(uTime * 1.5 + hash2(starCell + 4.0) * 30.0);
    sky += vec3(0.8, 0.85, 1.0) * star * twinkle * smoothstep(0.03, 0.4, above) * 0.5;

    // Shoreline
    float ridge = HORIZON + 0.012 + 0.03 * noise(vec2(uv.x * uAspect * 5.0, 2.0)) + 0.012 * noise(vec2(uv.x * uAspect * 19.0, 8.0));
    float land = step(uv.y, ridge) * step(HORIZON, uv.y);
    sky = mix(sky, vec3(0.012, 0.02, 0.05), land);

    // Water
    float depth = max(HORIZON - uv.y, 0.0);
    float perspective = 1.0 / (depth + 0.035);
    vec2 waterUv = vec2((uv.x - 0.5) * uAspect * perspective * 1.6, perspective * 2.4 + uTime * 0.55);
    float ripple = noise(waterUv) * 0.65 + noise(waterUv * 2.3 + 5.0) * 0.35;
    vec3 water = mix(vec3(0.05, 0.05, 0.11), vec3(0.008, 0.02, 0.055), smoothstep(0.0, 0.4, depth));
    water += vec3(0.05, 0.08, 0.15) * pow(ripple, 3.0) * 0.8;

    // Shoreline lights and their reflections
    for (int n = 0; n < LIGHTS; n++) {
      float i = float(n);
      float x = lightX(i);
      vec3 tint = lightColor(i);
      float pulse = 0.75 + 0.25 * sin(uTime * (0.7 + hash(i + 2.0)) + i);

      vec2 lamp = vec2((uv.x - x) * uAspect, uv.y - (HORIZON + 0.012));
      sky += tint * exp(-dot(lamp, lamp) * 16000.0) * 1.3 * pulse;
      sky += tint * exp(-dot(lamp, lamp) * 650.0) * 0.09 * pulse;

      float sway = (ripple - 0.5) * (0.018 + depth * 0.2);
      float dx = (uv.x - x + sway) * uAspect;
      float width = 0.005 + depth * 0.05;
      float streak = exp(-dx * dx / (width * width)) * exp(-depth * 4.2);
      water += tint * streak * (0.3 + 1.0 * smoothstep(0.42, 0.72, ripple)) * pulse * 0.72;
    }

    // Glow the record casts on the water below it
    vec2 below = vec2((uv.x - uBadge.x) * uAspect, (uv.y - uBadge.y + 0.2) * 3.2);
    water += GOLD * exp(-dot(below, below) * 9.0) * smoothstep(0.36, 0.7, ripple) * 0.22;

    return mix(sky, water, step(uv.y, HORIZON));
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = (uv - uBadge) * vec2(uAspect, 1.0);
    float distance2 = dot(centered, centered);

    vec3 color = vec3(0.024, 0.055, 0.125);
    color += GOLD * exp(-distance2 * 5.0) * 0.07 + BLUE * exp(-distance2 * 1.6) * 0.05;

    if (uHarbor > 0.001) color = mix(color, harborScene(uv), uHarbor);

    float shock = sqrt(distance2) - uPulse * 0.9;
    color += GOLD * exp(-shock * shock * 260.0) * sin(3.14159 * uPulse) * 0.35;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// App windows that burst out of the record in 2005.
export const WINDOW_VERTEX = /* glsl */ `
  attribute float aTint;
  attribute float aSeed;
  varying vec2 vUv;
  varying float vTint;
  varying float vSeed;
  void main() {
    vUv = uv;
    vTint = aTint;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

export const WINDOW_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  varying float vTint;
  varying float vSeed;
  uniform float uMix;

  ${PALETTE}
  ${NOISE}

  float roundedBox(vec2 p, vec2 size, float radius) {
    vec2 q = abs(p) - size + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(1.4, 1.0);
    float edge = roundedBox(p, vec2(0.69, 0.49), 0.06);
    float mask = 1.0 - smoothstep(0.0, 0.006, edge);
    vec3 tint = vTint < 0.5 ? GOLD : (vTint < 1.5 ? BLUE : CRIMSON);

    vec3 color = vec3(0.04, 0.07, 0.15);
    color = mix(color, tint * 0.55, step(0.36, p.y));
    for (int i = 0; i < 3; i++) {
      vec2 light = p - vec2(-0.6 + float(i) * 0.07, 0.43);
      color = mix(color, vec3(0.9), smoothstep(0.022, 0.016, length(light)));
    }

    float lineSpace = (0.28 - p.y) / 0.11;
    float row = floor(lineSpace);
    float lineWidth = 0.3 + 0.6 * hash(row + vSeed * 17.0);
    float line = step(abs(fract(lineSpace) - 0.5), 0.17)
      * step(0.0, lineSpace) * step(lineSpace, 6.0)
      * step(-0.6, p.x) * step(p.x, -0.6 + lineWidth * 1.15);
    vec3 lineColor = hash(row + vSeed * 5.0) > 0.7 ? tint : vec3(0.55, 0.62, 0.8);
    color = mix(color, lineColor, line * 0.8);

    color += tint * smoothstep(0.015, 0.0, abs(edge)) * 0.7;
    gl_FragColor = vec4(color, mask * uMix * 0.94);
  }
`;

// Glowing dots for the 2021 particle lens.
export const DOT_FRAGMENT = /* glsl */ `
  varying float vSeed;
  varying float vRadius;
  uniform float uMix;
  uniform float uTime;

  ${PALETTE}

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.08, d);
    vec3 color = mix(GOLD, BLUE, smoothstep(0.3, 0.85, vRadius));
    color += vec3(0.6) * step(0.97, vSeed);
    float twinkle = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * (1.0 + vSeed * 2.0) + vSeed * 40.0));
    gl_FragColor = vec4(color, alpha * uMix * twinkle);
  }
`;

export const LENS_VERTEX = /* glsl */ `
  attribute float aRadius;
  attribute float aAngle;
  attribute float aSeed;
  uniform float uTime;
  uniform float uMix;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vSeed;
  varying float vRadius;
  void main() {
    float direction = mod(floor(aSeed * 10.0), 2.0) * 2.0 - 1.0;
    float angle = aAngle + uTime * (0.08 + 0.3 * (1.0 - aRadius)) * direction;
    float radius = aRadius * (0.8 + 0.2 * uMix) * (1.0 + 0.025 * sin(uTime * 1.7 + aSeed * 40.0));
    vec3 p = vec3(cos(angle) * radius, sin(angle) * radius, 0.06 * sin(angle * 3.0 + uTime));
    vSeed = aSeed;
    vRadius = aRadius;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * uPixelRatio * (0.6 + aSeed * 0.8);
  }
`;

// 2018 wireframe panels: they draw in from the top behind a glowing scan line.
export const PANEL_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uMap;
  uniform float uMix;
  uniform float uReveal;
  uniform float uTime;
  uniform vec3 uTint;

  void main() {
    vec4 panel = texture2D(uMap, vUv);
    float front = 1.0 - uReveal * 1.12;
    float shown = smoothstep(front - 0.012, front + 0.012, vUv.y);
    float edge = exp(-abs(vUv.y - front) * 90.0) * panel.a;
    float sweep = exp(-pow((vUv.y - fract(uTime * 0.12)) * 40.0, 2.0)) * 0.06 * panel.a;
    vec3 color = panel.rgb + uTint * edge * 0.9 + vec3(sweep);
    gl_FragColor = vec4(color, (panel.a * shown + edge * 0.6) * uMix);
  }
`;
