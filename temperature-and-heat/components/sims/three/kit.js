// ============================================================
// Building blocks shared by the 3D scene modules.
// • Physical materials: glass, water, ice, metals, wood, brick…
// • Temperature-coloured parts glow with the exact 2D heatColor():
//   emissive (or basic) colour, not tone-mapped, so lighting and
//   reflections add sheen but never shift the hue.
// • Grids: floor grid, measurement / graph panels, text labels.
// ============================================================
import { setHeatColor } from "./colors";

/* ------------------------------ materials ------------------------------ */

// Glowing, glossy surface whose visible colour is exactly heatColor(t).
export function heatMaterial(THREE, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    emissive: 0xffffff,
    roughness: 0.3,
    metalness: 0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25,
    toneMapped: false,
    ...opts,
  });
}

export const setHeat = (material, t01) => setHeatColor(material.emissive, t01);

// Thin lab glass (beakers, tubes, tanks): clear with sharp reflections.
// Not transmissive on purpose: three.js leaves transmissive objects out of
// the refraction pass, so water or ice inside a transmissive beaker would
// vanish. Solid glass that refracts is solidGlass() below.
export function glass(THREE, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    transparent: true,
    opacity: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    specularIntensity: 1,
    envMapIntensity: 1.4,
    depthWrite: false,
    side: THREE.DoubleSide,
    ...opts,
  });
}

// Solid glass with real refraction (a glass sample, not a container).
export function solidGlass(THREE, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xe6fbff,
    metalness: 0,
    roughness: 0.05,
    transmission: 1,
    thickness: 0.6,
    ior: 1.5,
    specularIntensity: 1,
    ...opts,
  });
}

// Water: refractive, slightly blue, tint settable per frame.
export function water(THREE, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xcfe8ff,
    metalness: 0,
    roughness: 0.06,
    transmission: 0.92,
    thickness: 1.2,
    ior: 1.33,
    attenuationColor: new THREE.Color(0x3b82f6),
    attenuationDistance: 3,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    ...opts,
  });
}

// Frosted ice: partly clear, pale blue, wet clear-coat on top.
export function ice(THREE, opts = {}) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    metalness: 0,
    roughness: 0.38,
    transmission: 0.5,
    thickness: 1,
    ior: 1.31,
    attenuationColor: new THREE.Color(0x93c5fd),
    attenuationDistance: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
    ...opts,
  });
}

// Procedural textures (no image downloads).
function canvasTexture(THREE, w, h, paint) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  paint(c.getContext("2d"), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function woodTexture(THREE) {
  return canvasTexture(THREE, 256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 46; i++) {
      const y = (i / 46) * h + Math.sin(i * 1.7) * 3;
      ctx.strokeStyle = i % 3 ? "rgba(60,30,10,0.28)" : "rgba(200,140,80,0.22)";
      ctx.lineWidth = 1 + (i % 4);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const yy = y + Math.sin(x / 34 + i) * 2.5;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
  });
}

function brickTexture(THREE) {
  return canvasTexture(THREE, 256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#cbbfa8"; // mortar
    ctx.fillRect(0, 0, w, h);
    const bh = 32;
    for (let r = 0; r < h / bh; r++) {
      const off = r % 2 ? 32 : 0;
      for (let c = -1; c < w / 64 + 1; c++) {
        const shade = 0.85 + ((r * 7 + c * 13) % 5) * 0.04;
        ctx.fillStyle = `rgb(${Math.round(160 * shade)},${Math.round(72 * shade)},${Math.round(44 * shade)})`;
        ctx.fillRect(c * 64 + off + 3, r * bh + 3, 58, bh - 6);
      }
    }
  });
}

function foamTexture(THREE) {
  return canvasTexture(THREE, 128, 128, (ctx, w, h) => {
    ctx.fillStyle = "#f3ecd2";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const x = (i * 53.7) % w;
      const y = (i * 91.3) % h;
      ctx.fillStyle = "rgba(170,150,100,0.18)";
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Real-world look for a named material from lib/constants.js.
export function realMaterial(THREE, name) {
  switch (name) {
    case "Copper":
      return new THREE.MeshPhysicalMaterial({ color: 0xc27a4a, metalness: 1, roughness: 0.28 });
    case "Aluminum":
      return new THREE.MeshPhysicalMaterial({ color: 0xd6d9de, metalness: 1, roughness: 0.34 });
    case "Iron":
      return new THREE.MeshPhysicalMaterial({ color: 0x6e6b67, metalness: 1, roughness: 0.58 });
    case "Steel":
      return new THREE.MeshPhysicalMaterial({ color: 0xa3a9b0, metalness: 1, roughness: 0.3 });
    case "Lead":
      return new THREE.MeshPhysicalMaterial({ color: 0x5d6670, metalness: 0.85, roughness: 0.62 });
    case "Glass":
      return solidGlass(THREE);
    case "Water":
      return water(THREE);
    case "Brick":
      return new THREE.MeshStandardMaterial({ map: brickTexture(THREE), roughness: 0.92 });
    case "Wood":
      return new THREE.MeshStandardMaterial({ map: woodTexture(THREE), roughness: 0.72 });
    case "Foam":
      return new THREE.MeshStandardMaterial({ map: foamTexture(THREE), roughness: 1 });
    case "Air":
      return glass(THREE, { opacity: 0.08, color: 0xe2e8f0 });
    default:
      return new THREE.MeshPhysicalMaterial({ color: 0x9ca3af, metalness: 0.6, roughness: 0.4 });
  }
}

export const steel = (THREE) => realMaterial(THREE, "Steel");
export const wood = (THREE) => realMaterial(THREE, "Wood");

// Small flickering flame (cone with a hot core); scale.y drives height.
export function flame(THREE) {
  const g = new THREE.Group();
  const outer = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 1, 16, 1, true),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color().setRGB(1, 107 / 255, 53 / 255, "srgb"),
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  outer.position.y = 0.5;
  const core = new THREE.Mesh(
    new THREE.ConeGeometry(0.06, 0.6, 12, 1, true),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color().setRGB(1, 210 / 255, 63 / 255, "srgb"),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
  );
  core.position.y = 0.3;
  g.add(outer, core);
  return g;
}

/* ------------------------------ particles ------------------------------ */

// Instanced spheres sharing one heat colour (set with setHeat(field.material)).
export function particleField(THREE, max, segments = 14) {
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, segments, Math.max(8, segments - 4)),
    heatMaterial(THREE),
    max,
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.castShadow = true;
  return mesh;
}

// Instanced spheres with a colour per instance (exact, unlit glow).
export function glowField(THREE, max, segments = 10) {
  const mesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, segments, Math.max(6, segments - 4)),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
    max,
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
  mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  return mesh;
}

// Reusable scratch object for writing instance matrices.
export function makePlacer(THREE) {
  const o = new THREE.Object3D();
  return (mesh, i, x, y, z, s, sy = s, sz = s) => {
    o.position.set(x, y, z);
    o.scale.set(s, sy, sz);
    o.updateMatrix();
    mesh.setMatrixAt(i, o.matrix);
  };
}

/* ------------------------------ containers ------------------------------ */

// Glass box (tank) with crisp edges.
export function glassBox(THREE, w, h, d, { edge = 0.22 } = {}) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  group.add(new THREE.Mesh(geo, glass(THREE, { side: THREE.FrontSide, thickness: 0.04 })));
  group.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: edge }),
    ),
  );
  return group;
}

// Open glass beaker (cylinder wall + base + lip).
export function beaker(THREE, r, h) {
  const g = new THREE.Group();
  const mat = glass(THREE, { thickness: 0.05 });
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.97, h, 48, 1, true), mat);
  wall.position.y = h / 2;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r * 0.97, 0.04, 48), mat);
  base.position.y = 0.02;
  const lipGeo = new THREE.TorusGeometry(r, 0.018, 8, 64);
  lipGeo.rotateX(Math.PI / 2);
  const lip = new THREE.Mesh(lipGeo, mat);
  lip.position.y = h;
  g.add(wall, base, lip);
  return g;
}

/* -------------------------------- grids -------------------------------- */

// Floor with a fine and a coarse grid (1 unit major, 0.25 minor).
export function floorGrid(THREE, { y = 0, size = 14, x = 0, z = 0 } = {}) {
  const g = new THREE.Group();
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.85, metalness: 0.1 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  const minor = new THREE.GridHelper(size, size * 4, 0x1f2937, 0x1f2937);
  minor.material.transparent = true;
  minor.material.opacity = 0.55;
  minor.position.y = 0.002;
  const major = new THREE.GridHelper(size, size, 0x475569, 0x334155);
  major.material.transparent = true;
  major.material.opacity = 0.8;
  major.position.y = 0.004;
  g.add(floor, minor, major);
  g.position.set(x, y, z);
  return g;
}

// Vertical grid of cols × rows cells, w × h units, in the XY plane.
export function gridLines(THREE, w, h, cols, rows, { opacity = 0.18, color = 0xffffff } = {}) {
  const pts = [];
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * w;
    pts.push(x, 0, 0, x, h, 0);
  }
  for (let j = 0; j <= rows; j++) {
    const y = (j / rows) * h;
    pts.push(0, y, 0, w, y, 0);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
}

// Text label that always faces the camera; setText only redraws on change.
export function textLabel(THREE, text, { height = 0.22, color = "#e2e8f0", weight = 700 } = {}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }),
  );
  let current = null;
  let currentColor = null;
  sprite.setText = (t, c = currentColor || color) => {
    if (t === current && c === currentColor) return;
    current = t;
    currentColor = c;
    const px = 64;
    const font = `${weight} ${px}px "Plus Jakarta Sans", system-ui, sans-serif`;
    ctx.font = font;
    // width rounded up to 64 px steps so changing digits rarely resize it
    const tw = Math.ceil((ctx.measureText(t).width + 24) / 64) * 64;
    if (canvas.width !== tw || canvas.height !== px + 24) {
      canvas.width = tw;
      canvas.height = px + 24;
      // GPU storage is fixed-size once uploaded; free it so it is
      // reallocated at the new size instead of drawing into the old one
      tex.dispose();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(11,18,32,0.85)";
    ctx.strokeText(t, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = c;
    ctx.fillText(t, canvas.width / 2, canvas.height / 2);
    tex.needsUpdate = true;
    sprite.scale.set((height * canvas.width) / canvas.height, height, 1);
  };
  sprite.setText(text);
  return sprite;
}

// Graph panel: dark backing, grid, axes, plotted series as lines.
//   graph.setSeries(i, points, count) with points = Float32Array of x01,y01 pairs
export function graphPanel(
  THREE,
  { w = 4, h = 2.4, cols = 8, rows = 4, series = [], maxPoints = 600 } = {},
) {
  const g = new THREE.Group();
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(w + 0.3, h + 0.3),
    new THREE.MeshStandardMaterial({
      color: 0x0b1220,
      roughness: 0.6,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    }),
  );
  back.position.set(w / 2, h / 2, -0.01);
  g.add(back, gridLines(THREE, w, h, cols, rows, { opacity: 0.14 }));
  const axes = new THREE.BufferGeometry();
  axes.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 0, 0.002, w, 0, 0.002, 0, 0, 0.002, 0, h, 0.002], 3),
  );
  g.add(
    new THREE.LineSegments(
      axes,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 }),
    ),
  );
  const lines = series.map((s) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(maxPoints * 3), 3).setUsage(THREE.DynamicDrawUsage),
    );
    geo.setDrawRange(0, 0);
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: new THREE.Color(s.color),
        transparent: s.opacity != null,
        opacity: s.opacity ?? 1,
        toneMapped: false,
      }),
    );
    line.position.z = 0.004 + (s.z || 0);
    line.frustumCulled = false;
    g.add(line);
    return line;
  });
  // incremental use: write single points, then set how many are drawn;
  // stretchX rescales a series along x without rewriting its points
  g.setPoint = (i, k, x01, y01) => {
    const pos = lines[i].geometry.attributes.position;
    if (k >= maxPoints) return;
    pos.array[k * 3] = x01 * w;
    pos.array[k * 3 + 1] = y01 * h;
    pos.array[k * 3 + 2] = 0;
  };
  g.setCount = (i, n) => {
    lines[i].geometry.attributes.position.needsUpdate = true;
    lines[i].geometry.setDrawRange(0, Math.min(n, maxPoints));
  };
  g.stretchX = (i, sx) => {
    lines[i].scale.x = sx;
  };
  g.setSeries = (i, xy, count) => {
    const line = lines[i];
    const pos = line.geometry.attributes.position;
    const n = Math.min(count, maxPoints);
    for (let k = 0; k < n; k++) {
      pos.array[k * 3] = xy[k * 2] * w;
      pos.array[k * 3 + 1] = xy[k * 2 + 1] * h;
      pos.array[k * 3 + 2] = 0;
    }
    pos.needsUpdate = true;
    line.geometry.setDrawRange(0, n);
  };
  g.size = { w, h };
  return g;
}
