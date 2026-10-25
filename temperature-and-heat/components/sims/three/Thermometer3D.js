// ============================================================
// Thermometer (Lesson 1), 3D view.
// Reads ThermometerSim's live state: T = stateRef.shown (the smoothed
// value the 2D liquid uses), MIN_C / MAX_C, and the same 46 particles
// the 2D loop moves. Colour = heatColor(norm(T, MIN_C, MAX_C)), as in 2D.
// Scene: glass thermometer on an aluminium scale plate with a 10 °C
// grid, beside a glass particle box with a measurement grid.
// ============================================================
import { norm, heatTextColor } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { depthFor } from "./colors";
import {
  glass,
  heatMaterial,
  setHeat,
  realMaterial,
  glassBox,
  particleField,
  makePlacer,
  floorGrid,
  gridLines,
  textLabel,
} from "./kit";

const FLOOR = -0.75;
const TUBE_H = 4;
const TUBE_R = 0.17;
const BULB_R = 0.36;
const TUBE_X = -2.3;
const BOX = { x: 1.3, w: 3.8, h: 3.6, d: 2.4 };
BOX.y = FLOOR + BOX.h / 2 + 0.02;
const MAX_PARTS = 64;
// 2D marker colours (ThermometerSim reference markers)
const REFS = [
  { c: 0, name: "freezes", color: "#38bdf8" },
  { c: 37, name: "body", color: "#34d399" },
  { c: 100, name: "boils", color: "#f87171" },
];

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { y: FLOOR, size: 14, x: 0.4 }));

  // ---- aluminium scale plate on a wooden foot ----
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, TUBE_H + 1.4, 0.06),
    realMaterial(THREE, "Aluminum"),
  );
  plate.position.set(TUBE_X, TUBE_H / 2 + 0.05, -0.28);
  plate.castShadow = plate.receiveShadow = true;
  const foot = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 0.9), realMaterial(THREE, "Wood"));
  foot.position.set(TUBE_X, FLOOR + 0.08, -0.1);
  foot.castShadow = foot.receiveShadow = true;
  root.add(plate, foot);

  // ---- glass tube + bulb ----
  const tubeGlass = glass(THREE, { thickness: 0.12 });
  const tube = new THREE.Mesh(
    new THREE.CylinderGeometry(TUBE_R, TUBE_R, TUBE_H + 0.2, 32, 1, true),
    tubeGlass,
  );
  tube.position.set(TUBE_X, TUBE_H / 2, 0);
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(TUBE_R, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    tubeGlass,
  );
  cap.position.set(TUBE_X, TUBE_H + 0.1, 0);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(BULB_R, 32, 20), tubeGlass);
  bulb.position.set(TUBE_X, -BULB_R + 0.05, 0);
  root.add(tube, cap, bulb);

  // ---- liquid (column scales with T) ----
  const liquidMat = heatMaterial(THREE, { clearcoat: 1 });
  const column = new THREE.Mesh(
    new THREE.CylinderGeometry(TUBE_R * 0.6, TUBE_R * 0.6, 1, 24),
    liquidMat,
  );
  const liquidBulb = new THREE.Mesh(new THREE.SphereGeometry(BULB_R * 0.78, 28, 16), liquidMat);
  liquidBulb.position.copy(bulb.position);
  root.add(column, liquidBulb);
  const reading = textLabel(THREE, "", { height: 0.3, weight: 800 });
  reading.position.set(TUBE_X, TUBE_H + 0.75, 0);
  root.add(reading);

  // ---- scale: 10 °C grid on the plate, ticks, labels, reference marks ----
  let rangeKey = "";
  const scale = new THREE.Group();
  root.add(scale);
  const buildScale = (min, max) => {
    scale.traverse((o) => {
      if (o.geometry && !o.isSprite) o.geometry.dispose();
      if (o.material) {
        o.material.map?.dispose();
        o.material.dispose();
      }
    });
    scale.clear();
    const rows = Math.round((max - min) / 10);
    const grid = gridLines(THREE, 1.2, TUBE_H, 4, rows, { opacity: 0.22, color: 0x0f172a });
    grid.position.set(TUBE_X - 0.6, 0, -0.245);
    scale.add(grid);
    for (let c = Math.ceil(min / 10) * 10; c <= max; c += 10) {
      const major = c % 50 === 0;
      const len = major ? 0.3 : 0.16;
      const y = norm(c, min, max) * TUBE_H;
      const tick = new THREE.Mesh(
        new THREE.BoxGeometry(len, 0.02, 0.02),
        new THREE.MeshBasicMaterial({ color: 0x0f172a }),
      );
      tick.position.set(TUBE_X + TUBE_R + 0.06 + len / 2, y, -0.22);
      scale.add(tick);
      if (major) {
        const l = textLabel(THREE, `${c}`, { height: 0.18, color: "#e2e8f0" });
        l.position.set(TUBE_X + TUBE_R + 0.74, y, -0.2);
        scale.add(l);
      }
    }
    REFS.forEach((m) => {
      const y = norm(m.c, min, max) * TUBE_H;
      const mark = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.025, 0.025),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(m.color), toneMapped: false }),
      );
      mark.position.set(TUBE_X - TUBE_R - 0.26, y, -0.2);
      const l = textLabel(THREE, m.name, { height: 0.16, color: m.color });
      l.position.set(TUBE_X - TUBE_R - 0.95, y, -0.2);
      scale.add(mark, l);
    });
  };

  // ---- particle box with a back-wall grid ----
  const box = glassBox(THREE, BOX.w, BOX.h, BOX.d);
  box.position.set(BOX.x, BOX.y, 0);
  const backGrid = gridLines(THREE, BOX.w, BOX.h, 8, 8, { opacity: 0.12 });
  backGrid.position.set(BOX.x - BOX.w / 2, BOX.y - BOX.h / 2, -BOX.d / 2 + 0.01);
  const boxTitle = textLabel(THREE, "Particle motion, kinetic model", { height: 0.2, color: "#94a3b8" });
  boxTitle.position.set(BOX.x, BOX.y + BOX.h / 2 + 0.3, 0);
  root.add(box, backGrid, boxTitle);
  const field = particleField(THREE, MAX_PARTS);
  root.add(field);
  const place = makePlacer(THREE);

  return {
    home: {
      position: [0.6, 3.2, 10.6],
      target: [0.2, 1.9, 0],
      minDistance: 5,
      maxDistance: 15,
    },
    update({ T, min, max, parts }) {
      const key = `${min}:${max}`;
      if (key !== rangeKey) {
        rangeKey = key;
        buildScale(min, max);
      }
      const t01 = norm(T, min, max);
      setHeat(liquidMat, t01);
      const hgt = Math.max(0.001, Math.min(1, t01)) * TUBE_H;
      column.scale.y = hgt;
      column.position.set(TUBE_X, hgt / 2, 0);
      reading.setText(`${fmt(T, 1)} °C`, heatTextColor(t01));

      setHeat(field.material, t01);
      const list = parts || [];
      const n = Math.min(list.length, MAX_PARTS);
      for (let i = 0; i < n; i++) {
        const p = list[i];
        place(
          field,
          i,
          BOX.x + (p.x - 0.5) * (BOX.w - 0.3),
          BOX.y + (0.5 - p.y) * (BOX.h - 0.3),
          depthFor(i) * (BOX.d / 2 - 0.15),
          p.r * 0.016,
        );
      }
      field.count = n;
      field.instanceMatrix.needsUpdate = true;
    },
    dispose() {},
  };
}
