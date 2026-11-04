import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Pre-load custom front ("Lunar" script) and back ("ALPHA" + Eagle) graphics
 */
let frontPrintImg = null;
let backPrintImg = null;

if (typeof window !== 'undefined') {
  frontPrintImg = new Image();
  frontPrintImg.crossOrigin = 'anonymous';
  frontPrintImg.src = '/custom-prints/lunar-script-hd.png';

  backPrintImg = new Image();
  backPrintImg.crossOrigin = 'anonymous';
  backPrintImg.src = '/custom-prints/alpha-eagle-final.png';
}

/**
 * Renders the high-definition front & back custom graphics onto the 2048x2048 texture canvas
 */
function renderShirtCanvas(canvas, colorway) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 2048, 2048);

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

  // --- Front Chest Graphic: "Lunar" Script (UV mapped area around center-left: X ~680, Y ~860) ---
  ctx.save();
  ctx.translate(680, 860);

  if (frontPrintImg && frontPrintImg.complete && frontPrintImg.naturalWidth > 0) {
    const fW = 460;
    const fH = 210;
    ctx.drawImage(frontPrintImg, -fW / 2, -fH / 2, fW, fH);
  } else {
    // Elegant cursive script fallback while loading
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic 700 96px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.fillText('Lunar', 0, 10);
  }
  ctx.restore();

  // --- Back Large Statement Graphic: "ALPHA" + Flying Eagle (UV mapped area around center-right: X ~1460, Y ~880) ---
  ctx.save();
  ctx.translate(1460, 880);

  if (backPrintImg && backPrintImg.complete && backPrintImg.naturalWidth > 0) {
    const bW = 720;
    const bH = 868;
    ctx.drawImage(backPrintImg, -bW / 2, -bH / 2, bW, bH);
  } else {
    // Fallback statement back text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 110px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText('ALPHA', 0, -100);
  }
  ctx.restore();
}

/**
 * Creates or updates high-resolution graphic texture decal mapped onto the 3D t-shirt UVs
 */
function createFullShirtTexture(colorway, sharedCanvas = null) {
  const canvas = sharedCanvas || document.createElement('canvas');
  if (!sharedCanvas) {
    canvas.width = 2048;
    canvas.height = 2048;
  }
  renderShirtCanvas(canvas, colorway);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.flipY = false;
  texture.needsUpdate = true;
  return { texture, canvas };
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
  const textureCanvasRef = useRef(null);
  const shirtTextureRef = useRef(null);
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
    const { texture: shirtTexture, canvas: sharedCanvas } = createFullShirtTexture(colorway);
    textureCanvasRef.current = sharedCanvas;
    shirtTextureRef.current = shirtTexture;

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
              map: shirtTextureRef.current || shirtTexture,
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
      if (shirtTextureRef.current) {
        shirtTextureRef.current.dispose();
      }
    };
  }, []);

  // Update material and texture dynamically on colorway change or print image load
  useEffect(() => {
    const updateTexture = () => {
      if (textureCanvasRef.current && shirtTextureRef.current) {
        renderShirtCanvas(textureCanvasRef.current, colorway);
        shirtTextureRef.current.needsUpdate = true;
      }
      if (targetMeshRef.current) {
        targetMeshRef.current.material.color = new THREE.Color(colorway.colorHex);
        targetMeshRef.current.material.needsUpdate = true;
      }
    };

    updateTexture();

    const onImgLoad = () => updateTexture();
    if (frontPrintImg && !frontPrintImg.complete) {
      frontPrintImg.addEventListener('load', onImgLoad);
    }
    if (backPrintImg && !backPrintImg.complete) {
      backPrintImg.addEventListener('load', onImgLoad);
    }

    return () => {
      if (frontPrintImg) frontPrintImg.removeEventListener('load', onImgLoad);
      if (backPrintImg) backPrintImg.removeEventListener('load', onImgLoad);
    };
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
