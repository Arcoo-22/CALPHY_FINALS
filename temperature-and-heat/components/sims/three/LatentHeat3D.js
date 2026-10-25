// ============================================================
// Measuring latent heat, electrical method (Lesson 8), 3D view.
// Reads LatentHeatSim's live state: mode, running, mDone, total mass,
// heater power and the readout (Q supplied). Same rules as the 2D draw:
// melt → water height 0.55·(1 − fracLeft·0.55), ice width ∝ √fracLeft,
// ice height ∝ fracLeft; boil → water at 70 %, bubbles while running.
// Scene: glass beaker on a digital balance, immersion heater coil wired
// to a power supply, graduations on the beaker, gridded floor.
// ============================================================
import { clamp } from "@/lib/canvas";
import { fmt, fmtSci } from "@/lib/constants";
import {
  beaker,
  water,
  ice,
  steel,
  glowField,
  makePlacer,
  floorGrid,
  textLabel,
} from "./kit";

const B_R = 1.15;
const B_H = 2.6;
const SCALE_H = 0.35;
const SUPPLY = { x: 3.0, y: 0.6, w: 1.6, h: 1.2, d: 1.0 };

export default function create({ THREE, scene }) {
  const root = new THREE.Group();
  scene.add(root);
  root.add(floorGrid(THREE, { size: 16, x: 1 }));
  const place = makePlacer(THREE);
  const tmp = new THREE.Color();
  const metal = steel(THREE);
  const plastic = new THREE.MeshPhysicalMaterial({ color: 0x1f2937, roughness: 0.55, clearcoat: 0.4 });

  // ---- digital balance ----
  const balance = new THREE.Mesh(new THREE.BoxGeometry(3.0, SCALE_H, 2.6), plastic);
  balance.position.y = SCALE_H / 2;
  const pan = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.05, 48), metal);
  pan.position.y = SCALE_H + 0.025;
  balance.castShadow = balance.receiveShadow = pan.receiveShadow = true;
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(1.1, 0.22),
    new THREE.MeshBasicMaterial({ color: 0x0b1f14 }),
  );
  display.position.set(0, SCALE_H / 2, 1.301);
  root.add(balance, pan, display);
  const baseY = SCALE_H + 0.05;

  // ---- beaker + graduations ----
  const cup = beaker(THREE, B_R, B_H);
  cup.position.y = baseY;
  root.add(cup);
  for (let i = 1; i <= 9; i++) {
    const tick = new THREE.Mesh(
      new THREE.TorusGeometry(B_R + 0.004, i % 2 ? 0.005 : 0.009, 4, 32, Math.PI * 0.16),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }),
    );
    tick.rotation.x = Math.PI / 2;
    tick.rotation.z = Math.PI * 0.42;
    tick.position.y = baseY + (B_H * i) / 10;
    root.add(tick);
  }

  // ---- contents ----
  const waterMat = water(THREE);
  const waterBody = new THREE.Mesh(new THREE.CylinderGeometry(B_R - 0.05, B_R - 0.05, 1, 48), waterMat);
  const iceBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), ice(THREE));
  iceBlock.castShadow = true;
  root.add(waterBody, iceBlock);
  const bubbles = glowField(THREE, 10, 8);
  bubbles.material.transparent = true;
  bubbles.material.opacity = 0.5;
  for (let i = 0; i < 10; i++) bubbles.setColorAt(i, tmp.set(0xffffff));
  root.add(bubbles);

  // steam wisps: 5 wavy lines (2D shape, in 3D)
  const wispMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.4 });
  const wisps = Array.from({ length: 5 }, () => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(7 * 3), 3));
    const line = new THREE.Line(geo, wispMat);
    line.frustumCulled = false;
    root.add(line);
    return line;
  });

  // ---- immersion heater: steel sheath helix glowing when on ----
  class Helix extends THREE.Curve {
    getPoint(t, target = new THREE.Vector3()) {
      const a = t * Math.PI * 2 * 4;
      return target.set(Math.cos(a) * 0.55, 0.12 + t * 0.4, Math.sin(a) * 0.55);
    }
  }
  const coilMat = new THREE.MeshPhysicalMaterial({ color: 0x9ca3af, metalness: 1, roughness: 0.35, emissive: 0x000000, toneMapped: false });
  const coil = new THREE.Mesh(new THREE.TubeGeometry(new Helix(), 160, 0.04, 8), coilMat);
  coil.position.y = baseY;
  const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, B_H + 0.2, 8), metal);
  lead.position.set(0.55, baseY + 0.5 + (B_H + 0.2) / 2, 0);
  root.add(coil, lead);
  const heatLight = new THREE.PointLight(0xfb7185, 0, 3, 2);
  heatLight.position.set(0, baseY + 0.4, 0);
  root.add(heatLight);
  const coilOn = new THREE.Color().setRGB(251 / 255, 113 / 255, 133 / 255, "srgb");

  // ---- power supply + cable ----
  const supply = new THREE.Mesh(new THREE.BoxGeometry(SUPPLY.w, SUPPLY.h, SUPPLY.d), plastic);
  supply.position.set(SUPPLY.x, SUPPLY.y, -0.4);
  supply.castShadow = true;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.45), new THREE.MeshBasicMaterial({ color: 0x0b1f14 }));
  screen.position.set(SUPPLY.x, SUPPLY.y + 0.15, -0.4 + SUPPLY.d / 2 + 0.001);
  const cable = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.55, baseY + B_H + 0.6, 0),
        new THREE.Vector3(1.4, baseY + B_H + 0.9, -0.2),
        new THREE.Vector3(2.4, SUPPLY.y + 1.2, -0.4),
        new THREE.Vector3(SUPPLY.x - 0.4, SUPPLY.y + SUPPLY.h / 2, -0.4),
      ]),
      48,
      0.03,
      6,
    ),
    new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 }),
  );
  root.add(supply, screen, cable);

  // ---- labels ----
  const ruleTag = textLabel(THREE, "", { height: 0.22, weight: 700 });
  ruleTag.position.set(0, baseY + B_H + 0.45, 0);
  const massTag = textLabel(THREE, "", { height: 0.2, weight: 800 });
  massTag.position.set(0, baseY + 0.3, B_R + 0.4);
  const scaleTag = textLabel(THREE, "", { height: 0.16, color: "#4ade80", weight: 800 });
  scaleTag.position.set(0, SCALE_H / 2, 1.32);
  const powerTag = textLabel(THREE, "", { height: 0.16, color: "#4ade80", weight: 800 });
  powerTag.position.set(SUPPLY.x, SUPPLY.y + 0.25, -0.4 + SUPPLY.d / 2 + 0.01);
  const qTag = textLabel(THREE, "", { height: 0.15, color: "#4ade80", weight: 800 });
  qTag.position.set(SUPPLY.x, SUPPLY.y + 0.05, -0.4 + SUPPLY.d / 2 + 0.01);
  root.add(ruleTag, massTag, scaleTag, powerTag, qTag);

  return {
    home: {
      position: [1.6, 4.4, 9.2],
      target: [0.8, 1.6, 0],
      minDistance: 5,
      maxDistance: 15,
    },
    update({ mode, running, mDone, total, power, Q }) {
      const now = performance.now();
      const fracLeft = clamp(1 - mDone / total, 0, 1);
      const melt = mode === "melt";

      // water level and ice block (2D proportions)
      const wH = melt ? B_H * 0.55 * (1 - fracLeft * 0.55) : B_H * 0.7;
      waterBody.scale.y = Math.max(0.001, wH - 0.04);
      waterBody.position.y = baseY + 0.02 + wH / 2;
      waterMat.attenuationColor.set(melt ? "#38bdf8" : "#1d4ed8");
      iceBlock.visible = melt && fracLeft > 0.02;
      if (iceBlock.visible) {
        const iceW = (B_R * 2 - 0.5) * Math.sqrt(fracLeft);
        const iceH = B_H * 0.42 * fracLeft;
        iceBlock.scale.set(iceW, iceH, Math.min(iceW, B_R * 1.3));
        iceBlock.position.y = baseY + wH + iceH / 2 - iceH * 0.1;
      }

      // bubbles while boiling
      bubbles.visible = !melt && running && fracLeft > 0.02;
      if (bubbles.visible) {
        const t = now / 500;
        for (let i = 0; i < 10; i++) {
          const x = ((i * 37) % 90) / 100;
          const y = ((t * 80 + i * 41) / 100) % (B_H * 0.6);
          place(bubbles, i, (x - 0.45) * 1.8, baseY + y, Math.sin(i * 1.9) * 0.5, (2.5 + (i % 3)) * 0.012);
        }
        bubbles.instanceMatrix.needsUpdate = true;
      }

      // steam wisps above boiling water
      const t2 = now / 800;
      wisps.forEach((line, i) => {
        line.visible = !melt;
        if (melt) return;
        const pos = line.geometry.attributes.position;
        const sx = (i - 2) * 0.35;
        for (let k = 0; k <= 6; k++) {
          const yy = k * 5;
          const yTop = baseY + wH + 0.08 + (yy + ((t2 * 26 + i * 11) % 16)) * 0.025;
          const xx = sx + Math.sin((yy + t2 * 40 + i * 30) / 8) * 0.08;
          pos.setXYZ(k, xx, yTop, Math.cos(i) * 0.3);
        }
        pos.needsUpdate = true;
      });
      wispMat.opacity = running ? 0.4 : 0.12;

      // heater glow
      coilMat.emissive.copy(running ? coilOn : tmp.set(0x000000));
      heatLight.intensity = running ? 2.2 : 0;

      // labels
      const left = mDone >= total ? 0 : total - mDone;
      if (melt) {
        ruleTag.setText("Melting at 0 °C: T stays constant", "#93c5fd");
        massTag.setText(fracLeft > 0.02 ? `Ice: ${fmt(left, 3)} kg left` : "All melted ✓", fracLeft > 0.02 ? "#e2e8f0" : "#34d399");
      } else {
        ruleTag.setText("Boiling at 100 °C: T stays constant", "#fca5a5");
        massTag.setText(`Water left: ${fmt(total - mDone, 3)} kg`, "#dbeafe");
      }
      scaleTag.setText(`${fmt(left, 3)} kg`);
      powerTag.setText(`${power} W`);
      qTag.setText(`Q = ${fmtSci(Q || 0, 3)} J`);
    },
    dispose() {},
  };
}
