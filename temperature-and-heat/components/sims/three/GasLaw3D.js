// ============================================================
// Gas law piston (Lesson 9), 3D view.
// Reads GasLawSim's live state: T and V after the mode constraints,
// the T/V ranges, the same 60 particles the 2D loop bounces, the
// smoothed gauge angle and the pressure readout.
// Piston height = maxH · norm(V, V_MIN·0.8, V_MAX·1.05), particle
// colour = heatColor(clamp(norm(T, T_MIN, T_MAX), 0, 1)) and needle
// angle = st.gauge, as in 2D.
// Scene: glass cylinder with litre graduations, steel piston and base,
// brass pressure gauge, gridded floor.
// ============================================================
import { norm, clamp, heatTextColor } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { cssColor, depthFor } from "./colors";
import {
  glass,
  steel,
  particleField,
  setHeat,
  makePlacer,
  floorGrid,
  textLabel,
} from "./kit";

const CYL_R = 1.3;
const MAX_H = 4; // full gas column (2D maxH)
const WALL_H = MAX_H * (0.74 / 0.62); // 2D walls rise above maxH
const BASE_H = 0.2;
const MAX_PARTS = 80;
const GAUGE = { x: 3.4, y: 2.6, r: 0.9 };

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 16, x: 1 }));
  const place = makePlacer(THREE);
  const metal = steel(THREE);

  // ---- steel base + glass cylinder ----
  const base = new THREE.Mesh(new THREE.CylinderGeometry(CYL_R + 0.25, CYL_R + 0.3, BASE_H, 48), metal);
  base.position.y = BASE_H / 2;
  base.castShadow = base.receiveShadow = true;
  const walls = new THREE.Mesh(
    new THREE.CylinderGeometry(CYL_R, CYL_R, WALL_H, 64, 1, true),
    glass(THREE, { thickness: 0.1 }),
  );
  walls.position.y = BASE_H + WALL_H / 2;
  const rimGeo = new THREE.TorusGeometry(CYL_R, 0.03, 10, 64);
  rimGeo.rotateX(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, metal);
  rim.position.y = BASE_H + WALL_H;
  root.add(base, walls, rim);

  // ---- graduations: one ring per litre, labelled ----
  let gradKey = "";
  const grads = new THREE.Group();
  root.add(grads);
  const buildGrads = (Vmin, Vmax) => {
    grads.traverse((o) => {
      if (o.geometry && !o.isSprite) o.geometry.dispose();
      if (o.material) {
        o.material.map?.dispose();
        o.material.dispose();
      }
    });
    grads.clear();
    for (let L = Math.ceil(Vmin * 2) / 2; L <= Vmax + 1e-6; L += 0.5) {
      const whole = Number.isInteger(L);
      const y = BASE_H + MAX_H * norm(L, Vmin * 0.8, Vmax * 1.05);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(CYL_R + 0.005, whole ? 0.012 : 0.007, 6, 96, whole ? Math.PI * 0.5 : Math.PI * 0.25),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: whole ? 0.7 : 0.4 }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = Math.PI * 0.25 - (whole ? Math.PI * 0.25 : Math.PI * 0.125);
      ring.position.y = y;
      grads.add(ring);
      if (whole) {
        const l = textLabel(THREE, `${L} L`, { height: 0.18, color: "#7dd3fc" });
        l.position.set(CYL_R + 0.35, y, CYL_R * 0.55);
        grads.add(l);
      }
    }
  };

  // ---- gas tint (2D gradient: sky blue → ember, stronger when hot) ----
  const gasMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  });
  const gas = new THREE.Mesh(new THREE.CylinderGeometry(CYL_R - 0.02, CYL_R - 0.02, 1, 48), gasMat);
  root.add(gas);
  const coldC = cssColor(THREE, "rgb(56,189,248)");
  const hotC = cssColor(THREE, "rgb(255,107,53)");

  // ---- piston + rod ----
  const piston = new THREE.Group();
  const head = new THREE.Mesh(new THREE.CylinderGeometry(CYL_R - 0.01, CYL_R - 0.01, 0.26, 64), metal);
  head.position.y = 0.13;
  const seal = new THREE.Mesh(
    new THREE.CylinderGeometry(CYL_R, CYL_R, 0.06, 64),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 }),
  );
  seal.position.y = 0.08;
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.6, 20), metal);
  rod.position.y = 0.26 + 0.8;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 16), metal);
  knob.position.y = 0.26 + 1.6;
  [head, rod, knob].forEach((m) => (m.castShadow = true));
  piston.add(head, seal, rod, knob);
  root.add(piston);

  const field = particleField(THREE, MAX_PARTS);
  root.add(field);

  // ---- brass pressure gauge on a post, connected by a pipe ----
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xd4a64a, metalness: 1, roughness: 0.3 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, GAUGE.y, 12), metal);
  post.position.set(GAUGE.x, GAUGE.y / 2, -0.2);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, GAUGE.x - CYL_R - 0.25, 12), metal);
  pipe.rotation.z = Math.PI / 2;
  pipe.position.set((GAUGE.x + CYL_R + 0.25) / 2, BASE_H / 2 + 0.05, -0.2);
  const bezelGeo = new THREE.TorusGeometry(GAUGE.r, 0.08, 16, 64);
  const bezel = new THREE.Mesh(bezelGeo, brass);
  const face = new THREE.Mesh(
    new THREE.CircleGeometry(GAUGE.r, 64),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }),
  );
  face.position.z = -0.01;
  const gaugeGlass = new THREE.Mesh(new THREE.CircleGeometry(GAUGE.r, 64), glass(THREE, { side: THREE.FrontSide }));
  gaugeGlass.position.z = 0.06;
  const gauge = new THREE.Group();
  gauge.add(bezel, face, gaugeGlass);
  // 2D tick angles: −0.75π … +0.75π in canvas space (y down) → rotation −a
  for (let i = 0; i <= 10; i++) {
    const a = -Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(i % 5 === 0 ? 0.2 : 0.12, 0.025, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x0f172a }),
    );
    const rr = GAUGE.r - (i % 5 === 0 ? 0.18 : 0.14);
    tick.position.set(Math.cos(-a) * rr, Math.sin(-a) * rr, 0.005);
    tick.rotation.z = -a;
    gauge.add(tick);
  }
  const needle = new THREE.Mesh(
    new THREE.BoxGeometry(GAUGE.r - 0.15, 0.04, 0.02).translate((GAUGE.r - 0.15) / 2, 0, 0),
    new THREE.MeshBasicMaterial({ color: 0xdc2626 }),
  );
  needle.position.z = 0.02;
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), brass);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = 0.03;
  gauge.add(needle, hub);
  gauge.position.set(GAUGE.x, GAUGE.y + GAUGE.r, -0.2);
  gauge.rotation.y = -0.35;
  bezel.castShadow = true;
  root.add(post, pipe, gauge);

  // ---- labels ----
  const pTag = textLabel(THREE, "", { height: 0.26, color: "#fdba74", weight: 800 });
  pTag.position.set(GAUGE.x, GAUGE.y + GAUGE.r * 2 + 0.4, -0.2);
  const tTag = textLabel(THREE, "", { height: 0.24, weight: 800 });
  tTag.position.set(0, BASE_H + WALL_H + 0.5, 0);
  root.add(pTag, tTag);

  return {
    home: {
      position: [3.4, 4.4, 9.4],
      target: [1.0, 2.3, 0],
      minDistance: 5,
      maxDistance: 15,
    },
    update({ T, V, parts, Tmin, Tmax, Vmin, Vmax, gauge: needleAngle, P }) {
      const key = `${Vmin}:${Vmax}`;
      if (key !== gradKey) {
        gradKey = key;
        buildGrads(Vmin, Vmax);
      }
      const gasH = MAX_H * norm(V, Vmin * 0.8, Vmax * 1.05);
      const tT = clamp(norm(T, Tmin, Tmax), 0, 1);
      piston.position.y = BASE_H + gasH;
      gas.scale.y = Math.max(0.001, gasH);
      gas.position.y = BASE_H + gasH / 2;
      gasMat.color.copy(coldC).lerp(hotC, tT);
      gasMat.opacity = 0.06 + tT * 0.1;

      setHeat(field.material, tT);
      const list = parts || [];
      const n = Math.min(list.length, MAX_PARTS);
      const r = CYL_R - 0.1;
      for (let i = 0; i < n; i++) {
        const p = list[i];
        // 2D x spans the cylinder width; depth stays inside the circle
        const x = (p.x - 0.5) * 2 * r;
        const zMax = Math.sqrt(Math.max(0, r * r - x * x));
        place(
          field,
          i,
          x,
          BASE_H + 0.08 + (1 - p.y) * Math.max(0, gasH - 0.16),
          depthFor(i) * zMax,
          p.r * 0.03,
        );
      }
      field.count = n;
      field.instanceMatrix.needsUpdate = true;

      needle.rotation.z = -(needleAngle || 0);
      if (P != null) pTag.setText(`P = ${fmt(P, 1)} kPa`); // readout.P is already kPa
      tTag.setText(`T = ${fmt(T, 0)} K · V = ${fmt(V, 2)} L`, heatTextColor(tT));
    },
    dispose() {},
  };
}
