"use client";

// ============================================================
// ThreeStage: shared WebGL wrapper for every simulation's 3D view.
// • Loads three.js, OrbitControls and the sim's scene module lazily
// • Renderer, camera, lights, resize, limited orbit, "Reset view"
// • Renders only while on screen and the browser tab is visible
// • Reads the live sim state through getState() every frame
// • Disposes everything on unmount (which is also the 2D switch)
// Scene module contract (components/sims/three/*):
//   export default ({ THREE, scene, camera, tokens }) =>
//     ({ home: { position, target, minDistance, maxDistance },
//        update(state, dt), dispose() })
// ============================================================
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { readTokens } from "./three/colors";

const DEG = Math.PI / 180;

// three.js r170 needs WebGL 2; the probe context is released right away.
function webgl2Available() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export default function ThreeStage({ load3d, getState, onFallback, onBack }) {
  const mountRef = useRef(null);
  const resetRef = useRef(null);
  const getStateRef = useRef(getState);
  const onFallbackRef = useRef(onFallback);
  useLayoutEffect(() => {
    getStateRef.current = getState;
    onFallbackRef.current = onFallback;
  });
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    let disposed = false;
    let cleanup = () => {};

    Promise.all([
      import("three"),
      import("three/examples/jsm/controls/OrbitControls.js"),
      import("three/examples/jsm/environments/RoomEnvironment.js"),
      load3d(),
    ])
      .then(([THREE, { OrbitControls }, { RoomEnvironment }, mod]) => {
        if (disposed) return;

        // probe WebGL 2 first so an unsupported device falls back quietly
        // instead of three.js logging context errors
        if (!webgl2Available()) {
          onFallbackRef.current?.();
          return;
        }
        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true });
        } catch {
          onFallbackRef.current?.();
          return;
        }

        const tokens = readTokens();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(tokens.stage, 1);
        // physically based look: filmic tone mapping + soft shadows.
        // Temperature colours opt out of tone mapping (see three/kit.js).
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.autoUpdate = false; // refreshed by the render loop
        let frameNo = 0;
        // refraction (water, ice, solid glass) is soft anyway; half-res
        // halves the cost of its extra render pass
        renderer.transmissionResolutionScale = 0.5;
        const canvas = renderer.domElement;
        canvas.className = "three-canvas";
        mount.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        // studio reflections for glass, water and metal
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envMap;
        scene.environmentIntensity = 0.9;
        scene.add(new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.6));
        const sun = new THREE.DirectionalLight(0xffffff, 2.2);
        sun.position.set(4, 8, 6);
        sun.castShadow = true;
        sun.shadow.mapSize.set(1024, 1024);
        sun.shadow.camera.left = -8;
        sun.shadow.camera.right = 8;
        sun.shadow.camera.top = 8;
        sun.shadow.camera.bottom = -8;
        sun.shadow.bias = -0.0005;
        sun.shadow.radius = 4;
        scene.add(sun);

        let sim;
        try {
          sim = mod.default({ THREE, scene, camera, tokens });
        } catch (err) {
          console.error(err);
          envMap.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
          setStatus("error");
          return;
        }
        const { home } = sim;

        // ---- camera + limited orbit ----
        camera.position.set(...home.position);
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(...home.target);
        controls.enablePan = false;
        controls.minDistance = home.minDistance;
        controls.maxDistance = home.maxDistance;
        controls.minPolarAngle = 20 * DEG;
        controls.maxPolarAngle = 88 * DEG;
        controls.update();
        const az0 = controls.getAzimuthalAngle();
        controls.minAzimuthAngle = az0 - 60 * DEG;
        controls.maxAzimuthAngle = az0 + 60 * DEG;
        controls.saveState();
        resetRef.current = () => controls.reset();

        // ---- motion: gentle auto-rotate until touched, never when reduced ----
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let touched = false;
        const applyMotion = () => {
          controls.autoRotate = !reduced.matches && !touched;
          controls.enableDamping = !reduced.matches;
        };
        const onStart = () => {
          touched = true;
          applyMotion();
        };
        controls.autoRotateSpeed = 0.5;
        controls.dampingFactor = 0.08;
        controls.addEventListener("start", onStart);
        reduced.addEventListener("change", applyMotion);
        applyMotion();

        // ---- keyboard: arrows orbit, +/- zoom, 0 or Home resets ----
        // Same angle and distance limits as the pointer orbit.
        canvas.tabIndex = 0;
        canvas.setAttribute(
          "aria-label",
          "3D view of the simulation. Arrow keys rotate, plus and minus zoom, 0 resets the view.",
        );
        const sph = new THREE.Spherical();
        const offset = new THREE.Vector3();
        const onKey = (e) => {
          const step = 5 * DEG;
          let dTheta = 0;
          let dPhi = 0;
          let zoom = 1;
          if (e.key === "ArrowLeft") dTheta = -step;
          else if (e.key === "ArrowRight") dTheta = step;
          else if (e.key === "ArrowUp") dPhi = -step;
          else if (e.key === "ArrowDown") dPhi = step;
          else if (e.key === "+" || e.key === "=") zoom = 0.9;
          else if (e.key === "-" || e.key === "_") zoom = 1.1;
          else if (e.key === "0" || e.key === "Home") {
            e.preventDefault();
            onStart();
            controls.reset();
            return;
          } else return;
          e.preventDefault();
          onStart();
          offset.copy(camera.position).sub(controls.target);
          sph.setFromVector3(offset);
          sph.theta = Math.min(controls.maxAzimuthAngle, Math.max(controls.minAzimuthAngle, sph.theta + dTheta));
          sph.phi = Math.min(controls.maxPolarAngle, Math.max(controls.minPolarAngle, sph.phi + dPhi));
          sph.radius = Math.min(controls.maxDistance, Math.max(controls.minDistance, sph.radius * zoom));
          offset.setFromSpherical(sph);
          camera.position.copy(controls.target).add(offset);
          controls.update();
        };
        canvas.addEventListener("keydown", onKey);

        // ---- size follows the 2D canvas box underneath ----
        // Scenes are framed at 40° tall and still fit down to about 1.2:1.
        // On narrower stages (phones) the vertical FOV grows so that width
        // stays in view.
        const WIDE = 1.2;
        const halfH = Math.tan((40 * DEG) / 2);
        const resize = () => {
          const w = mount.clientWidth;
          const h = mount.clientHeight;
          if (!w || !h) return;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          const fit = Math.atan((halfH * WIDE) / Math.min(camera.aspect, WIDE)) * 2;
          camera.fov = Math.min(80, fit / DEG);
          camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize);
        ro.observe(mount);
        resize();

        // ---- render loop, paused offscreen / in hidden tabs ----
        let raf = 0;
        let last = performance.now();
        let onScreen = true;
        const shouldRun = () =>
          onScreen && document.visibilityState === "visible";

        // ---- quality step-down for weak GPUs (never steps back up) ----
        // Frames are timed in ~2 s windows. If the average is slower than
        // 40 ms (under 25 fps), drop one level and time again:
        //   level 1: pixel ratio 1, no shadows, glass/water lose refraction
        //   level 2: render at 60 % resolution, the browser upscales
        let timed = 0;
        let timedMs = 0;
        let level = 0;
        const LEVELS = 2;
        const stepDown = () => {
          level += 1;
          if (level === 1) {
            renderer.setPixelRatio(1);
            renderer.shadowMap.enabled = false;
            scene.traverse((obj) => {
              const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
              mats.forEach((m) => {
                if (m.transmission > 0) {
                  m.transmission = 0;
                  m.transparent = true;
                  m.opacity = Math.min(m.opacity, 0.35);
                }
                m.needsUpdate = true;
              });
            });
          } else {
            renderer.setPixelRatio(0.6);
          }
          resize();
          console.info(`[3D] Lower quality (level ${level}) for smoother motion on this device.`);
        };

        const frame = (now) => {
          raf = 0;
          const raw = now - last;
          const dt = Math.min(0.05, raw / 1000);
          last = now;
          // each window skips its first frames (shader recompiles after a
          // step) and ignores gaps from a pause
          if (level < LEVELS && raw < 2000 && ++timed > 5) {
            timedMs += raw;
            if (timedMs >= 2000) {
              const slow = timedMs / (timed - 5) > 40;
              timed = 0;
              timedMs = 0;
              if (slow) stepDown();
              else level = LEVELS; // fast enough: stop measuring
            }
          }
          // auto-rotate swings back at the azimuth limits instead of sticking
          if (controls.autoRotate) {
            const az = controls.getAzimuthalAngle();
            if (az <= controls.minAzimuthAngle + 0.01)
              controls.autoRotateSpeed = -Math.abs(controls.autoRotateSpeed);
            if (az >= controls.maxAzimuthAngle - 0.01)
              controls.autoRotateSpeed = Math.abs(controls.autoRotateSpeed);
          }
          const state = getStateRef.current?.();
          if (state) sim.update(state, dt);
          controls.update(dt);
          // soft shadows refresh every other frame: half the shadow passes
          renderer.shadowMap.needsUpdate = (frameNo++ & 1) === 0;
          renderer.render(scene, camera);
          schedule();
        };
        const schedule = () => {
          if (!raf && shouldRun()) raf = requestAnimationFrame(frame);
        };
        const stop = () => {
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        };
        const resume = () => {
          if (!shouldRun()) return stop();
          last = performance.now();
          schedule();
        };
        const io = new IntersectionObserver(([entry]) => {
          onScreen = entry.isIntersecting;
          resume();
        });
        io.observe(mount);
        document.addEventListener("visibilitychange", resume);
        schedule();
        setStatus("ready");

        cleanup = () => {
          stop();
          io.disconnect();
          ro.disconnect();
          document.removeEventListener("visibilitychange", resume);
          reduced.removeEventListener("change", applyMotion);
          controls.removeEventListener("start", onStart);
          canvas.removeEventListener("keydown", onKey);
          controls.dispose();
          sim.dispose?.();
          scene.traverse((obj) => {
            // sprites share one geometry inside three.js; leave it alone
            if (!obj.isSprite) obj.geometry?.dispose();
            if (obj.isInstancedMesh) obj.dispose();
            const mats = Array.isArray(obj.material)
              ? obj.material
              : obj.material
                ? [obj.material]
                : [];
            mats.forEach((m) => {
              Object.values(m).forEach((v) => v?.isTexture && v.dispose());
              m.dispose();
            });
          });
          scene.clear();
          envMap.dispose();
          pmrem.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
          resetRef.current = null;
        };
      })
      .catch((err) => {
        console.error(err);
        if (!disposed) setStatus("error");
      });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [load3d, attempt]);

  return (
    <div className="three-stage">
      <div ref={mountRef} className="three-mount" />
      {status === "loading" ? (
        <div className="three-overlay" role="status">
          <div className="spinner-border text-warning mb-2" aria-hidden="true" />
          <div className="small">Building the 3D view…</div>
        </div>
      ) : null}
      {status === "error" ? (
        <div className="three-overlay" role="alert">
          <i className="bi bi-exclamation-triangle mb-2 fs-4" aria-hidden="true" />
          <div className="small mb-3">The 3D view didn&apos;t load this time.</div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-flame"
              onClick={() => {
                setStatus("loading");
                setAttempt((a) => a + 1);
              }}
            >
              Try again
            </button>
            <button type="button" className="btn btn-sm three-btn" onClick={onBack}>
              Back to 2D
            </button>
          </div>
        </div>
      ) : null}
      {status === "ready" ? (
        <button
          type="button"
          className="btn btn-sm three-btn three-reset"
          onClick={() => resetRef.current?.()}
        >
          <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
          Reset view
        </button>
      ) : null}
    </div>
  );
}
