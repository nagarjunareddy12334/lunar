import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Creates high-resolution graphic texture decal mapped onto the 3D t-shirt UVs
 */
function createFullShirtTexture(colorway) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Background fabric color base
  ctx.fillStyle = colorway.colorHex;
  ctx.fillRect(0, 0, 2048, 2048);

  // Micro cotton weave texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.018)';
  for (let x = 0; x < 2048; x += 4) {
    ctx.fillRect(x, 0, 2, 2048);
  }
  for (let y = 0; y < 2048; y += 4) {
    ctx.fillRect(0, y, 2048, 2);
  }

  // White text for SUKAI branding
  const whiteTextColor = '#FFFFFF';
  const accentColor = '#C5A880';

  // --- Front Chest Graphic (UV mapped area around center-left: X ~680, Y ~880) ---
  ctx.save();
  ctx.translate(680, 880);

  // Subtle contrast backdrop for light shirts
  if (colorway.id === 'bone') {
    ctx.fillStyle = 'rgba(15, 17, 23, 0.75)';
    ctx.beginPath();
    ctx.roundRect(-260, -200, 520, 420, 24);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Outer framing box
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 5;
  ctx.strokeRect(-230, -170, 460, 360);

  // Corner bracket accents
  ctx.beginPath();
  ctx.moveTo(-250, -190);
  ctx.lineTo(-200, -190);
  ctx.moveTo(200, -190);
  ctx.lineTo(250, -190);
  ctx.moveTo(-250, 210);
  ctx.lineTo(-200, 210);
  ctx.moveTo(200, 210);
  ctx.lineTo(250, 210);
  ctx.stroke();

  // Top Japanese Sub-heading
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 24px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('アヴァンギャルド // 2026', 0, -110);

  // Center Bold Brand Wordmark in PURE WHITE LETTERS
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = whiteTextColor;
  ctx.font = '900 110px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '12px';
  ctx.fillText('SUKAI', 0, -10);
  ctx.shadowBlur = 0; // reset shadow

  // Horizontal Accent Bar
  ctx.fillStyle = accentColor;
  ctx.fillRect(-140, 35, 280, 4);

  // Coordinates & Heavyweight Specs in Crisp White
  ctx.fillStyle = whiteTextColor;
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('35.6762° N, 139.6503° E', 0, 95);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = 'bold 18px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('HEAVYWEIGHT 360 GSM', 0, 135);

  ctx.restore();

  // --- Back Large Statement Graphic (UV mapped area around center-right: X ~1460, Y ~880) ---
  ctx.save();
  ctx.translate(1460, 880);

  if (colorway.id === 'bone') {
    ctx.fillStyle = 'rgba(15, 17, 23, 0.75)';
    ctx.beginPath();
    ctx.roundRect(-260, -250, 520, 560, 24);
    ctx.fill();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 24px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SUKAI DROP 01 // 150 PCS WORLDWIDE', 0, -200);

  // Big Bold White Back Text
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = whiteTextColor;
  ctx.font = '900 100px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '8px';
  ctx.fillText('SUKAI', 0, -100);
  ctx.fillText('LIVE LIKE', 0, -10);
  ctx.fillText('YOU DREAM', 0, 80);
  ctx.shadowBlur = 0;

  // Gold Divider
  ctx.fillStyle = accentColor;
  ctx.fillRect(-180, 120, 360, 6);

  ctx.fillStyle = whiteTextColor;
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ZERO-SAG COLLAR ATELIER', 0, 170);
  ctx.fillText('TOKYO × NEW YORK', 0, 210);

  ctx.strokeStyle = 'rgba(197, 168, 128, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(-200, 245, 400, 55);
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 18px monospace';
  ctx.fillText('LIMITED EDITION: 049 / 150', 0, 280);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.flipY = false;
  texture.needsUpdate = true;
  return texture;
}

export default function ThreeTShirtCanvas({
  colorway,
  isAutoRotating,
  rotationY,
  onRotateChange,
  onHotspotsUpdate
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRootRef = useRef(null);
  const targetMeshRef = useRef(null);
  const isDraggingRef = useRef(false);
  const pointerStartPos = useRef({ x: 0, rotY: 0, y: 0, rotX: 0 });

  // Initialize Three.js Scene and Load Real 3D Model
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 2.7);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic Tone Mapping and Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    mount.replaceChildren(renderer.domElement);

    // 4. Studio Lighting Rig
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light (Warm Amber)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light (Cool Soft Sky)
    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.6);
    fillLight.position.set(-3, 2.5, 3.5);
    scene.add(fillLight);

    // Rim / Back Light (Crisp Silhouette Definition)
    const rimLight = new THREE.DirectionalLight(0xffedd5, 3.2);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Bottom Ambient Bounce Light
    const bounceLight = new THREE.DirectionalLight(0x1e293b, 0.7);
    bounceLight.position.set(0, -3, 2);
    scene.add(bounceLight);

    // 5. Model Root Pivot Group
    const modelRoot = new THREE.Group();
    modelRootRef.current = modelRoot;
    scene.add(modelRoot);

    // 6. Load the Realistic 3D T-Shirt GLTF Model
    const loader = new GLTFLoader();
    const shirtTexture = createFullShirtTexture(colorway);

    loader.load(
      '/shirt_baked.glb',
      (gltf) => {
        const shirtModel = gltf.scene;

        // Auto-scale and center the model
        const box = new THREE.Box3().setFromObject(shirtModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.85 / maxDim;
        shirtModel.scale.set(scale, scale, scale);
        shirtModel.position.set(-center.x * scale, -center.y * scale + 0.05, -center.z * scale);

        // Apply realistic cloth physical material with the dynamic texture
        shirtModel.traverse((child) => {
          if (child.isMesh) {
            targetMeshRef.current = child;
            child.castShadow = true;
            child.receiveShadow = true;

            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(colorway.colorHex),
              map: shirtTexture,
              roughness: 0.65,
              metalness: 0.02,
              roughnessMap: child.material?.roughnessMap || null,
              normalMap: child.material?.normalMap || null,
            });
            child.material.needsUpdate = true;
          }
        });

        modelRoot.add(shirtModel);
      },
      undefined,
      (error) => {
        console.warn('Error loading GLB, building fallback 3D cloth model:', error);
      }
    );

    // 7. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      modelRoot.position.y = Math.sin(elapsedTime * 1.6) * 0.03;

      // Auto-rotation
      if (isAutoRotating && !isDraggingRef.current) {
        modelRoot.rotation.y += 0.007;
        if (onRotateChange) {
          onRotateChange(modelRoot.rotation.y);
        }
      }

      // Calculate 3D projected screen positions for Hotspot Pins
      if (onHotspotsUpdate && cameraRef.current) {
        const hotspotWorldCoords = [
          { id: 'collar', worldPos: new THREE.Vector3(0, 0.62, 0.15) },
          { id: 'print', worldPos: new THREE.Vector3(0, 0.12, 0.22) },
          { id: 'shoulder', worldPos: new THREE.Vector3(-0.72, 0.45, 0.08) },
          { id: 'hem', worldPos: new THREE.Vector3(0, -0.75, 0.18) }
        ];

        const screenHotspots = hotspotWorldCoords.map((item) => {
          const v = item.worldPos.clone();
          v.applyMatrix4(modelRoot.matrixWorld);
          v.project(cameraRef.current);

          const screenX = (v.x * 0.5 + 0.5) * width;
          const screenY = (-(v.y * 0.5) + 0.5) * height;
          const isFrontSide = v.z < 1.0;

          return {
            id: item.id,
            x: screenX,
            y: screenY,
            visible: isFrontSide
          };
        });

        onHotspotsUpdate(screenHotspots);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      shirtTexture.dispose();
    };
  }, []);

  // Update material and texture dynamically on colorway change
  useEffect(() => {
    if (!targetMeshRef.current) return;

    const newTexture = createFullShirtTexture(colorway);
    targetMeshRef.current.material.color = new THREE.Color(colorway.colorHex);
    targetMeshRef.current.material.map = newTexture;
    targetMeshRef.current.material.needsUpdate = true;
  }, [colorway]);

  // Sync external rotation
  useEffect(() => {
    if (modelRootRef.current && typeof rotationY === 'number' && !isDraggingRef.current) {
      modelRootRef.current.rotation.y = rotationY;
    }
  }, [rotationY]);

  // Pointer Drag Interaction
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const currentRotY = modelRootRef.current ? modelRootRef.current.rotation.y : 0;
    const currentRotX = modelRootRef.current ? modelRootRef.current.rotation.x : 0;

    pointerStartPos.current = {
      x: clientX,
      y: clientY,
      rotY: currentRotY,
      rotX: currentRotX
    };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !modelRootRef.current) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - pointerStartPos.current.x;
    const deltaY = clientY - pointerStartPos.current.y;

    const newRotY = pointerStartPos.current.rotY + deltaX * 0.009;
    const newRotX = Math.max(-0.45, Math.min(0.45, pointerStartPos.current.rotX + deltaY * 0.005));

    modelRootRef.current.rotation.y = newRotY;
    modelRootRef.current.rotation.x = newRotX;

    if (onRotateChange) {
      onRotateChange(newRotY);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    />
  );
}
