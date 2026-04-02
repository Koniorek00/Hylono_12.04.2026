'use client';

import { useEffect, useRef, useState } from 'react';

const CUTOUT_IMAGE = '/images/testing/portable-generator-cutout.png';
const SOURCE_IMAGE = '/images/testing/portable-generator-source.png';
const LAYER_COUNT = 16;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export default function Product3DAssetLab() {
  const [rotation, setRotation] = useState({ x: -10, y: -22 });
  const [zoom, setZoom] = useState(1.08);
  const [depthStep, setDepthStep] = useState(1.8);
  const [autoSpin, setAutoSpin] = useState(true);
  const dragRef = useRef({
    active: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyPreference = (matches: boolean) => {
      if (matches) {
        setAutoSpin(false);
      }
    };

    applyPreference(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      applyPreference(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!autoSpin) {
      return;
    }

    let frameId = 0;
    let previousTime = performance.now();

    const animate = (time: number) => {
      const deltaSeconds = (time - previousTime) / 1000;
      previousTime = time;

      setRotation((current) =>
        dragRef.current.active ? current : { ...current, y: current.y + deltaSeconds * 10 }
      );

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [autoSpin]);

  useEffect(() => {
    const release = () => {
      dragRef.current.active = false;
    };

    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);

    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, []);

  const totalDepth = depthStep * (LAYER_COUNT - 1);
  const layerStyles = Array.from({ length: LAYER_COUNT }, (_, index) => {
    const centeredIndex = index - (LAYER_COUNT - 1) / 2;
    const z = centeredIndex * depthStep;
    const edgeBias = Math.abs(centeredIndex) / ((LAYER_COUNT - 1) / 2);

    return {
      opacity: 0.1 + edgeBias * 0.04,
      transform: `translateZ(${z}px)`,
      filter: `brightness(${0.32 + edgeBias * 0.18}) saturate(0.76)`,
    };
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 text-slate-950 sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,28rem)]">
        <div className="space-y-6">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-700">
              Private lab route
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Rotatable product asset test
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Best-effort pseudo-3D asset generated from one supplied PNG. The viewer infers depth
              by stacking a transparent cutout into a volume impostor that can be dragged and zoomed.
            </p>
          </header>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#f8fbff_0%,#e8f0f8_58%,#d9e4ef_100%)] p-4 shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.24),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(15,23,42,0.08),transparent_42%)]" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-medium tracking-[0.2em] text-slate-600 uppercase backdrop-blur-md">
                Single-image volume stack
              </div>
              <div className="rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs text-slate-500 backdrop-blur-md">
                Drag to orbit / Wheel to zoom / Double click to reset
              </div>
            </div>

            <div
              className="relative z-10 mt-6 min-h-[34rem] overflow-hidden rounded-[1.75rem] border border-white/60 bg-[radial-gradient(circle_at_top,#ffffff_0%,rgba(255,255,255,0.86)_26%,rgba(226,236,246,0.55)_72%,rgba(213,223,235,0.45)_100%)] px-4 py-8 sm:px-8"
              onDoubleClick={() => {
                setRotation({ x: -10, y: -22 });
                setZoom(1.08);
              }}
              onPointerDown={(event) => {
                dragRef.current.active = true;
                dragRef.current.x = event.clientX;
                dragRef.current.y = event.clientY;
              }}
              onPointerMove={(event) => {
                if (!dragRef.current.active) {
                  return;
                }

                const deltaX = event.clientX - dragRef.current.x;
                const deltaY = event.clientY - dragRef.current.y;

                dragRef.current.x = event.clientX;
                dragRef.current.y = event.clientY;

                setRotation((current) => ({
                  x: clamp(current.x - deltaY * 0.22, -42, 24),
                  y: current.y + deltaX * 0.35,
                }));
              }}
              onWheel={(event) => {
                event.preventDefault();
                setZoom((current) =>
                  clamp(Number((current + (event.deltaY > 0 ? -0.08 : 0.08)).toFixed(2)), 0.82, 1.45)
                );
              }}
              style={{ perspective: '1500px', touchAction: 'none' }}
            >
              <div className="pointer-events-none absolute left-1/2 bottom-14 h-24 w-[60%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,23,42,0.22),transparent_68%)] blur-[16px]" />
              <div className="pointer-events-none absolute left-1/2 bottom-18 h-8 w-[34%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(15,23,42,0.24),transparent_72%)] blur-[6px]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_top,rgba(0,0,0,0.95),transparent_82%)] opacity-65" />
              <div className="grid min-h-[34rem] place-items-center">
                <div
                  className="relative aspect-[5/6] w-full max-w-[31rem] [transform-style:preserve-3d]"
                  style={{
                    transform: `translateY(-10px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                    transition: dragRef.current.active ? 'none' : 'transform 220ms ease-out',
                  }}
                >
                  <div className="pointer-events-none absolute left-1/2 bottom-6 h-4 w-[70%] -translate-x-1/2 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.74),rgba(226,232,240,0.94)_55%,rgba(255,255,255,0.74)),linear-gradient(180deg,rgba(148,163,184,0.22),rgba(255,255,255,0))] shadow-[0_18px_40px_rgba(15,23,42,0.16),inset_0_0_0_1px_rgba(255,255,255,0.8)]" />
                  <div className="pointer-events-none absolute inset-[10%_12%] rounded-[22%] bg-[radial-gradient(circle_at_35%_24%,rgba(255,255,255,0.32),transparent_48%)] blur-[28px]" />

                  {layerStyles.map((layerStyle, index) => (
                    <div
                      key={`product-layer-${index}`}
                      className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
                      style={{
                        ...layerStyle,
                        backgroundImage: `url(${CUTOUT_IMAGE})`,
                        backgroundSize: '84% auto',
                      }}
                    />
                  ))}

                  <div
                    className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${CUTOUT_IMAGE})`,
                      backgroundSize: '84% auto',
                      filter: 'drop-shadow(0 42px 48px rgba(15,23,42,0.12)) drop-shadow(0 0 10px rgba(255,255,255,0.18))',
                      transform: `translateZ(${totalDepth / 2 + 2}px)`,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat opacity-30"
                    style={{
                      backgroundImage: `url(${CUTOUT_IMAGE})`,
                      backgroundSize: '84% auto',
                      filter: 'brightness(0.28) saturate(0.7) blur(0.35px)',
                      transform: `translateZ(${-totalDepth / 2}px) rotateY(180deg)`,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-55 mix-blend-screen"
                    style={{
                      background:
                        'linear-gradient(112deg, transparent 18%, rgba(255,255,255,0.74) 34%, transparent 52%), radial-gradient(circle at 50% 12%, rgba(255,255,255,0.52), transparent 32%)',
                      WebkitMaskImage: `url(${CUTOUT_IMAGE})`,
                      WebkitMaskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskSize: 'contain',
                      maskImage: `url(${CUTOUT_IMAGE})`,
                      maskPosition: 'center',
                      maskRepeat: 'no-repeat',
                      maskSize: 'contain',
                      transform: `translateZ(${totalDepth / 2 + 8}px)`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-5 flex flex-wrap items-center gap-3">
              <button
                className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                onClick={() => {
                  setRotation({ x: -10, y: -22 });
                  setZoom(1.08);
                }}
                type="button"
              >
                Reset view
              </button>
              <button
                className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                onClick={() => setAutoSpin((current) => !current)}
                type="button"
              >
                {autoSpin ? 'Pause idle spin' : 'Enable idle spin'}
              </button>
              <button
                className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                onClick={() => setZoom((current) => clamp(Number((current - 0.1).toFixed(2)), 0.82, 1.45))}
                type="button"
              >
                Zoom out
              </button>
              <button
                className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                onClick={() => setZoom((current) => clamp(Number((current + 0.1).toFixed(2)), 0.82, 1.45))}
                type="button"
              >
                Zoom in
              </button>
            </div>
          </div>
        </div>

        <aside className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Build notes
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>
                  Derived from one product render only. This is not photogrammetry and it is not a
                  physically accurate mesh.
                </li>
                <li>
                  The viewer uses a transparent cutout stack to simulate thickness, plus a darker
                  mirrored back face and highlight layer for readability while rotating.
                </li>
                <li>
                  This route is intentionally private and non-indexable so it can be iterated
                  without affecting the canonical public path.
                </li>
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Depth density</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Increase to exaggerate thickness. Lower values read closer to the original cutout.
                  </p>
                </div>
                <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                  {totalDepth.toFixed(1)}px
                </div>
              </div>
              <input
                aria-label="Adjust pseudo-3D layer depth"
                className="mt-4 w-full accent-cyan-600"
                max={3.2}
                min={0.8}
                onChange={(event) => setDepthStep(Number(event.target.value))}
                step={0.1}
                type="range"
                value={depthStep}
              />
              <p className="mt-2 text-xs text-slate-500">
                Layer spacing is tuned for a stylized volume effect, not a true CAD-accurate body.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Interaction
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Manual orbit</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Pointer drag adjusts yaw and pitch directly while wheel zoom helps inspect the silhouette.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Asset mode
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Volume impostor</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Suitable for demos and concept validation. A production model would still need a real mesh or multi-angle renders.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Source frame
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The original supplied render is kept here for comparison while refining the pseudo-3D version.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
              <img
                alt="Original supplied product image used to derive the test asset"
                className="h-auto max-h-[18rem] w-full bg-slate-50 object-contain"
                src={SOURCE_IMAGE}
              />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
