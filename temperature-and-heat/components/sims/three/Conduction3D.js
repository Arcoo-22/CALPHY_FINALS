// ============================================================
// Conduction rod (Lesson 3), 3D view.
// Reads ConductionSim's live state: the 30-node temperature array T,
// hot (T_COLD + ΔT) and cold ends, the heat packets and the material.
// Segment colour = heatColor(clamp(norm(T[i], cold, hot), 0, 1)),
// atom jitter amplitude = 1.5 + t01·6.5, packet colour =
// heatColor(1 − x·0.85), all as in the 2D draw.
// Scene: rod between a brick furnace and an ice block on steel stands,
// end collars in the chosen material, temperature profile on a grid.
// ============================================================
import { norm, clamp } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { setHeatColor } from "./colors";
import {
  heatMaterial,
  setHeat,
  realMaterial,
  ice,
  steel,
  flame,
  glowField,
  makePlacer,
  floorGrid,
  graphPanel,
  textLabel,
} from "./kit";

const ROD_L = 6;
const ROD_R = 0.3;
const ROD_Y = 1.3;
const LANE_Y = 0.55;
const MAX_PACKETS = 200;

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 16 }));
  const place = makePlacer(THREE);
  const tmp = new THREE.Color();

  // ---- hot side: brick furnace with an opening and flames ----
  const furnace = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.0, 1.6), realMaterial(THREE, "Brick"));
  furnace.position.set(-ROD_L / 2 - 0.6, 1.0, 0);
  furnace.castShadow = furnace.receiveShadow = true;
  const mouth = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.6),
    new THREE.MeshBasicMaterial({ color: 0x1c0a03 }),
  );
  mouth.position.set(furnace.position.x, 0.55, 0.801);
  root.add(furnace, mouth);
  const flames = [0, 1, 2].map((i) => {
    const f = flame(THREE);
    f.position.set(furnace.position.x + (i - 1) * 0.2, 0.28, 0.85);
    root.add(f);
    return f;
  });
  const fireLight = new THREE.PointLight(0xff6b35, 2.5, 4, 2);
  fireLight.position.set(furnace.position.x, 0.6, 1.2);
  root.add(fireLight);

  // ---- cold side: ice block ----
  const iceBlock = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 1.5), ice(THREE));
  iceBlock.position.set(ROD_L / 2 + 0.6, 0.8, 0);
  iceBlock.castShadow = true;
  root.add(iceBlock);

  // ---- steel stands ----
  const stand = steel(THREE);
  [-1.6, 1.6].forEach((x) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, ROD_Y - ROD_R, 12), stand);
    post.position.set(x, (ROD_Y - ROD_R) / 2, 0);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 24), stand);
    foot.position.set(x, 0.025, 0);
    post.castShadow = foot.castShadow = true;
    root.add(post, foot);
  });

  // ---- heat-flow lane + packets ----
  const lane = new THREE.Mesh(
    new THREE.BoxGeometry(ROD_L, 0.01, 0.01),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 }),
  );
  lane.position.y = LANE_Y;
  root.add(lane);
  const packets = glowField(THREE, MAX_PACKETS);
  root.add(packets);

  // ---- temperature profile on a grid (cold → hot = bottom → top) ----
  const graph = graphPanel(THREE, {
    w: ROD_L,
    h: 1.6,
    cols: 10,
    rows: 4,
    series: [{ color: "#fbbf24" }],
    maxPoints: 64,
  });
  graph.position.set(-ROD_L / 2, 2.3, -0.9);
  root.add(graph);
  const graphTitle = textLabel(THREE, "Temperature along the rod", { height: 0.2 });
  graphTitle.position.set(0, 4.2, -0.9);
  root.add(graphTitle);

  // ---- labels ----
  const hotTag = textLabel(THREE, "", { height: 0.22, color: "#fdba74", weight: 800 });
  hotTag.position.set(furnace.position.x, 2.35, 0);
  const coldTag = textLabel(THREE, "", { height: 0.22, color: "#7dd3fc", weight: 800 });
  coldTag.position.set(iceBlock.position.x, 1.95, 0);
  const matTag = textLabel(THREE, "", { height: 0.2, color: "#e2e8f0" });
  matTag.position.set(0, ROD_Y + 0.6, 0.3);
  const flowTag = textLabel(THREE, "Heat flow →", { height: 0.18, color: "#cbd5e1" });
  flowTag.position.set(-ROD_L / 2 + 0.7, LANE_Y - 0.25, 0);
  root.add(hotTag, coldTag, matTag, flowTag);

  // ---- rod (rebuilt when the node count changes) and collars (per material) ----
  let n = 0;
  let segs = [];
  let atoms = null;
  let matName = "";
  let collars = [];
  const profile = new Float32Array(128);

  const buildRod = (count) => {
    segs[0]?.geometry.dispose();
    segs.forEach((m) => {
      root.remove(m);
      m.material.dispose();
    });
    if (atoms) {
      root.remove(atoms);
      atoms.geometry.dispose();
      atoms.material.dispose();
      atoms.dispose();
    }
    n = count;
    const segL = ROD_L / n;
    const geo = new THREE.CylinderGeometry(ROD_R, ROD_R, segL * 0.96, 28);
    geo.rotateZ(Math.PI / 2);
    segs = Array.from({ length: n }, (_, i) => {
      const m = new THREE.Mesh(geo, heatMaterial(THREE, { roughness: 0.35, clearcoat: 0.8 }));
      m.position.set(-ROD_L / 2 + (i + 0.5) * segL, ROD_Y, 0);
      m.castShadow = true;
      root.add(m);
      return m;
    });
    atoms = glowField(THREE, n);
    for (let i = 0; i < n; i++) atoms.setColorAt(i, tmp.set(0xffffff));
    root.add(atoms);
  };

  const buildCollars = (name) => {
    collars.forEach((c) => {
      root.remove(c);
      c.geometry.dispose();
      c.material.map?.dispose();
      c.material.dispose();
    });
    matName = name;
    collars = [-ROD_L / 2 + 0.12, ROD_L / 2 - 0.12].map((x) => {
      const geo = new THREE.CylinderGeometry(ROD_R + 0.08, ROD_R + 0.08, 0.24, 32);
      geo.rotateZ(Math.PI / 2);
      const c = new THREE.Mesh(geo, realMaterial(THREE, name));
      c.position.set(x, ROD_Y, 0);
      c.castShadow = true;
      root.add(c);
      return c;
    });
  };

  return {
    home: {
      position: [0.4, 3.4, 9.4],
      target: [0, 1.6, 0],
      minDistance: 5,
      maxDistance: 15,
    },
    update({ T, hot, cold, packets: list, mat }) {
      if (!T) return;
      if (T.length !== n) buildRod(T.length);
      if (mat && mat.name !== matName) buildCollars(mat.name);
      const now = performance.now();
      const segL = ROD_L / n;
      for (let i = 0; i < n; i++) {
        const t01 = clamp(norm(T[i], cold, hot), 0, 1);
        setHeat(segs[i].material, t01);
        // vibration amplitude ∝ temperature (same timing as 2D)
        const amp = (1.5 + t01 * 6.5) * 0.02;
        const jx = Math.sin(now / (60 + 240 * (1 - t01)) + i * 13.7) * amp;
        const jy = Math.cos(now / (70 + 260 * (1 - t01)) + i * 7.3) * amp;
        place(atoms, i, -ROD_L / 2 + (i + 0.5) * segL + jx * 0.5, ROD_Y + jy * 0.5, ROD_R + 0.04, 0.05);
        profile[i * 2] = n > 1 ? i / (n - 1) : 0;
        profile[i * 2 + 1] = t01;
      }
      atoms.instanceMatrix.needsUpdate = true;
      graph.setSeries(0, profile, n);

      const pk = list || [];
      const count = Math.min(pk.length, MAX_PACKETS);
      for (let i = 0; i < count; i++) {
        const p = pk[i];
        const y = LANE_Y + Math.sin(now / 300 + p.wobble) * 0.04;
        place(packets, i, -ROD_L / 2 + p.x * ROD_L, y, 0, 0.07);
        packets.setColorAt(i, setHeatColor(tmp, 1 - p.x * 0.85));
      }
      packets.count = count;
      packets.instanceMatrix.needsUpdate = true;
      if (packets.instanceColor) packets.instanceColor.needsUpdate = true;

      const ft = now / 130;
      flames.forEach((f, i) => {
        f.scale.y = (22 + Math.sin(ft + i * 2.1) * 5 + (i === 1 ? 8 : 0)) / 70;
      });
      fireLight.intensity = 2.2 + Math.sin(ft * 1.7) * 0.4;

      hotTag.setText(`Hot ${fmt(hot, 0)} °C`);
      coldTag.setText(`Cold ${fmt(cold, 0)} °C`);
      if (mat) matTag.setText(`${mat.name} · k = ${mat.value} ${mat.unit}`);
    },
    dispose() {
      // rod, collars and labels live in the scene and are disposed with it
    },
  };
}
