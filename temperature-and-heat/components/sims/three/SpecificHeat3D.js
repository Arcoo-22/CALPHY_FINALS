// ============================================================
// Specific Heat Race (Lesson 5), 3D view.
// Reads SpecificHeatSim's live state: Ta, Tb, t, the T–t histories,
// both materials and the same 26 + 26 particles the 2D loop moves.
// Colours = heatColor(clamp(norm(T, T0, T_MAX), 0, 1)) and graph
// lines #38bdf8 (A) / #fb923c (B) with tMax = max(60, t), as in 2D.
// Scene: two burners, each with a cut-away sample of the real
// material (particles visible inside), a mini thermometer, and a
// temperature-vs-time graph on a grid behind them.
// ============================================================
import { norm, clamp, heatTextColor } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { depthFor } from "./colors";
import {
  realMaterial,
  steel,
  glass,
  heatMaterial,
  setHeat,
  flame,
  particleField,
  makePlacer,
  floorGrid,
  graphPanel,
  textLabel,
} from "./kit";

const SAMPLE_R = 0.75;
const SAMPLE_H = 0.8;
const STOVE_H = 0.8;
const MAX_HIST = 4000;

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 16 }));
  const place = makePlacer(THREE);
  const metal = steel(THREE);

  const station = (x) => {
    const g = { x };
    // stove body + burner ring
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, STOVE_H, 1.9),
      new THREE.MeshPhysicalMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.45 }),
    );
    body.position.set(x, STOVE_H / 2, 0);
    body.castShadow = body.receiveShadow = true;
    const ringGeo = new THREE.TorusGeometry(0.45, 0.05, 10, 48);
    ringGeo.rotateX(Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, metal);
    ring.position.set(x, STOVE_H + 0.03, 0);
    root.add(body, ring);
    g.flames = [0, 1, 2, 3, 4].map((i) => {
      const f = flame(THREE);
      const a = (i / 5) * Math.PI * 2;
      f.position.set(x + Math.cos(a) * 0.45, STOVE_H + 0.05, Math.sin(a) * 0.45);
      f.scale.setScalar(0.6);
      root.add(f);
      return f;
    });
    // pan
    const pan = new THREE.Mesh(
      new THREE.CylinderGeometry(SAMPLE_R + 0.08, SAMPLE_R + 0.02, 0.18, 48, 1, true),
      metal,
    );
    // pan sits on a gap above the burner so the flames lick its base
    pan.position.set(x, STOVE_H + 0.35, 0);
    const panBase = new THREE.Mesh(new THREE.CylinderGeometry(SAMPLE_R + 0.02, SAMPLE_R + 0.02, 0.04, 48), metal);
    panBase.position.set(x, STOVE_H + 0.28, 0);
    pan.castShadow = panBase.castShadow = true;
    root.add(pan, panBase);
    // cut-away sample (rebuilt when the material changes)
    g.sampleY = STOVE_H + 0.3;
    g.sample = null;
    g.matName = "";
    g.field = particleField(THREE, 32);
    root.add(g.field);
    // mini thermometer
    const tube = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 1.2, 20, 1, true),
      glass(THREE, { thickness: 0.05 }),
    );
    tube.position.set(x + SAMPLE_R + 0.3, STOVE_H + 1.0, 0.3);
    g.liquidMat = heatMaterial(THREE);
    g.liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 16), g.liquidMat);
    g.bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 12), g.liquidMat);
    g.bulb.position.set(tube.position.x, STOVE_H + 0.35, 0.3);
    root.add(tube, g.liquid, g.bulb);
    g.tubeX = tube.position.x;
    // labels
    g.name = textLabel(THREE, "", { height: 0.22, weight: 800 });
    g.name.position.set(x, 0.35, 1.05);
    g.temp = textLabel(THREE, "", { height: 0.28, weight: 800 });
    g.temp.position.set(x, STOVE_H + SAMPLE_H + 0.6, 0);
    root.add(g.name, g.temp);
    return g;
  };
  const A = station(-1.8);
  const B = station(1.8);

  const buildSample = (g, name) => {
    if (g.sample) {
      root.remove(g.sample);
      g.sample.geometry.dispose();
      g.sample.material.map?.dispose();
      g.sample.material.dispose();
    }
    g.matName = name;
    // front quarter cut away so the particles inside stay visible
    // theta 0 points at the camera (+z); the opening faces the viewer
    const geo = new THREE.CylinderGeometry(SAMPLE_R, SAMPLE_R, SAMPLE_H, 48, 1, false, Math.PI * 0.25, Math.PI * 1.5);
    const mat = realMaterial(THREE, name);
    mat.side = THREE.DoubleSide;
    g.sample = new THREE.Mesh(geo, mat);
    g.sample.position.set(g.x, g.sampleY + SAMPLE_H / 2, 0);
    g.sample.castShadow = true;
    root.add(g.sample);
  };

  // ---- temperature vs time graph ----
  const graph = graphPanel(THREE, {
    w: 6.4,
    h: 2.2,
    cols: 6,
    rows: 4,
    series: [{ color: "#38bdf8" }, { color: "#fb923c", z: 0.001 }],
    maxPoints: MAX_HIST,
  });
  graph.position.set(-3.2, 2.4, -1.8);
  root.add(graph);
  const gTitle = textLabel(THREE, "Temperature vs time, same burner power", { height: 0.2 });
  gTitle.position.set(0, 4.95, -1.8);
  const yTop = textLabel(THREE, "", { height: 0.16, color: "#94a3b8" });
  yTop.position.set(-3.65, 4.6, -1.8);
  const yBot = textLabel(THREE, "", { height: 0.16, color: "#94a3b8" });
  yBot.position.set(-3.65, 2.4, -1.8);
  const x0 = textLabel(THREE, "0 s", { height: 0.16, color: "#94a3b8" });
  x0.position.set(-3.1, 2.2, -1.8);
  const x1 = textLabel(THREE, "", { height: 0.16, color: "#94a3b8" });
  x1.position.set(3.0, 2.2, -1.8);
  root.add(gTitle, yTop, yBot, x0, x1);

  const updateStation = (g, T, parts, mat, T0, Tmax, tint) => {
    if (mat.name !== g.matName) buildSample(g, mat.name);
    const t01 = clamp(norm(T, T0, Tmax), 0, 1);
    setHeat(g.field.material, t01);
    setHeat(g.liquidMat, t01);
    const n = Math.min((parts || []).length, 32);
    const r = SAMPLE_R - 0.1;
    for (let i = 0; i < n; i++) {
      const p = parts[i];
      const x = (p.x - 0.5) * 2 * r;
      const zMax = Math.sqrt(Math.max(0, r * r - x * x));
      place(g.field, i, g.x + x, g.sampleY + 0.06 + (1 - p.y) * (SAMPLE_H - 0.12), depthFor(i + (g.x > 0 ? 50 : 0)) * zMax, 0.045);
    }
    g.field.count = n;
    g.field.instanceMatrix.needsUpdate = true;
    const lh = Math.max(0.001, t01) * 1.1;
    g.liquid.scale.y = lh;
    g.liquid.position.set(g.tubeX, STOVE_H + 0.42 + lh / 2, 0.3);
    g.name.setText(`${mat.name} · c = ${mat.value} J/kg·K`, tint);
    g.temp.setText(`${fmt(T, 1)} °C`, heatTextColor(t01));
  };

  // Points are stored against a fixed 60 s axis and only new ones are
  // written each frame; the line is then stretched by 60 / tMax, which is
  // the same x = t / tMax mapping the 2D graph uses.
  const drawn = [
    { hist: null, n: 0 },
    { hist: null, n: 0 },
  ];
  const fillHist = (k, hist, tMax, T0, Tmax) => {
    const d = drawn[k];
    if (hist !== d.hist || hist.length < d.n) {
      d.hist = hist;
      d.n = 0;
    }
    const end = Math.min(hist.length, MAX_HIST);
    if (end > d.n) {
      for (let i = d.n; i < end; i++) {
        const pt = hist[i];
        graph.setPoint(k, i, pt.t / 60, clamp(norm(pt.T, T0, Tmax), 0, 1));
      }
      d.n = end;
      graph.setCount(k, end);
    } else if (end === 0) {
      graph.setCount(k, 0);
    }
    graph.stretchX(k, 60 / tMax);
  };

  return {
    home: {
      position: [0.2, 4.2, 9.6],
      target: [0, 2.0, 0],
      minDistance: 5,
      maxDistance: 15,
    },
    update({ Ta, Tb, t, histA, histB, partsA, partsB, matA, matB, T0, Tmax }) {
      updateStation(A, Ta, partsA, matA, T0, Tmax, "#38bdf8");
      updateStation(B, Tb, partsB, matB, T0, Tmax, "#fb923c");
      const tMax = Math.max(60, t);
      fillHist(0, histA, tMax, T0, Tmax);
      fillHist(1, histB, tMax, T0, Tmax);
      yTop.setText(`${fmt(Tmax, 0)} °C`);
      yBot.setText(`${fmt(T0, 0)} °C`);
      x1.setText(`${fmt(tMax, 0)} s`);

      // burner flames (2D draws them all the time)
      const ft = performance.now() / 120;
      [A, B].forEach((g) =>
        g.flames.forEach((f, i) => {
          f.scale.y = ((14 + Math.sin(ft + i * 2) * 4) / 40) * 0.55;
        }),
      );
    },
    dispose() {},
  };
}
