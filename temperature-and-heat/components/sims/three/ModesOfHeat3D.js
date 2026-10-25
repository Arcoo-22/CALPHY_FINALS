// ============================================================
// Heat transfer demo (Lessons 3–4), 3D view.
// Reads ModesOfHeatSim's live state: which modes are shown and the same
// 34 soup particles the 2D loop moves. Same rules as the 2D draw:
// poker colour runs heatColor(1) → (0.45) → (0.05) from fire to handle,
// atom heat = clamp(1 − f·1.05), soup colour heatColor(clamp(0.9 −
// y·0.75)), radiation waves rgba(251,146,60).
// Scene: campfire (stones, logs, flames, flickering light), steel poker,
// cast-iron pot on a tripod (cut away to show the soup), camper on a log.
// ============================================================
import { clamp } from "@/lib/canvas";
import { setHeatColor, depthFor } from "./colors";
import {
  realMaterial,
  steel,
  heatMaterial,
  setHeat,
  flame,
  glowField,
  makePlacer,
  floorGrid,
  textLabel,
} from "./kit";

const POKER = { from: [-0.35, 0.32, 0.3], to: [-3.3, 1.15, 0.6] };
const POT = { y: 1.55, r: 0.7, h: 0.62 };
const CAMPER = { x: 3.4, z: 0.4 };
const N_DOTS = 16;
const N_SEGS = 24;
const ORANGE = "rgb(251,146,60)";

// 2D poker gradient stops: 0 → heatColor(1), 0.35 → (0.45), 1 → (0.05)
const pokerHeat = (f) =>
  f < 0.35 ? 1 + (0.45 - 1) * (f / 0.35) : 0.45 + (0.05 - 0.45) * ((f - 0.35) / 0.65);

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 16 }));
  const place = makePlacer(THREE);
  const tmp = new THREE.Color();
  const metal = steel(THREE);
  const woodMat = realMaterial(THREE, "Wood");

  // ---- campfire: stone ring, crossed logs, flames, light ----
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x6b7280, roughness: 0.95, flatShading: true });
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2;
    const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2 + (i % 3) * 0.04, 0), stoneMat);
    s.position.set(Math.cos(a) * 0.85, 0.12, Math.sin(a) * 0.85);
    s.rotation.set(i, i * 2, i * 3);
    s.castShadow = s.receiveShadow = true;
    root.add(s);
  }
  [0.5, -0.5, 1.6].forEach((rot, i) => {
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 1.3, 12), woodMat);
    log.rotation.z = Math.PI / 2 - 0.2;
    log.rotation.y = rot;
    log.position.y = 0.16 + i * 0.05;
    log.castShadow = true;
    root.add(log);
  });
  const flames = Array.from({ length: 6 }, (_, i) => {
    const f = flame(THREE);
    const a = (i / 6) * Math.PI * 2;
    f.position.set(Math.cos(a) * 0.18, 0.18, Math.sin(a) * 0.18);
    root.add(f);
    return f;
  });
  const fireLight = new THREE.PointLight(0xff8a3d, 6, 7, 1.6);
  fireLight.position.set(0, 0.7, 0);
  root.add(fireLight);

  // ---- poker: heat-coloured segments + wooden handle + vibrating atoms ----
  const from = new THREE.Vector3(...POKER.from);
  const to = new THREE.Vector3(...POKER.to);
  const dir = to.clone().sub(from);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  const segGeo = new THREE.CylinderGeometry(0.045, 0.045, (len / N_SEGS) * 1.02, 12);
  for (let i = 0; i < N_SEGS; i++) {
    const f = (i + 0.5) / N_SEGS;
    const m = new THREE.Mesh(segGeo, heatMaterial(THREE, { roughness: 0.25, clearcoat: 1 }));
    setHeat(m.material, pokerHeat(f));
    m.position.copy(from).addScaledVector(dir, f);
    m.quaternion.copy(quat);
    m.castShadow = true;
    root.add(m);
  }
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 14), woodMat);
  handle.position.copy(to).addScaledVector(dir.clone().normalize(), 0.25);
  handle.quaternion.copy(quat);
  root.add(handle);
  const atoms = glowField(THREE, N_DOTS, 8);
  const scratch = new THREE.Vector3(); // reused each frame, no per-frame allocation
  root.add(atoms);

  // ---- tripod + cast-iron pot (front cut away) + soup ----
  const apex = new THREE.Vector3(0, POT.y + 1.0, 0);
  [0, 2.1, 4.2].forEach((a) => {
    const foot = new THREE.Vector3(Math.cos(a) * 1.2, 0, Math.sin(a) * 1.2);
    const d = apex.clone().sub(foot);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, d.length(), 8), metal);
    leg.position.copy(foot).addScaledVector(d, 0.5);
    leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    leg.castShadow = true;
    root.add(leg);
  });
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, apex.y - POT.y - POT.h / 2, 6), metal);
  chain.position.set(0, (apex.y + POT.y + POT.h / 2) / 2, 0);
  root.add(chain);
  const iron = new THREE.MeshPhysicalMaterial({ color: 0x2b2b2b, metalness: 0.85, roughness: 0.6, side: THREE.DoubleSide });
  const pot = new THREE.Mesh(
    // theta 0 points at the camera (+z); leave a front opening of 0.6π
    new THREE.CylinderGeometry(POT.r, POT.r * 0.9, POT.h, 40, 1, true, Math.PI * 0.3, Math.PI * 1.4),
    iron,
  );
  pot.position.y = POT.y;
  const potBase = new THREE.Mesh(new THREE.CircleGeometry(POT.r * 0.9, 40), iron);
  potBase.rotation.x = -Math.PI / 2;
  potBase.position.y = POT.y - POT.h / 2;
  pot.castShadow = true;
  const soup = new THREE.Mesh(
    new THREE.CylinderGeometry(POT.r - 0.04, POT.r * 0.9 - 0.04, POT.h * 0.8, 40),
    new THREE.MeshPhysicalMaterial({ color: 0xf59e0b, roughness: 0.25, transmission: 0.3, transparent: true, opacity: 0.55, depthWrite: false }),
  );
  soup.position.y = POT.y - POT.h * 0.1;
  root.add(pot, potBase, soup);
  const soupDots = glowField(THREE, 40, 8);
  root.add(soupDots);
  // rising arrow in the middle of the pot
  const arrow = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, POT.h * 0.6, 6), new THREE.MeshBasicMaterial({ color: 0xfbbf24, toneMapped: false }));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 12), shaft.material);
  tip.position.y = POT.h * 0.3 + 0.05;
  arrow.add(shaft, tip);
  arrow.position.set(0, POT.y - POT.h * 0.08, 0.3);
  root.add(arrow);
  const steamMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.4 });
  const steam = [0, 1, 2].map(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6 * 3), 3));
    const l = new THREE.Line(geo, steamMat);
    l.frustumCulled = false;
    root.add(l);
    return l;
  });

  // ---- camper on a log ----
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.1, 14), woodMat);
  seat.rotation.x = Math.PI / 2;
  seat.position.set(CAMPER.x, 0.22, CAMPER.z);
  const cloth = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.95 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.55, 6, 16), cloth);
  body.position.set(CAMPER.x, 0.95, CAMPER.z);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.7 }));
  head.position.set(CAMPER.x, 1.62, CAMPER.z);
  [seat, body, head].forEach((m) => (m.castShadow = true));
  root.add(seat, body, head);
  const faceLight = new THREE.PointLight(0xfb923c, 0, 1.5, 2);
  faceLight.position.set(CAMPER.x - 0.4, 1.62, CAMPER.z);
  root.add(faceLight);

  // three radiation waves fire → face
  const waveMats = [0.75, 0.6, 0.45].map(
    (o) => new THREE.LineBasicMaterial({ color: new THREE.Color(ORANGE), transparent: true, opacity: o, toneMapped: false }),
  );
  const WAVE_SEGS = 40;
  const waves = waveMats.map((m) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((WAVE_SEGS + 1) * 3), 3));
    const l = new THREE.Line(geo, m);
    l.frustumCulled = false;
    root.add(l);
    return l;
  });
  const waveTips = waveMats.map((m) => {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 12), m);
    c.rotation.z = -Math.PI / 2;
    root.add(c);
    return c;
  });

  // ---- labels ----
  const fireTag = textLabel(THREE, "Campfire", { height: 0.2, color: "#94a3b8" });
  fireTag.position.set(0, 0.05, 1.35);
  const condTag = textLabel(THREE, "Conduction", { height: 0.22, color: "#f87171", weight: 800 });
  condTag.position.set(-3.2, 1.75, 0.6);
  const convTag = textLabel(THREE, "Convection", { height: 0.22, color: "#fbbf24", weight: 800 });
  convTag.position.set(0, apex.y + 0.35, 0);
  const radTag = textLabel(THREE, "Radiation", { height: 0.22, color: "#fb923c", weight: 800 });
  radTag.position.set(CAMPER.x, 2.25, CAMPER.z);
  const potTag = textLabel(THREE, "Soup pot", { height: 0.18, color: "#94a3b8" });
  potTag.position.set(0, apex.y + 0.35, 0);
  root.add(fireTag, condTag, convTag, radTag, potTag);

  return {
    home: {
      position: [0.2, 3.6, 8.6],
      target: [0, 1.0, 0],
      minDistance: 4.5,
      maxDistance: 14,
    },
    update({ show, soup: soupParts }) {
      const t = performance.now();

      // flames + flickering firelight
      flames.forEach((f, i) => {
        f.scale.y = (30 + Math.sin(t / 110 + i * 1.9) * 9 + (i % 2) * 8) / 40;
      });
      fireLight.intensity = 5.5 + Math.sin(t / 90) * 0.6 + Math.sin(t / 37) * 0.3;

      // conduction: vibrating atoms along the poker
      atoms.visible = condTag.visible = show.conduction;
      if (show.conduction) {
        for (let i = 0; i < N_DOTS; i++) {
          const f = i / (N_DOTS - 1);
          const heat = clamp(1 - f * 1.05, 0, 1);
          const amp = (1 + heat * 4.5) * 0.012;
          const jx = Math.sin(t / (60 + 260 * (1 - heat)) + i * 9) * amp;
          const jy = Math.cos(t / (70 + 240 * (1 - heat)) + i * 5) * amp;
          const p = scratch.copy(from).addScaledVector(dir, f);
          place(atoms, i, p.x + jx, p.y + 0.08 + jy, p.z, 0.04);
          atoms.setColorAt(i, setHeatColor(tmp, heat));
        }
        atoms.instanceMatrix.needsUpdate = true;
        atoms.instanceColor.needsUpdate = true;
      }

      // convection: soup particles + arrow + steam
      const conv = show.convection;
      soupDots.visible = arrow.visible = convTag.visible = conv;
      potTag.visible = !conv;
      steam.forEach((l) => (l.visible = conv));
      if (conv && soupParts) {
        const n = Math.min(soupParts.length, 40);
        const r = POT.r - 0.12;
        const top = POT.y + POT.h * 0.3;
        for (let i = 0; i < n; i++) {
          const p = soupParts[i];
          const x = (p.x - 0.5) * 2 * r;
          const zMax = Math.sqrt(Math.max(0, r * r - x * x));
          place(soupDots, i, x, top - p.y * (POT.h * 0.7), depthFor(i) * zMax, 0.035);
          soupDots.setColorAt(i, setHeatColor(tmp, clamp(0.9 - p.y * 0.75, 0, 1)));
        }
        soupDots.count = n;
        soupDots.instanceMatrix.needsUpdate = true;
        soupDots.instanceColor.needsUpdate = true;
        steam.forEach((l, i) => {
          const pos = l.geometry.attributes.position;
          const sx = (i - 1) * 0.25;
          for (let k = 0; k < 6; k++) {
            const yy = k * 4;
            const y = POT.y + POT.h / 2 + 0.05 + (yy + ((t / 40 + i * 13) % 12)) * 0.022;
            pos.setXYZ(k, sx + Math.sin((yy + t / 26 + i * 30) / 7) * 0.05, y, 0);
          }
          pos.needsUpdate = true;
        });
      }

      // radiation: three sine waves fire → face, warm glow on the face
      const rad = show.radiation;
      radTag.visible = rad;
      faceLight.intensity = rad ? 1.2 + Math.sin(t / 500) * 0.25 : 0;
      waves.forEach((l, r) => {
        l.visible = waveTips[r].visible = rad;
        if (!rad) return;
        const yOff = (r - 1) * 0.3;
        const x1 = 0.45, y1 = 0.9 + yOff * 0.4;
        const x2 = CAMPER.x - 0.32, y2 = 1.62 + yOff * 0.5;
        const pos = l.geometry.attributes.position;
        for (let i = 0; i <= WAVE_SEGS; i++) {
          const f = i / WAVE_SEGS;
          pos.setXYZ(i, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f + Math.sin(f * 22 - t / 130 + r) * 0.05, CAMPER.z * f);
        }
        pos.needsUpdate = true;
        waveTips[r].position.set(x2, y2, CAMPER.z);
      });
    },
    dispose() {},
  };
}
