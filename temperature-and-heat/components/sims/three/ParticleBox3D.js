// ============================================================
// Cup vs Pool (Lesson 2), 3D view.
// Reads ParticleBoxSim's live state: cupT, poolT and the same
// 18 cup / 110 pool particles the 2D loop moves.
// Colour = heatColor(clamp(norm(T, 0, 100), 0, 1)), as in 2D drawBox.
// Scene: a glass cup and a tiled pool basin, both holding water,
// on a gridded floor.
// ============================================================
import { norm, clamp, heatTextColor } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { depthFor } from "./colors";
import {
  beaker,
  water,
  particleField,
  setHeat,
  makePlacer,
  floorGrid,
  gridLines,
  textLabel,
} from "./kit";

const CUP = { x: -3.3, r: 0.62, h: 1.7 };
const POOL = { x: 1.1, w: 5.4, h: 1.5, d: 3.4, wall: 0.16 };

// Pale ceramic tiles for the pool basin.
function tileMaterial(THREE) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#9fb4c7";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#dce7f1";
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 4; x++) ctx.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0 });
}

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 16, x: -0.6 }));
  const place = makePlacer(THREE);

  // ---- cup: glass with water ----
  const cup = beaker(THREE, CUP.r, CUP.h);
  cup.position.x = CUP.x;
  const cupWater = new THREE.Mesh(
    new THREE.CylinderGeometry(CUP.r - 0.04, CUP.r - 0.06, CUP.h * 0.82, 40),
    water(THREE, { thickness: 0.4, attenuationDistance: 12, opacity: 0.7 }),
  );
  cupWater.position.set(CUP.x, 0.04 + (CUP.h * 0.82) / 2, 0);
  root.add(cup, cupWater);
  const cupField = particleField(THREE, 32);
  root.add(cupField);

  // ---- pool: tiled basin (four walls + floor) with water ----
  const tiles = tileMaterial(THREE);
  const { w, h, d, wall } = POOL;
  const parts = [
    [w + wall * 2, wall, d + wall * 2, 0, wall / 2, 0],
    [w + wall * 2, h, wall, 0, h / 2, -d / 2 - wall / 2],
    [w + wall * 2, h, wall, 0, h / 2, d / 2 + wall / 2],
    [wall, h, d, -w / 2 - wall / 2, h / 2, 0],
    [wall, h, d, w / 2 + wall / 2, h / 2, 0],
  ];
  parts.forEach(([bw, bh, bd, x, y, z], i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), tiles);
    m.position.set(POOL.x + x, y, z);
    m.castShadow = m.receiveShadow = true;
    // keep the front wall low so the water and particles stay visible
    if (i === 2) {
      m.scale.y = 0.35;
      m.position.y = (h * 0.35) / 2;
    }
    root.add(m);
  });
  const poolWater = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.02, h * 0.8, d - 0.02),
    // thin tint so the particles keep their exact heat colour
    water(THREE, { thickness: 0.4, attenuationDistance: 12, opacity: 0.7 }),
  );
  poolWater.position.set(POOL.x, wall + (h * 0.8) / 2, 0);
  const poolGrid = gridLines(THREE, w, h, 10, 3, { opacity: 0.16 });
  poolGrid.position.set(POOL.x - w / 2, 0, -d / 2 + 0.01);
  root.add(poolWater, poolGrid);
  const poolField = particleField(THREE, 160);
  root.add(poolField);

  // ---- labels ----
  const cupTag = textLabel(THREE, "Cup · 0.2 kg", { height: 0.22 });
  cupTag.position.set(CUP.x, CUP.h + 0.75, 0);
  const cupTemp = textLabel(THREE, "", { height: 0.3, weight: 800 });
  cupTemp.position.set(CUP.x, CUP.h + 0.38, 0);
  const poolTag = textLabel(THREE, "Pool · 50 kg", { height: 0.22 });
  poolTag.position.set(POOL.x, h + 0.75, -d / 2);
  const poolTemp = textLabel(THREE, "", { height: 0.3, weight: 800 });
  poolTemp.position.set(POOL.x, h + 0.38, -d / 2);
  root.add(cupTag, cupTemp, poolTag, poolTemp);

  const setTemp = (label, T) => {
    label.setText(`${fmt(T, 1)} °C`, heatTextColor(clamp(norm(T, 0, 100), 0, 1)));
  };

  return {
    home: {
      position: [-0.6, 4.2, 9],
      target: [-0.6, 0.8, 0],
      minDistance: 5,
      maxDistance: 15,
    },
    update({ cupT, poolT, parts: list }) {
      if (!list) return;
      // cup: x across the diameter, depth kept inside the circle
      setHeat(cupField.material, clamp(norm(cupT, 0, 100), 0, 1));
      const nc = Math.min(list.cup.length, 32);
      const r = CUP.r - 0.12;
      const cupH = CUP.h * 0.82 - 0.14;
      for (let i = 0; i < nc; i++) {
        const p = list.cup[i];
        const x = (p.x - 0.5) * 2 * r;
        const zMax = Math.sqrt(Math.max(0, r * r - x * x));
        place(cupField, i, CUP.x + x, 0.1 + (1 - p.y) * cupH, depthFor(i) * zMax, p.r * 0.022);
      }
      cupField.count = nc;
      cupField.instanceMatrix.needsUpdate = true;

      setHeat(poolField.material, clamp(norm(poolT, 0, 100), 0, 1));
      const np = Math.min(list.pool.length, 160);
      const poolH = h * 0.8 - 0.14;
      for (let i = 0; i < np; i++) {
        const p = list.pool[i];
        place(
          poolField,
          i,
          POOL.x + (p.x - 0.5) * (w - 0.24),
          wall + 0.07 + (1 - p.y) * poolH,
          depthFor(i + 100) * (d / 2 - 0.12),
          p.r * 0.022,
        );
      }
      poolField.count = np;
      poolField.instanceMatrix.needsUpdate = true;

      setTemp(cupTemp, cupT);
      setTemp(poolTemp, poolT);
    },
    dispose() {},
  };
}
