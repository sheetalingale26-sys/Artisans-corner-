import * as THREE from 'three';

// Procedural CanvasTexture generator for organic craft finishes (zero 404 assets)
export function createClayTexture(baseHex = '#C4704B', speckleHex = '#5A321E'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle kiln color gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Natural mineral speckles and sand grit
    ctx.fillStyle = speckleHex;
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 1.8 + 0.3;
      ctx.globalAlpha = Math.random() * 0.4 + 0.1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Clay throwing wheel ridges
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    for (let y = 10; y < 512; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y + Math.sin(y * 0.1) * 2);
      ctx.lineTo(512, y + Math.cos(y * 0.1) * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWoodGrainTexture(darkHex = '#3B2616', lightHex = '#6D472B'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = lightHex;
    ctx.fillRect(0, 0, 512, 512);

    // Concentric growth rings and wood fibers
    ctx.strokeStyle = darkHex;
    for (let i = 0; i < 60; i++) {
      const radius = 20 + i * 8 + Math.random() * 3;
      ctx.lineWidth = Math.random() * 2 + 0.8;
      ctx.globalAlpha = Math.random() * 0.35 + 0.15;
      ctx.beginPath();
      ctx.arc(256 + Math.sin(i) * 10, 256 + Math.cos(i) * 10, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Longitudinal pores
    ctx.fillStyle = darkHex;
    ctx.globalAlpha = 0.2;
    for (let p = 0; p < 800; p++) {
      const px = Math.random() * 512;
      const py = Math.random() * 512;
      ctx.fillRect(px, py, 1.2, 4.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createHammeredMetalBump(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);

    // Hammer facet depressions
    for (let i = 0; i < 180; i++) {
      const cx = Math.random() * 256;
      const cy = Math.random() * 256;
      const rad = Math.random() * 12 + 6;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      g.addColorStop(0, 'rgba(40, 40, 40, 0.45)');
      g.addColorStop(0.7, 'rgba(100, 100, 100, 0.2)');
      g.addColorStop(1, 'rgba(128, 128, 128, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Linear data space for bump map
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

export function createLinenWeaveTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EDE5D8';
    ctx.fillRect(0, 0, 256, 256);

    // Cross-weave threads
    ctx.strokeStyle = '#D4C6B0';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.5;

    for (let x = 0; x < 256; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }

    for (let y = 0; y < 256; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural contact shadow canvas texture
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 256, 256);
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
    grad.addColorStop(0, 'rgba(28, 20, 14, 0.75)');
    grad.addColorStop(0.35, 'rgba(38, 28, 20, 0.45)');
    grad.addColorStop(0.7, 'rgba(50, 40, 30, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
