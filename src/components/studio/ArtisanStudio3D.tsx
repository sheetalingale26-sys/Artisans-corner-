import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useApp } from '../../context/AppContext';
import { CraftModelType } from '../../types';
import { buildCraftModel, CraftSceneObject, MaterialFinishType } from './craftModels';
import {
  RotateCcw,
  Layers,
  Camera,
  Palette,
  Eye,
  EyeOff,
  ShoppingBag,
  Sparkles,
  Maximize2
} from 'lucide-react';

export const ArtisanStudio3D: React.FC = () => {
  const { active3DModel, setActive3DModel, products, addToCart, setActiveTab } = useApp();
  const mountRef = useRef<HTMLDivElement>(null);

  // Studio UI states
  const [materialFinish, setMaterialFinish] = useState<MaterialFinishType>('terracotta');
  const [explodeRatio, setExplodeRatio] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [lightingPreset, setLightingPreset] = useState<'warm' | 'softbox' | 'gallery'>('warm');

  // References for render loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const craftObjRef = useRef<CraftSceneObject | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.8, 4.6));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));
  const isInteractingRef = useRef<boolean>(false);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Find corresponding catalog product if available
  const matchingProduct = products.find((p) => p.model3dType === active3DModel) || products[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL safely
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Scene & Renderer setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8F4EE');
    scene.fog = new THREE.Fog('#F8F4EE', 7, 24);
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Mandatory Studio Environment Reflection
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 4. Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffedd8, 2.4);
    keyLight.position.set(3.5, 5.0, 3.8);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 16;
      keyLight.shadow.camera.left = -2.5;
      keyLight.shadow.camera.right = 2.5;
      keyLight.shadow.camera.top = 2.5;
      keyLight.shadow.camera.bottom = -2.5;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Cool fill light for natural temperature contrast
    const hemiLight = new THREE.HemisphereLight(0xe4effa, 0x4f4339, 1.1);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // Subtle rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
    rimLight.position.set(-3.5, 3.5, -3.5);
    scene.add(rimLight);

    // 5. Studio Pedestal Table Disc
    const tableGeo = new THREE.CylinderGeometry(2.4, 2.5, 0.1, 48);
    const tableMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EFE8DD'),
      roughness: 0.9,
      metalness: 0.02
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.05;
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // 6. Orbit Controls with silky damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 1.4;
    controls.maxDistance = 8.5;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isInteractingRef.current = true;
    });
    controls.addEventListener('end', () => {
      isInteractingRef.current = false;
    });

    // 7. Initial Model Build
    const initialCraft = buildCraftModel(active3DModel, materialFinish);
    scene.add(initialCraft.group);
    craftObjRef.current = initialCraft;

    // 8. Animation loop
    let animId = 0;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Auto-turntable rotation if user is not actively dragging
      if (autoRotate && !isInteractingRef.current && craftObjRef.current) {
        craftObjRef.current.group.rotation.y += delta * 0.35;
      }

      // Smooth camera interpolation toward target view preset
      if (!isInteractingRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.5, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookAt.current.x, 4.0, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookAt.current.y, 4.0, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookAt.current.z, 4.0, delta);
      }

      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (craftObjRef.current) {
        craftObjRef.current.dispose();
      }
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update craft subject and material finish dynamically
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (craftObjRef.current) {
      scene.remove(craftObjRef.current.group);
      craftObjRef.current.dispose();
    }

    const newCraft = buildCraftModel(active3DModel, materialFinish);
    scene.add(newCraft.group);
    craftObjRef.current = newCraft;

    // Apply existing explode ratio
    newCraft.parts.forEach((part) => {
      part.mesh.position.y = part.originalY + part.explodeOffset * explodeRatio;
    });
  }, [active3DModel, materialFinish]);

  // Update exploded view separation smoothly
  useEffect(() => {
    if (!craftObjRef.current) return;
    craftObjRef.current.parts.forEach((part) => {
      part.mesh.position.y = part.originalY + part.explodeOffset * explodeRatio;
    });
  }, [explodeRatio]);

  // Update lighting rig
  useEffect(() => {
    if (!keyLightRef.current || !sceneRef.current) return;
    const key = keyLightRef.current;
    if (lightingPreset === 'warm') {
      key.color.setHex(0xffedd8);
      key.intensity = 2.4;
      sceneRef.current.background = new THREE.Color('#F8F4EE');
      sceneRef.current.fog = new THREE.Fog('#F8F4EE', 7, 24);
    } else if (lightingPreset === 'softbox') {
      key.color.setHex(0xfafafa);
      key.intensity = 2.8;
      sceneRef.current.background = new THREE.Color('#EDE8E1');
      sceneRef.current.fog = new THREE.Fog('#EDE8E1', 6, 22);
    } else if (lightingPreset === 'gallery') {
      key.color.setHex(0xffe6c4);
      key.intensity = 3.2;
      sceneRef.current.background = new THREE.Color('#2A2521');
      sceneRef.current.fog = new THREE.Fog('#2A2521', 6, 20);
    }
  }, [lightingPreset]);

  // Camera presets
  const setCameraPreset = (preset: 'studio' | 'potter' | 'detail' | 'overhead') => {
    isInteractingRef.current = false;
    if (preset === 'studio') {
      targetCamPos.current.set(0, 1.8, 4.6);
      targetLookAt.current.set(0, 1.2, 0);
    } else if (preset === 'potter') {
      targetCamPos.current.set(2.8, 2.4, 2.8);
      targetLookAt.current.set(0, 1.0, 0);
    } else if (preset === 'detail') {
      targetCamPos.current.set(0.6, 1.5, 1.8);
      targetLookAt.current.set(0, 1.3, 0);
    } else if (preset === 'overhead') {
      targetCamPos.current.set(0.1, 5.2, 0.8);
      targetLookAt.current.set(0, 0.4, 0);
    }
  };

  const handleReset = () => {
    setExplodeRatio(0);
    setMaterialFinish('terracotta');
    setAutoRotate(true);
    setCameraPreset('studio');
  };

  return (
    <div className="relative w-full h-[calc(100vh-74px)] bg-[#F8F4EE] overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Information & Actions Bar */}
      <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-10 flex items-start justify-between gap-2 pointer-events-none">
        {/* Top Left Information Badge */}
        <div className="flex flex-col gap-1.5 pointer-events-auto max-w-[55%] sm:max-w-none">
          <div className="bg-[#2A2521] text-[#FDFBF7] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl shadow-lg border border-[#443B34] flex items-center gap-2">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#A86F47] shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#D8A45F] truncate">
                3D Artisan Studio
              </div>
              <div className="text-xs sm:text-sm font-serif font-medium text-[#FDFBF7] truncate">
                {matchingProduct ? matchingProduct.title : 'Artisan Handcrafted Piece'}
              </div>
            </div>
          </div>

          <div className="bg-[#FDFBF7]/95 text-[#2A2521] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#E4D9C4] text-[10px] sm:text-xs hidden sm:flex items-center gap-2 shadow-xs">
            <span className="text-[#6B7A52] font-semibold">
              {matchingProduct ? matchingProduct.sellerName : "Terracotta Studio"}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600">Drag to Orbit | Pinch to Zoom</span>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto shrink-0">
          {matchingProduct && (
            <button
              onClick={() => addToCart(matchingProduct, 1)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 bg-[#A86F47] hover:bg-[#8F5732] text-white rounded-xl shadow-md font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Order</span>
              <span>(${matchingProduct.price})</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 bg-[#FDFBF7] hover:bg-[#F3EDE2] text-[#2A2521] rounded-xl border border-[#E4D9C4] shadow-xs font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* ERGONOMIC VIEWPORT-FIRST COLLAPSIBLE BOTTOM DOCK (Directive <= 15% viewport, zero side cards) */}
      <div
        className={`absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-4xl transition-all duration-300 ease-out ${
          isCinemaMode ? 'translate-y-[calc(100%-42px)]' : 'translate-y-0'
        }`}
      >
        {/* Toggle Cinema / Zen Mode Drawer Handle */}
        <div className="flex justify-center mb-1.5">
          <button
            onClick={() => setIsCinemaMode(!isCinemaMode)}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#2A2521] hover:bg-[#3D352E] text-[#FDFBF7] text-xs font-medium rounded-full shadow-md transition-colors cursor-pointer"
          >
            {isCinemaMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-[#D8A45F]" />
                <span>▴ Show Controls</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-[#D8A45F]" />
                <span>▾ Cinema View</span>
              </>
            )}
          </button>
        </div>

        {/* Unified Bottom Control Dock */}
        <div className="bg-[#2A2521] text-[#FDFBF7] rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-[#443A32] max-h-[46vh] md:max-h-none overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* 1. Craft Model Subject Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-[#D8A45F] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Craft Subject
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'amphora-vase', label: 'Amphora Vase' },
                  { id: 'wood-lamp', label: 'Oak & Brass Lamp' },
                  { id: 'ceramic-teapot', label: 'Ceramic Teapot' },
                  { id: 'carved-bowl', label: 'Walnut Bowl' },
                  { id: 'brass-jewelry', label: 'Turquoise Pendant' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActive3DModel(item.id as CraftModelType)}
                    className={`px-2 py-1.5 rounded-lg text-left truncate transition-colors ${
                      active3DModel === item.id
                        ? 'bg-[#A86F47] text-white font-semibold shadow-sm'
                        : 'bg-[#373029] hover:bg-[#463D34] text-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Material Finishes */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-[#D8A45F] uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Artisan Finishes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'terracotta', label: 'Raw Terracotta', color: '#B86743' },
                  { id: 'sage-glaze', label: 'Sage Celadon', color: '#7A8B66' },
                  { id: 'dark-stoneware', label: 'Dark Stoneware', color: '#433D39' },
                  { id: 'natural-oak', label: 'Turned Timber', color: '#6D472B' },
                  { id: 'hammered-brass', label: 'Hammered Brass', color: '#D8A45F' }
                ].map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setMaterialFinish(finish.id as MaterialFinishType)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                      materialFinish === finish.id
                        ? 'bg-[#4B3E34] ring-1 ring-[#D8A45F] text-white font-medium'
                        : 'bg-[#373029] hover:bg-[#463D34] text-gray-300'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                      style={{ backgroundColor: finish.color }}
                    />
                    <span className="truncate">{finish.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Camera View Angles & Turntable */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-[#D8A45F] uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Camera Angles
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setCameraPreset('studio')}
                  className="px-2 py-1.5 rounded-lg bg-[#373029] hover:bg-[#463D34] text-gray-200 text-left transition-colors"
                >
                  Studio 360°
                </button>
                <button
                  onClick={() => setCameraPreset('potter')}
                  className="px-2 py-1.5 rounded-lg bg-[#373029] hover:bg-[#463D34] text-gray-200 text-left transition-colors"
                >
                  Artisan High
                </button>
                <button
                  onClick={() => setCameraPreset('detail')}
                  className="px-2 py-1.5 rounded-lg bg-[#373029] hover:bg-[#463D34] text-gray-200 text-left transition-colors"
                >
                  Tool Detail
                </button>
                <button
                  onClick={() => setCameraPreset('overhead')}
                  className="px-2 py-1.5 rounded-lg bg-[#373029] hover:bg-[#463D34] text-gray-200 text-left transition-colors"
                >
                  Bird's Eye
                </button>
              </div>

              <div className="flex items-center justify-between mt-0.5 pt-1 border-t border-[#443A32]">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors ${
                    autoRotate ? 'text-[#D8A45F] font-semibold' : 'text-gray-400'
                  }`}
                >
                  <RotateCcw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                  <span>{autoRotate ? 'Turntable Active' : 'Turntable Paused'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="text-gray-400 hover:text-white text-[11px] underline"
                >
                  Reset View
                </button>
              </div>
            </div>

            {/* 4. Exploded Parts Disassembly & Lighting Atmosphere */}
            <div className="flex flex-col gap-2">
              <div>
                <div className="flex justify-between items-center text-[11px] mb-1">
                  <span className="font-semibold text-[#D8A45F] uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Craft Explode
                  </span>
                  <span className="text-gray-300 font-mono">{Math.round(explodeRatio * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodeRatio}
                  onChange={(e) => setExplodeRatio(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#443A32] rounded-lg appearance-none cursor-pointer accent-[#A86F47]"
                />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#D8A45F] uppercase tracking-wider block mb-1">
                  Lighting Atmosphere
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setLightingPreset('warm')}
                    className={`flex-1 py-1 rounded text-center text-[11px] transition-colors ${
                      lightingPreset === 'warm'
                        ? 'bg-[#A86F47] text-white font-semibold'
                        : 'bg-[#373029] hover:bg-[#463D34] text-gray-300'
                    }`}
                  >
                    Golden Hour
                  </button>
                  <button
                    onClick={() => setLightingPreset('softbox')}
                    className={`flex-1 py-1 rounded text-center text-[11px] transition-colors ${
                      lightingPreset === 'softbox'
                        ? 'bg-[#A86F47] text-white font-semibold'
                        : 'bg-[#373029] hover:bg-[#463D34] text-gray-300'
                    }`}
                  >
                    Studio Soft
                  </button>
                  <button
                    onClick={() => setLightingPreset('gallery')}
                    className={`flex-1 py-1 rounded text-center text-[11px] transition-colors ${
                      lightingPreset === 'gallery'
                        ? 'bg-[#A86F47] text-white font-semibold'
                        : 'bg-[#373029] hover:bg-[#463D34] text-gray-300'
                    }`}
                  >
                    Nocturne
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
