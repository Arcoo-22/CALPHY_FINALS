// ============================================================
// Convection pot & thermal radiation (Lesson 4), 3D view.
// Follows the sim's own Convection / Radiation tab.
// Convection reads the same 150 loop particles the 2D canvas moves
// (colour heatColor(pt.t)), burner power p; flames, bubbles (p > 0.55)
// and steam follow the 2D rules.
// Radiation reads the live photons and the 2D emitter/absorber layout;
// emitter colour = Wien's-law colour from the sim, emitter size
// 34 + 26·norm(T, 300, 2500), absorber ring heatColor(norm(Ts, 200, 500)).
// ============================================================
import { norm, clamp } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { setHeatColor, cssColor, depthFor } from "./colors";
import {
  water,
  steel,
  heatMaterial,
  flame,
  glowField,
  makePlacer,
  floorGrid,
  textLabel,
} from "./kit";

const PX = 60; // 2D pixels per 3D unit
const POT = { r: 1.5, h: 1.9, y: 0.9 };
const EM = { x: -2.6, y: 1.8 };
const AB = { x: 2.8, y: 1.8 };

export default function create({ THREE, scene }) {
  const place = makePlacer(THREE);
  const tmp = new THREE.Color();
  const metal = steel(THREE);

  /* ============================ convection ============================ */
  const conv = new THREE.Group();
  scene.add(conv);
  conv.add(floorGrid(THREE, { size: 14 }));
  const stove = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.5, 0.6, 40),
    new THREE.MeshPhysicalMaterial({ color: 0x1f2937, metalness: 0.6, roughness: 0.45 }),
  );
  stove.position.y = 0.3;
  stove.castShadow = stove.receiveShadow = true;
  const grate = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 8, 48), metal);
  grate.rotation.x = Math.PI / 2;
  grate.position.y = 0.66;
  conv.add(stove, grate);
  const flames = Array.from({ length: 5 }, (_, i) => {
    const f = flame(THREE);
    f.position.set(-0.6 + i * 0.3, 0.6, 0);
    conv.add(f);
    return f;
  });
  const burnerLight = new THREE.PointLight(0xff6b35, 0, 3, 2);
  burnerLight.position.set(0, 0.7, 0.4);
  conv.add(burnerLight);

  const potMat = steel(THREE);
  potMat.side = THREE.DoubleSide;
  const pot = new THREE.Mesh(
    // theta 0 points at the camera (+z); leave a front opening of 0.6π
    new THREE.CylinderGeometry(POT.r, POT.r, POT.h, 48, 1, true, Math.PI * 0.3, Math.PI * 1.4),
    potMat,
  );
  pot.position.y = POT.y + POT.h / 2;
  const potBase = new THREE.Mesh(new THREE.CylinderGeometry(POT.r, POT.r, 0.05, 48), potMat);
  potBase.position.y = POT.y;
  [-1, 1].forEach((s) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.16), metal);
    h.position.set(s * (POT.r + 0.22), POT.y + POT.h - 0.2, 0);
    conv.add(h);
  });
  pot.castShadow = true;
  const potWater = new THREE.Mesh(new THREE.CylinderGeometry(POT.r - 0.04, POT.r - 0.04, POT.h * 0.85, 48), water(THREE, { thickness: 2 }));
  potWater.position.y = POT.y + 0.03 + (POT.h * 0.85) / 2;
  conv.add(pot, potBase, potWater);
  const convDots = glowField(THREE, 160, 8);
  conv.add(convDots);
  const bubbles = glowField(THREE, 8, 8);
  bubbles.material.transparent = true;
  bubbles.material.opacity = 0.45;
  for (let i = 0; i < 8; i++) bubbles.setColorAt(i, tmp.set(0xffffff));
  conv.add(bubbles);
  // circulation guide: two faint loops (rise in the middle, sink at the walls)
  [-1, 1].forEach((s) => {
    const curve = new THREE.EllipseCurve(s * POT.r * 0.48, POT.y + POT.h * 0.45, POT.r * 0.36, POT.h * 0.32);
    const pts = curve.getPoints(48).map((p) => new THREE.Vector3(p.x, p.y, -0.6));
    const loop = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineDashedMaterial({ color: 0xfbbf24, dashSize: 0.1, gapSize: 0.08, transparent: true, opacity: 0.4 }),
    );
    loop.computeLineDistances();
    conv.add(loop);
  });
  const steamMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.35 });
  const steam = [0, 1, 2, 3].map(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(7 * 3), 3));
    const l = new THREE.Line(geo, steamMat);
    l.frustumCulled = false;
    conv.add(l);
    return l;
  });
  const modeTag = textLabel(THREE, "", { height: 0.24, weight: 800 });
  modeTag.position.set(0, POT.y + POT.h + 1.05, 0);
  conv.add(modeTag);

  /* ============================ radiation ============================ */
  const rad = new THREE.Group();
  scene.add(rad);
  rad.add(floorGrid(THREE, { size: 14 }));
  // starfield: the space between is a vacuum
  const starPos = new Float32Array(400 * 3);
  for (let i = 0; i < 400; i++) {
    const u = Math.sin(i * 12.9898) * 0.5 + 0.5;
    const v = Math.sin(i * 78.233) * 0.5 + 0.5;
    const th = u * Math.PI * 2;
    const ph = Math.acos(2 * v - 1);
    const r = 18 + (i % 7);
    starPos.set([r * Math.sin(ph) * Math.cos(th), Math.abs(r * Math.cos(ph)) + 1, r * Math.sin(ph) * Math.sin(th)], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  rad.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 })));

  const emMat = heatMaterial(THREE, { clearcoat: 0.3 });
  const emitter = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), emMat);
  emitter.position.set(EM.x, EM.y, 0);
  const emLight = new THREE.PointLight(0xffffff, 2, 10, 1.5);
  emitter.add(emLight);
  const absorber = new THREE.Mesh(
    new THREE.SphereGeometry(30 / PX, 40, 28),
    new THREE.MeshPhysicalMaterial({ color: 0x94a3b8, metalness: 0.3, roughness: 0.55 }),
  );
  absorber.position.set(AB.x, AB.y, 0);
  absorber.castShadow = true;
  const ringGeo = new THREE.TorusGeometry(30 / PX + 0.04, 0.025, 10, 64);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ toneMapped: false }));
  ring.position.copy(absorber.position);
  [EM.x, AB.x].forEach((x) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, EM.y - 0.4, 12), metal);
    post.position.set(x, (EM.y - 0.4) / 2, 0);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 24), metal);
    foot.position.set(x, 0.025, 0);
    rad.add(post, foot);
  });
  rad.add(emitter, absorber, ring);
  const photons = glowField(THREE, 440, 6);
  for (let i = 0; i < 440; i++) photons.setColorAt(i, tmp.set(0xffffff));
  rad.add(photons);
  const flashes = new THREE.PointLight(0xfbbf24, 0, 1.5, 2);
  flashes.position.set(AB.x - 0.5, AB.y, 0.2);
  rad.add(flashes);

  const lamTag = textLabel(THREE, "", { height: 0.26, weight: 800 });
  lamTag.position.set(0, 3.9, 0);
  const emTag = textLabel(THREE, "", { height: 0.2, color: "#fdba74", weight: 700 });
  const eTag = textLabel(THREE, "", { height: 0.17, color: "#94a3b8" });
  const abTag = textLabel(THREE, "", { height: 0.2, color: "#7dd3fc", weight: 700 });
  abTag.position.set(AB.x, AB.y - 0.95, 0.8);
  const vacTag = textLabel(THREE, "No material between: vacuum ✓", { height: 0.18, color: "#94a3b8" });
  vacTag.position.set(0, 0.45, 0.8);
  rad.add(lamTag, emTag, eTag, abTag, vacTag);

  return {
    home: {
      position: [0, 3.6, 9.2],
      target: [0, 1.7, 0],
      minDistance: 4.5,
      maxDistance: 15,
    },
    update(s) {
      const now = performance.now();
      const isConv = s.tab === "convection";
      conv.visible = isConv;
      rad.visible = !isConv;

      if (isConv) {
        const p = s.power / 100;
        flames.forEach((f, i) => {
          f.visible = p > 0.02;
          // stays under the pot base (POT.y) even at full power
          f.scale.y = ((22 + Math.sin(now / 120 + i * 1.7) * 8) * (0.5 + p * 0.8)) / 140;
        });
        burnerLight.intensity = p > 0.02 ? 1.5 + p * 2.5 : 0;

        const parts = s.conv || [];
        const n = Math.min(parts.length, 160);
        const r = POT.r - 0.12;
        const top = POT.y + POT.h * 0.85 - 0.06;
        const depth = POT.h * 0.85 - 0.14;
        for (let i = 0; i < n; i++) {
          const pt = parts[i];
          const x = (pt.x - 0.5) * 2 * r;
          const zMax = Math.sqrt(Math.max(0, r * r - x * x));
          place(convDots, i, x, top - pt.y * depth, depthFor(i) * zMax, 0.045);
          convDots.setColorAt(i, setHeatColor(tmp, pt.t));
        }
        convDots.count = n;
        convDots.instanceMatrix.needsUpdate = true;
        convDots.instanceColor.needsUpdate = true;

        bubbles.visible = p > 0.55;
        if (bubbles.visible) {
          const t = now / 700;
          for (let i = 0; i < 8; i++) {
            const bx = (0.15 + ((i * 37) % 70) / 100 - 0.5) * 2 * r;
            const by = ((t * 60 + i * 53) / 60) % depth;
            place(bubbles, i, bx, POT.y + 0.1 + by, Math.sin(i * 2.1) * 0.6, (2.5 + (i % 3)) * 0.016);
          }
          bubbles.instanceMatrix.needsUpdate = true;
        }
        steam.forEach((l, i) => {
          l.visible = p > 0.3;
          if (!l.visible) return;
          const pos = l.geometry.attributes.position;
          for (let k = 0; k <= 6; k++) {
            const yy = k * 5;
            const y = POT.y + POT.h + 0.05 + (yy + ((now / 40 + i * 13) % 14)) * 0.022;
            pos.setXYZ(k, (i - 1.5) * 0.45 + Math.sin((yy + now / 26 + i * 30) / 7) * 0.06, y, 0);
          }
          pos.needsUpdate = true;
        });
        steamMat.opacity = 0.15 + p * 0.3;
        modeTag.setText(
          s.power > 55 ? "Boiling-like convection" : s.power > 5 ? "Gentle convection current" : "Burner off: no bulk motion",
          s.power > 5 ? "#fbbf24" : "#94a3b8",
        );
        return;
      }

      // ---- radiation ----
      const T = s.tempK;
      const er = (34 + 26 * clamp(norm(T, 300, 2500), 0, 1)) / PX;
      emitter.scale.setScalar(er);
      const col = cssColor(THREE, s.color);
      emMat.emissive.copy(col);
      emLight.color.copy(col);
      emLight.intensity = 1 + s.pFrac * 12;
      setHeatColor(ring.material.color, clamp(norm(s.surrK, 200, 500), 0, 1));
      photons.material.color.copy(col);

      const live = s.rad;
      let n = 0;
      if (live && live.ax !== live.ex) {
        const list = live.photons;
        const span = AB.x - 30 / PX - (EM.x + er);
        const n2d = live.ax - live.ar - (live.ex + live.er);
        // one scale for both axes, so the beam keeps its 2D spread angle
        const unit = span / (n2d || 1);
        n = Math.min(list.length, 440);
        for (let i = 0; i < n; i++) {
          const ph = list[list.length - n + i];
          const f = clamp((ph.x - (live.ex + live.er)) / (n2d || 1), 0, 1);
          const x = EM.x + er + f * span;
          const y = EM.y - (ph.y - live.ey) * unit + Math.sin(ph.wave) * 0.04;
          place(photons, i, x, y, depthFor(i) * f * 0.9, 0.09, 0.022, 0.022);
        }
      }
      photons.count = n;
      photons.instanceMatrix.needsUpdate = true;
      flashes.intensity = Math.random() < s.pFrac * 0.5 + 0.05 ? 1.5 : 0;

      const lam = s.lamNm;
      lamTag.setText(
        `λ_max = ${lam >= 1000 ? `${fmt(lam / 1000, 2)} μm` : `${fmt(lam, 0)} nm`} (${s.band})`,
        s.color.startsWith("rgba") ? s.color.replace(/,[^,]*\)$/, ")") : s.color,
      );
      emTag.setText(`Emitter · ${fmt(T, 0)} K`);
      // labels sit in front of the stand posts
      emTag.position.set(EM.x, EM.y - er - 0.35, 0.8);
      eTag.setText(`e = ${s.e}`);
      eTag.position.set(EM.x, EM.y - er - 0.62, 0.8);
      abTag.setText(`Absorber · ${fmt(s.surrK, 0)} K`);
    },
    dispose() {},
  };
}
