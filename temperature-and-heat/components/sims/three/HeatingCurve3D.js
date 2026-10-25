// ============================================================
// Heating curve of water (Lesson 7), 3D view.
// Reads HeatingCurveSim's live state: Q, the stateAt() result (T, phase,
// segment, fraction), the segment bounds and a curveAt(q) sampler that
// calls the sim's own stateAt(). Same rules as the 2D draw: ice alpha,
// water alpha, bubbles in segment 4, steam in 4–5, thermometer
// heatColor(norm(T, T_START, T_END)), curve #fbbf24 up to Q with a
// faint ghost of the rest, segment bands in SEG_COLORS.
// Scene: glass beaker on an electric hot plate, thermometer, and the
// T–Q graph with segment bands on a grid.
// ============================================================
import { norm, clamp, heatTextColor } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { setHeatColor } from "./colors";
import {
  beaker,
  water,
  ice,
  glass,
  steel,
  heatMaterial,
  setHeat,
  glowField,
  makePlacer,
  floorGrid,
  graphPanel,
  textLabel,
} from "./kit";

const BX = -2.4;
const B_R = 0.95;
const B_H = 2.2;
const PLATE_H = 0.45;
const FILL_H = B_H * 0.7;
const STEPS = 240;
const G = { x: 0, y: 0.7, w: 5, h: 3.2 };

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 16 }));
  const place = makePlacer(THREE);
  const tmp = new THREE.Color();

  // ---- hot plate with glowing coil ----
  const plate = new THREE.Mesh(new THREE.BoxGeometry(2.4, PLATE_H, 2.2), steel(THREE));
  plate.position.set(BX, PLATE_H / 2, 0);
  plate.castShadow = plate.receiveShadow = true;
  const coilMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, emissive: 0x000000, roughness: 0.5, toneMapped: false });
  const coilGeo = new THREE.TorusGeometry(0.7, 0.05, 10, 64);
  coilGeo.rotateX(Math.PI / 2);
  const coil = new THREE.Mesh(coilGeo, coilMat);
  coil.position.set(BX, PLATE_H + 0.02, 0);
  const coil2 = coil.clone();
  coil2.scale.setScalar(0.6);
  root.add(plate, coil, coil2);
  const heatLight = new THREE.PointLight(0xfb7185, 0, 3, 2);
  heatLight.position.set(BX, PLATE_H + 0.3, 0);
  root.add(heatLight);
  const coilOn = new THREE.Color().setRGB(251 / 255, 113 / 255, 133 / 255, "srgb");

  // ---- beaker + contents ----
  const cup = beaker(THREE, B_R, B_H);
  cup.position.set(BX, PLATE_H, 0);
  root.add(cup);
  const baseY = PLATE_H + 0.05;
  const iceMat = ice(THREE, { transparent: true });
  const iceBody = new THREE.Mesh(new THREE.CylinderGeometry(B_R - 0.06, B_R - 0.06, FILL_H, 40), iceMat);
  iceBody.position.set(BX, baseY + FILL_H / 2, 0);
  const lattice = glowField(THREE, 7 * 6 * 3, 6);
  for (let i = 0; i < lattice.count; i++) lattice.setColorAt(i, tmp.set(0xffffff));
  const waterMat = water(THREE);
  const waterBody = new THREE.Mesh(new THREE.CylinderGeometry(B_R - 0.05, B_R - 0.05, FILL_H - 0.06, 40), waterMat);
  waterBody.position.set(BX, baseY + (FILL_H - 0.06) / 2, 0);
  const surfaceMat = new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false, depthWrite: false });
  const surfaceGeo = new THREE.CircleGeometry(B_R - 0.06, 40);
  surfaceGeo.rotateX(-Math.PI / 2);
  const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
  surface.position.set(BX, baseY + FILL_H - 0.05, 0);
  root.add(iceBody, lattice, waterBody, surface);
  const deep = new THREE.Color().setRGB(30 / 255, 64 / 255, 175 / 255, "srgb");

  const bubbles = glowField(THREE, 9, 8);
  bubbles.material.transparent = true;
  bubbles.material.opacity = 0.5;
  for (let i = 0; i < 9; i++) bubbles.setColorAt(i, tmp.set(0xffffff));
  const steam = glowField(THREE, 26, 8);
  steam.material.transparent = true;
  steam.material.depthWrite = false;
  for (let i = 0; i < 26; i++) steam.setColorAt(i, tmp.setRGB(226 / 255, 232 / 255, 240 / 255, "srgb"));
  root.add(bubbles, steam);
  // own steam puffs (visual only, like the 2D wisps)
  const puffs = Array.from({ length: 26 }, (_, i) => ({
    x: Math.sin(i * 12.9898) * 0.5 + 0.5,
    z: Math.sin(i * 78.233) * 0.5 + 0.5,
    y: (i * 0.618) % 1,
    s: 0.3 + ((i * 0.37) % 0.7),
  }));

  // ---- thermometer beside the beaker ----
  const tubeX = BX + B_R + 0.45;
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, B_H, 20, 1, true), glass(THREE));
  tube.position.set(tubeX, PLATE_H + 0.3 + B_H / 2, 0.4);
  const thermoMat = heatMaterial(THREE);
  const thermo = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 12), thermoMat);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 12), thermoMat);
  bulb.position.set(tubeX, PLATE_H + 0.22, 0.4);
  root.add(tube, thermo, bulb);

  // ---- T–Q graph ----
  const graph = graphPanel(THREE, {
    w: G.w,
    h: G.h,
    cols: 10,
    rows: 7,
    series: [
      { color: "#fbbf24", opacity: 0.18 },
      { color: "#fbbf24", z: 0.002 },
    ],
    maxPoints: STEPS + 2,
  });
  graph.position.set(G.x, G.y, -0.6);
  root.add(graph);
  const bands = Array.from({ length: 5 }, () => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1, G.h),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.06, depthWrite: false, toneMapped: false }),
    );
    m.position.z = 0.001;
    graph.add(m);
    return m;
  });
  const bandTags = Array.from({ length: 5 }, (_, i) => {
    const l = textLabel(THREE, `Q${"₁₂₃₄₅"[i]}`, { height: 0.16, color: "#94a3b8" });
    graph.add(l);
    return l;
  });
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 16, 12),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, toneMapped: false, depthWrite: false }),
  );
  graph.add(dot, halo);
  const axisT = textLabel(THREE, "T (°C)", { height: 0.16, color: "#94a3b8" });
  axisT.position.set(0.3, G.h + 0.3, 0);
  const axisQ = textLabel(THREE, "Q added →", { height: 0.16, color: "#94a3b8" });
  axisQ.position.set(G.w - 0.5, -0.3, 0);
  graph.add(axisT, axisQ);
  const xy = [new Float32Array((STEPS + 1) * 2), new Float32Array((STEPS + 2) * 2)];
  let tickKey = "";
  let curveTotal = 0;

  // ---- labels ----
  const tTag = textLabel(THREE, "", { height: 0.3, weight: 800 });
  tTag.position.set(tubeX, PLATE_H + B_H + 0.65, 0.4);
  const phaseTag = textLabel(THREE, "", { height: 0.24, weight: 800 });
  // phase + formula float above the steam, clear of the heater label
  phaseTag.position.set(BX, PLATE_H + B_H + 1.5, 0);
  const segTag = textLabel(THREE, "", { height: 0.17, color: "#94a3b8" });
  segTag.position.set(BX, PLATE_H + B_H + 1.22, 0);
  const heaterTag = textLabel(THREE, "", { height: 0.17, color: "#94a3b8" });
  heaterTag.position.set(BX, PLATE_H / 2, 1.15);
  root.add(tTag, phaseTag, segTag, heaterTag);

  return {
    home: {
      position: [-0.6, 4.0, 10.4],
      target: [-0.4, 2.1, 0],
      minDistance: 5,
      maxDistance: 15,
    },
    update(s, dt) {
      const { st, Q, total, bounds, running, power, curveAt, Tstart, Tend, segColors, segNames } = s;
      const now = performance.now();
      const t01 = clamp(norm(st.T, Tstart, Tend), 0, 1);

      // hot plate
      coilMat.emissive.copy(running ? coilOn : tmp.set(0x000000));
      heatLight.intensity = running ? 2 : 0;
      heaterTag.setText(`Heater ${power} W`);

      // ice: segment 1, fading through segment 2
      const showIce = st.seg === 1 || (st.seg === 2 && st.frac < 1);
      const iceAlpha = st.seg === 1 ? 1 : 1 - st.frac;
      iceBody.visible = lattice.visible = showIce;
      if (showIce) {
        iceMat.opacity = iceAlpha;
        let k = 0;
        for (let i = 0; i <= 6; i++)
          for (let j = 0; j <= 5; j++)
            for (let d = 0; d < 3; d++) {
              const jitter = st.seg === 2 ? Math.sin(now / 120 + i * j) * 1.6 * st.frac * 0.01 : 0;
              place(
                lattice,
                k++,
                BX + ((i / 6) * 1.2 - 0.6) + jitter,
                baseY + 0.08 + (j / 5) * (FILL_H - 0.16) + jitter,
                (d - 1) * 0.4,
                0.022 * iceAlpha + 0.001,
              );
            }
        lattice.instanceMatrix.needsUpdate = true;
      }

      // liquid water: segments 2–4
      const showWater = st.seg >= 2 && st.seg <= 4;
      waterBody.visible = surface.visible = showWater;
      if (showWater) {
        const waterAlpha = st.seg === 2 ? st.frac : st.seg === 4 ? 1 - st.frac : 1;
        const a = Math.max(0.05, waterAlpha) * 0.65;
        const wc = clamp(norm(st.T, 0, 100), 0, 1);
        waterMat.opacity = a;
        surfaceMat.opacity = a;
        setHeatColor(surfaceMat.color, wc);
        setHeatColor(waterMat.attenuationColor, wc).lerp(deep, 0.5);
      }

      // boiling bubbles in segment 4
      bubbles.visible = st.seg === 4;
      if (bubbles.visible) {
        const t = now / 600;
        const span = FILL_H - 0.1;
        for (let i = 0; i < 9; i++) {
          const x = ((i * 41) % 90) / 100;
          const y = ((t * 70 * st.frac + i * 29) / 100) % span;
          place(bubbles, i, BX + (x - 0.45) * 1.5, baseY + y, Math.sin(i * 2.3) * 0.4, (2 + (i % 3) * st.frac + 1) * 0.012);
        }
        bubbles.instanceMatrix.needsUpdate = true;
      }

      // steam above the beaker in segments 4–5
      steam.visible = st.seg === 4 || st.seg === 5;
      if (steam.visible) {
        steam.material.opacity = (st.seg === 4 ? 0.25 + st.frac * 0.5 : 0.8) * 0.5;
        puffs.forEach((p, i) => {
          p.y += p.s * 0.25 * dt * (st.seg === 5 ? 2 : 1);
          if (p.y > 1) p.y = 0;
          place(steam, i, BX + (p.x - 0.5) * 1.4, PLATE_H + B_H + 0.1 + p.y * 1.0, (p.z - 0.5) * 1.2, 0.05 + p.s * 0.06);
        });
        steam.instanceMatrix.needsUpdate = true;
      }

      // thermometer
      setHeat(thermoMat, t01);
      const lh = Math.max(0.001, t01) * (B_H - 0.2);
      thermo.scale.y = lh;
      thermo.position.set(tubeX, PLATE_H + 0.3 + lh / 2, 0.4);

      // graph: ticks (once per range), bands, traced curve, ghost, current point
      const key = `${Tstart}:${Tend}`;
      if (key !== tickKey) {
        tickKey = key;
        [Tend, 100, 0, Tstart].forEach((tv) => {
          const l = textLabel(THREE, `${tv}°`, { height: 0.15, color: "#94a3b8" });
          l.position.set(-0.3, norm(tv, Tstart, Tend) * G.h, 0);
          graph.add(l);
        });
      }
      // the curve's shape depends only on the mass (total Q): sample it and
      // lay out the bands once per mass, not every frame
      if (total !== curveTotal) {
        curveTotal = total;
        for (let i = 0; i < 5; i++) {
          const x1 = (bounds[i] / total) * G.w;
          const x2 = (bounds[i + 1] / total) * G.w;
          const wB = Math.max(0.001, x2 - x1);
          bands[i].scale.x = wB;
          bands[i].position.set(x1 + wB / 2, G.h / 2, 0.001);
          bands[i].material.color.set(segColors[i]);
          bandTags[i].position.set(x1 + wB / 2, wB < 0.2 ? -0.15 : 0.15, 0.01);
        }
        for (let i = 0; i <= STEPS; i++) {
          const q = (total * i) / STEPS;
          xy[0][i * 2] = q / total;
          xy[0][i * 2 + 1] = clamp(norm(curveAt(q).T, Tstart, Tend), 0, 1);
        }
        graph.setSeries(0, xy[0], STEPS + 1);
      }
      for (let i = 0; i < 5; i++) bands[i].material.opacity = i + 1 === st.seg ? 0.16 : 0.06;
      // traced part: every sample up to Q, then the current point
      const k = Math.min(STEPS, Math.floor((Q / total) * STEPS));
      xy[1].set(xy[0].subarray(0, (k + 1) * 2));
      xy[1][(k + 1) * 2] = Q / total;
      xy[1][(k + 1) * 2 + 1] = t01;
      graph.setSeries(1, xy[1], k + 2);
      dot.position.set((Q / total) * G.w, t01 * G.h, 0.01);
      halo.position.copy(dot.position);
      setHeatColor(halo.material.color, t01);

      tTag.setText(`${fmt(st.T, 1)} °C`, heatTextColor(t01));
      phaseTag.setText(st.phase, heatTextColor(t01));
      segTag.setText(segNames[st.seg - 1]);
    },
    dispose() {},
  };
}
