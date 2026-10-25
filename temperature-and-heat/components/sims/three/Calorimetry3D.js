// ============================================================
// Calorimetry (Lesson 6), 3D view.
// Reads CalorimetrySim's live state: phase, drop offset, TobjNow,
// TwNow, iceLeft, Tf, the water particles and the current inputs.
// Same rules as the 2D draw: water colour heatColor(norm(wT, −20, 100)),
// object glow heatColor(norm(TobjNow, 0, 200)), ice cube count and size
// from iceLeft / mIce, object size from mObj.
// Scene: cut-away foam calorimeter around a glass beaker, a sample of
// the real material that drops in, ice cubes, thermometer, stirrer.
// ============================================================
import { norm, clamp, heatTextColor } from "@/lib/canvas";
import { fmt } from "@/lib/constants";
import { setHeatColor, depthFor } from "./colors";
import {
  realMaterial,
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
  textLabel,
} from "./kit";

const CUP_R = 1.2;
const CUP_H = 2.4;
const WATER_H = CUP_H * 0.62;
const DROP_PX = 220; // 2D hover → rest distance at the default canvas height

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 14 }));
  const place = makePlacer(THREE);
  const tmp = new THREE.Color();

  // ---- insulation (foam, front cut away) + glass beaker inside ----
  const foam = realMaterial(THREE, "Foam");
  foam.side = THREE.DoubleSide;
  const shell = new THREE.Mesh(
    // theta 0 points at the camera (+z); leave a front opening of 0.6π
    new THREE.CylinderGeometry(CUP_R + 0.35, CUP_R + 0.35, CUP_H + 0.1, 48, 1, true, Math.PI * 0.3, Math.PI * 1.4),
    foam,
  );
  shell.position.y = (CUP_H + 0.1) / 2;
  const shellBase = new THREE.Mesh(new THREE.CylinderGeometry(CUP_R + 0.35, CUP_R + 0.35, 0.12, 48), foam);
  shellBase.position.y = 0.06;
  shell.castShadow = shell.receiveShadow = true;
  const cup = beaker(THREE, CUP_R, CUP_H);
  cup.position.y = 0.12;
  root.add(shell, shellBase, cup);

  // graduation marks on the beaker (every 1/8 of the height)
  for (let i = 1; i <= 7; i++) {
    const tick = new THREE.Mesh(
      new THREE.TorusGeometry(CUP_R + 0.004, i % 2 ? 0.005 : 0.009, 4, 32, Math.PI * 0.18),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }),
    );
    tick.rotation.x = Math.PI / 2;
    tick.rotation.z = Math.PI * 0.41;
    tick.position.y = 0.12 + (CUP_H * i) / 8;
    root.add(tick);
  }

  // ---- water: refractive body + surface tinted like the 2D gradient top ----
  const waterMat = water(THREE);
  const waterBody = new THREE.Mesh(new THREE.CylinderGeometry(CUP_R - 0.04, CUP_R - 0.04, WATER_H, 48), waterMat);
  waterBody.position.y = 0.14 + WATER_H / 2;
  const surfaceMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5, toneMapped: false, depthWrite: false });
  const surfaceGeo = new THREE.CircleGeometry(CUP_R - 0.05, 48);
  surfaceGeo.rotateX(-Math.PI / 2);
  const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
  surface.position.y = 0.14 + WATER_H + 0.002;
  root.add(waterBody, surface);
  const deep = new THREE.Color().setRGB(30 / 255, 64 / 255, 175 / 255, "srgb");

  const parts = glowField(THREE, 80, 8);
  for (let i = 0; i < 80; i++) parts.setColorAt(i, tmp.set(0xffffff));
  root.add(parts);

  // ---- ice cubes ----
  const iceMat = ice(THREE);
  const cubes = [0, 1, 2].map(() => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), iceMat);
    c.castShadow = true;
    root.add(c);
    return c;
  });

  // ---- thermometer + stirrer ----
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, CUP_H + 0.6, 20, 1, true), glass(THREE));
  tube.position.set(-CUP_R * 0.55, 0.3 + (CUP_H + 0.6) / 2, -CUP_R * 0.35);
  const thermoMat = heatMaterial(THREE);
  const thermoLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 12), thermoMat);
  const stir = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, CUP_H + 0.8, 12), steel(THREE));
  stir.position.set(CUP_R * 0.1, 0.4 + (CUP_H + 0.8) / 2, -CUP_R * 0.6);
  stir.castShadow = true;
  root.add(tube, thermoLiquid, stir);

  // ---- hot object (real material, glowing edges by temperature) ----
  let objMatName = "Copper";
  let objMat = realMaterial(THREE, "Copper");
  const objGeo = new THREE.BoxGeometry(1, 1, 1);
  const obj = new THREE.Mesh(objGeo, objMat);
  obj.castShadow = true;
  const objEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(objGeo),
    new THREE.LineBasicMaterial({ color: 0xffffff, toneMapped: false }),
  );
  obj.add(objEdges);
  const objLight = new THREE.PointLight(0xff6b35, 0, 2.5, 2);
  obj.add(objLight);
  root.add(obj);

  // ---- heat-flow arrow + splash ----
  const flowGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(1, 0, 0)]);
  const flowMat = new THREE.LineDashedMaterial({ color: 0xfb923c, dashSize: 0.12, gapSize: 0.12, transparent: true, opacity: 0.8, toneMapped: false });
  const flow = new THREE.Line(flowGeo, flowMat);
  root.add(flow);
  const splash = glowField(THREE, 20, 6);
  for (let i = 0; i < 20; i++) splash.setColorAt(i, tmp.setRGB(147 / 255, 197 / 255, 253 / 255, "srgb"));
  root.add(splash);
  let drops = [];
  let lastPhase = "idle";

  // ---- labels ----
  const objTag = textLabel(THREE, "", { height: 0.2 });
  const waterTag = textLabel(THREE, "", { height: 0.22, color: "#7dd3fc", weight: 800 });
  waterTag.position.set(-CUP_R - 1.1, 1.6, 0.6);
  const tfTag = textLabel(THREE, "", { height: 0.22, color: "#34d399", weight: 800 });
  tfTag.position.set(-CUP_R - 1.1, 1.25, 0.6);
  const flowTag = textLabel(THREE, "Q flows hot → cold", { height: 0.18 });
  const doneTag = textLabel(THREE, "Equilibrium", { height: 0.28, color: "#34d399", weight: 800 });
  doneTag.position.set(0, CUP_H + 1.9, 0);
  const iceTag = textLabel(THREE, "", { height: 0.18, color: "#bfdbfe" });
  iceTag.position.set(0, 0.35, CUP_R + 0.7);
  root.add(objTag, waterTag, tfTag, flowTag, doneTag, iceTag);

  return {
    home: {
      position: [1.6, 4.6, 8.4],
      target: [0, 1.6, 0],
      minDistance: 4.5,
      maxDistance: 14,
    },
    update(s, dt) {
      const now = performance.now();
      const idle = s.phase === "idle";
      const wT = idle ? (s.useIce ? Math.max(s.TW, 0) : s.TW) : s.TwNow;
      const wCol = clamp(norm(wT, -20, 100), 0, 1);
      setHeatColor(surfaceMat.color, wCol);
      setHeatColor(waterMat.attenuationColor, wCol).lerp(deep, 0.5);
      setHeat(thermoMat, wCol);
      const lh = Math.max(0.001, wCol) * (CUP_H + 0.4);
      thermoLiquid.scale.y = lh;
      thermoLiquid.position.set(tube.position.x, 0.35 + lh / 2, tube.position.z);

      // water particles (2D moves them; faster while mixing)
      const list = s.parts || [];
      const n = Math.min(list.length, 80);
      const r = CUP_R - 0.15;
      for (let i = 0; i < n; i++) {
        const p = list[i];
        const x = (p.x - 0.5) * 2 * r;
        const zMax = Math.sqrt(Math.max(0, r * r - x * x));
        place(parts, i, x, 0.2 + (1 - p.y) * (WATER_H - 0.15), depthFor(i) * zMax, 0.03);
      }
      parts.count = n;
      parts.instanceMatrix.needsUpdate = true;

      // ice cubes
      const showIce = s.useIce && (idle || s.iceLeft > 0.001);
      const iceScale = idle ? 1 : clamp(s.iceLeft / Math.max(s.mIce, 1e-9), 0, 1);
      const nCubes = showIce ? Math.max(1, Math.round(3 * iceScale)) : 0;
      cubes.forEach((c, i) => {
        c.visible = i < nCubes;
        if (!c.visible) return;
        const size = 0.42 * (0.5 + iceScale * 0.5);
        c.scale.setScalar(size);
        c.position.set(-0.55 + i * 0.55, 0.14 + WATER_H - size * 0.35 + Math.sin(now / 700 + i) * 0.03, 0.25 - i * 0.2);
        c.rotation.y = i * 0.7;
      });
      iceTag.visible = showIce && (s.phase === "mixing" || s.phase === "done");
      iceTag.setText(`Ice left: ${fmt(s.iceLeft * 1000, 0)} g`);

      // object: real material, size from mass, glow from temperature
      if (s.mat.name !== objMatName) {
        objMat?.map?.dispose();
        objMat?.dispose();
        objMatName = s.mat.name;
        objMat = realMaterial(THREE, s.mat.name);
        obj.material = objMat;
      }
      const size = (14 + s.mObj * 26) / 60;
      obj.scale.setScalar(size);
      const hoverY = 0.12 + CUP_H + 0.7 + size / 2;
      const restY = 0.14 + WATER_H * 0.38;
      let y;
      if (idle) y = hoverY;
      else if (s.phase === "dropping") y = hoverY - (hoverY - restY) * clamp(s.objY / DROP_PX, 0, 1);
      else y = restY + Math.sin(now / 400) * 0.02;
      obj.position.set(CUP_R * 0.45, y, 0.25);
      const objT01 = clamp(norm(s.TobjNow, 0, 200), 0, 1);
      setHeatColor(objEdges.material.color, objT01);
      objLight.color.copy(objEdges.material.color);
      objLight.intensity = objT01 * 3;
      const showT = idle ? s.TObj : s.TobjNow;
      objTag.setText(`${s.mat.name} · ${fmt(s.mObj, 2)} kg · ${fmt(showT, idle ? 0 : 1)} °C`, heatTextColor(objT01));
      objTag.position.set(obj.position.x, y + size / 2 + 0.3, 0.25);

      // splash when the object hits the water (visual only)
      if (lastPhase === "dropping" && s.phase === "mixing") {
        drops = Array.from({ length: 14 }, () => ({
          x: obj.position.x,
          y: 0.14 + WATER_H,
          z: 0.25,
          vx: (Math.random() - 0.5) * 2.6,
          vy: Math.random() * 2.6,
          vz: (Math.random() - 0.5) * 1.6,
          life: 1,
        }));
      }
      lastPhase = s.phase;
      drops = drops.filter((d) => {
        d.life -= dt * 1.6;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.z += d.vz * dt;
        d.vy -= 8 * dt;
        return d.life > 0;
      });
      drops.forEach((d, i) => place(splash, i, d.x, d.y, d.z, 0.04 * d.life));
      splash.count = drops.length;
      splash.instanceMatrix.needsUpdate = true;

      // heat flow arrow while mixing
      const mixing = s.phase === "mixing";
      flow.visible = flowTag.visible = mixing;
      if (mixing) {
        const p = flowGeo.attributes.position;
        p.setXYZ(0, obj.position.x - size, y, 0.25);
        p.setXYZ(1, -CUP_R * 0.2, y, 0.25);
        p.needsUpdate = true;
        flow.computeLineDistances();
        flowMat.color.set(s.TobjNow > s.TwNow ? "#fb923c" : "#38bdf8");
        flowMat.dashOffset = -(now / 450) % 0.24;
        flowTag.position.set(-CUP_R * 0.1, y - 0.25, 0.3);
        flowTag.setText("Q flows hot → cold", s.TobjNow > s.TwNow ? "#fb923c" : "#38bdf8");
      }
      doneTag.visible = s.phase === "done";

      waterTag.setText(`Water ${fmt(wT, 1)} °C`);
      tfTag.visible = mixing || s.phase === "done";
      tfTag.setText(`Target T_f ${fmt(s.Tf, 1)} °C`);
    },
    dispose() {
      objMat?.map?.dispose();
      objMat?.dispose();
    },
  };
}
