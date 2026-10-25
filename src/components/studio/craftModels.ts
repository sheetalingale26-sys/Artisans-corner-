import * as THREE from 'three';
import { CraftModelType } from '../../types';
import {
  createClayTexture,
  createWoodGrainTexture,
  createHammeredMetalBump,
  createLinenWeaveTexture,
  createContactShadowTexture
} from './proceduralTextures';

export type MaterialFinishType = 'terracotta' | 'sage-glaze' | 'dark-stoneware' | 'natural-oak' | 'hammered-brass';

export interface CraftSceneObject {
  group: THREE.Group;
  parts: { name: string; mesh: THREE.Object3D; originalY: number; explodeOffset: number }[];
  contactShadow: THREE.Mesh;
  dispose: () => void;
}

export function buildCraftModel(
  type: CraftModelType,
  finish: MaterialFinishType = 'terracotta'
): CraftSceneObject {
  const group = new THREE.Group();
  group.name = `craft-${type}`;
  const parts: { name: string; mesh: THREE.Object3D; originalY: number; explodeOffset: number }[] = [];
  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // Reusable procedural textures
  const clayTex = createClayTexture('#B86743', '#4E2A19');
  const sageTex = createClayTexture('#7A8B66', '#49573B');
  const stoneTex = createClayTexture('#3F3935', '#1F1B18');
  const woodTex = createWoodGrainTexture('#331F11', '#754E2C');
  const hammeredBump = createHammeredMetalBump();
  const linenTex = createLinenWeaveTexture();
  const shadowTex = createContactShadowTexture();

  disposables.push(clayTex, sageTex, stoneTex, woodTex, hammeredBump, linenTex, shadowTex);

  // Material helpers
  const getClayMat = (rough = 0.82) => {
    let map = clayTex;
    let color = new THREE.Color('#C97750');
    if (finish === 'sage-glaze') {
      map = sageTex;
      color = new THREE.Color('#82946E');
      rough = 0.35; // glazed sheen
    } else if (finish === 'dark-stoneware') {
      map = stoneTex;
      color = new THREE.Color('#433D39');
      rough = 0.75;
    }
    const mat = new THREE.MeshStandardMaterial({
      map,
      color,
      roughness: rough,
      metalness: 0.05
    });
    disposables.push(mat);
    return mat;
  };

  const brassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D8A45F'),
    roughness: 0.28,
    metalness: 0.92,
    bumpMap: hammeredBump,
    bumpScale: 0.04
  });
  disposables.push(brassMat);

  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: new THREE.Color('#784F30'),
    roughness: 0.65,
    metalness: 0.02
  });
  disposables.push(woodMat);

  // Common Contact Shadow Plane (at y = 0.005)
  const shadowGeo = new THREE.PlaneGeometry(3.8, 3.8);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.6,
    depthWrite: false
  });
  const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.005;
  group.add(contactShadow);
  disposables.push(shadowGeo, shadowMat);

  // Builder: Earthy Terracotta Amphora Vase
  if (type === 'amphora-vase') {
    const mainMat = getClayMat(0.85);

    // 1. Footed pedestal base
    const basePts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.48, 0),
      new THREE.Vector2(0.52, 0.08),
      new THREE.Vector2(0.45, 0.22),
      new THREE.Vector2(0.38, 0.35),
      new THREE.Vector2(0, 0.35)
    ];
    const baseGeo = new THREE.LatheGeometry(basePts, 36);
    const baseMesh = new THREE.Mesh(baseGeo, mainMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseMesh.position.y = 0.01;
    group.add(baseMesh);
    parts.push({ name: 'Pedestal Foot', mesh: baseMesh, originalY: 0.01, explodeOffset: -0.2 });
    disposables.push(baseGeo);

    // 2. Swelling body with lathe profile
    const bodyPts = [
      new THREE.Vector2(0.38, 0.35),
      new THREE.Vector2(0.55, 0.55),
      new THREE.Vector2(0.85, 0.95),
      new THREE.Vector2(0.92, 1.3),
      new THREE.Vector2(0.82, 1.7),
      new THREE.Vector2(0.52, 2.05),
      new THREE.Vector2(0.42, 2.25)
    ];
    const bodyGeo = new THREE.LatheGeometry(bodyPts, 40);
    const bodyMesh = new THREE.Mesh(bodyGeo, mainMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);
    parts.push({ name: 'Amphora Belly', mesh: bodyMesh, originalY: 0, explodeOffset: 0 });
    disposables.push(bodyGeo);

    // 3. Fluted neck
    const neckPts = [
      new THREE.Vector2(0.42, 2.25),
      new THREE.Vector2(0.44, 2.45),
      new THREE.Vector2(0.46, 2.7),
      new THREE.Vector2(0.55, 2.85)
    ];
    const neckGeo = new THREE.LatheGeometry(neckPts, 36);
    const neckMesh = new THREE.Mesh(neckGeo, mainMat);
    neckMesh.castShadow = true;
    neckMesh.receiveShadow = true;
    group.add(neckMesh);
    parts.push({ name: 'Tapered Neck', mesh: neckMesh, originalY: 0, explodeOffset: 0.3 });
    disposables.push(neckGeo);

    // 4. Flared top rim lip
    const rimGeo = new THREE.TorusGeometry(0.55, 0.07, 16, 40);
    const rimMesh = new THREE.Mesh(rimGeo, mainMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 2.85;
    rimMesh.castShadow = true;
    group.add(rimMesh);
    parts.push({ name: 'Lip Rim', mesh: rimMesh, originalY: 2.85, explodeOffset: 0.5 });
    disposables.push(rimGeo);

    // 5 & 6. Dual amphora loop handles
    const createHandleCurve = (mirror = false) => {
      const mult = mirror ? -1 : 1;
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.48 * mult, 2.35, 0),
        new THREE.Vector3(0.95 * mult, 2.2, 0),
        new THREE.Vector3(1.05 * mult, 1.7, 0),
        new THREE.Vector3(0.85 * mult, 1.35, 0)
      ]);
    };

    const handleLGeo = new THREE.TubeGeometry(createHandleCurve(false), 24, 0.065, 12, false);
    const handleL = new THREE.Mesh(handleLGeo, mainMat);
    handleL.castShadow = true;
    group.add(handleL);
    parts.push({ name: 'Left Loop Handle', mesh: handleL, originalY: 0, explodeOffset: 0.15 });

    const handleRGeo = new THREE.TubeGeometry(createHandleCurve(true), 24, 0.065, 12, false);
    const handleR = new THREE.Mesh(handleRGeo, mainMat);
    handleR.castShadow = true;
    group.add(handleR);
    parts.push({ name: 'Right Loop Handle', mesh: handleR, originalY: 0, explodeOffset: 0.15 });
    disposables.push(handleLGeo, handleRGeo);

    // 7. Studio seal medallion
    const sealGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 20);
    const sealMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#945437'),
      roughness: 0.9,
      metalness: 0.1
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.rotation.z = Math.PI / 4;
    sealMesh.position.set(0, 1.45, 0.88);
    group.add(sealMesh);
    parts.push({ name: 'Artisan Potter Seal', mesh: sealMesh, originalY: 1.45, explodeOffset: 0.25 });
    disposables.push(sealGeo, sealMat);
  }

  // Builder: Handcrafted Oak & Brass Accent Lamp
  else if (type === 'wood-lamp') {
    // 1. Turned wooden stepped base
    const basePts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.9, 0),
      new THREE.Vector2(0.85, 0.15),
      new THREE.Vector2(0.75, 0.25),
      new THREE.Vector2(0.45, 0.45),
      new THREE.Vector2(0.3, 0.7),
      new THREE.Vector2(0.2, 1.1),
      new THREE.Vector2(0, 1.1)
    ];
    const baseGeo = new THREE.LatheGeometry(basePts, 36);
    const baseMesh = new THREE.Mesh(baseGeo, woodMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);
    parts.push({ name: 'Turned Oak Pedestal', mesh: baseMesh, originalY: 0, explodeOffset: -0.2 });
    disposables.push(baseGeo);

    // 2. Brass collar and switch
    const collarGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 24);
    const collarMesh = new THREE.Mesh(collarGeo, brassMat);
    collarMesh.position.y = 1.18;
    collarMesh.castShadow = true;
    group.add(collarMesh);
    parts.push({ name: 'Brushed Brass Collar', mesh: collarMesh, originalY: 1.18, explodeOffset: 0.1 });

    const switchGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12);
    const switchMesh = new THREE.Mesh(switchGeo, brassMat);
    switchMesh.rotation.z = Math.PI / 2;
    switchMesh.position.set(0.25, 1.18, 0);
    group.add(switchMesh);
    parts.push({ name: 'Toggle Switch', mesh: switchMesh, originalY: 1.18, explodeOffset: 0.1 });
    disposables.push(collarGeo, switchGeo);

    // 3. Central brass riser rod
    const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16);
    const rodMesh = new THREE.Mesh(rodGeo, brassMat);
    rodMesh.position.y = 1.6;
    rodMesh.castShadow = true;
    group.add(rodMesh);
    parts.push({ name: 'Brass Riser Stem', mesh: rodMesh, originalY: 1.6, explodeOffset: 0.25 });
    disposables.push(rodGeo);

    // 4. Oatmeal Linen Shade
    const shadeGeo = new THREE.CylinderGeometry(0.65, 0.95, 1.1, 32, 1, true);
    const shadeMat = new THREE.MeshStandardMaterial({
      map: linenTex,
      color: new THREE.Color('#FAF3E8'),
      roughness: 0.9,
      metalness: 0.02,
      side: THREE.DoubleSide
    });
    const shadeMesh = new THREE.Mesh(shadeGeo, shadeMat);
    shadeMesh.position.y = 2.05;
    shadeMesh.castShadow = true;
    group.add(shadeMesh);
    parts.push({ name: 'Belgian Linen Shade', mesh: shadeMesh, originalY: 2.05, explodeOffset: 0.6 });
    disposables.push(shadeGeo, shadeMat);

    // 5. Warm internal bulb
    const bulbGeo = new THREE.SphereGeometry(0.18, 20, 20);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FFF5DB'),
      emissive: new THREE.Color('#FFAA44'),
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.y = 1.95;
    group.add(bulbMesh);
    parts.push({ name: 'Warm Edison Bulb', mesh: bulbMesh, originalY: 1.95, explodeOffset: 0.4 });
    disposables.push(bulbGeo, bulbMat);

    // 6. Top Brass Harp & Finial
    const finialGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const finialMesh = new THREE.Mesh(finialGeo, brassMat);
    finialMesh.position.y = 2.65;
    group.add(finialMesh);
    parts.push({ name: 'Spun Brass Finial', mesh: finialMesh, originalY: 2.65, explodeOffset: 0.8 });
    disposables.push(finialGeo);
  }

  // Builder: Artisan Speckled Ceramic Teapot
  else if (type === 'ceramic-teapot') {
    const mainMat = getClayMat(0.45);

    // 1. Foot ring
    const footGeo = new THREE.CylinderGeometry(0.45, 0.48, 0.08, 32);
    const footMesh = new THREE.Mesh(footGeo, mainMat);
    footMesh.position.y = 0.04;
    footMesh.castShadow = true;
    group.add(footMesh);
    parts.push({ name: 'Foot Ring', mesh: footMesh, originalY: 0.04, explodeOffset: -0.1 });
    disposables.push(footGeo);

    // 2. Bell-curved teapot body
    const bodyPts = [
      new THREE.Vector2(0.45, 0.08),
      new THREE.Vector2(0.85, 0.35),
      new THREE.Vector2(0.92, 0.7),
      new THREE.Vector2(0.72, 1.05),
      new THREE.Vector2(0.46, 1.2),
      new THREE.Vector2(0.46, 1.25)
    ];
    const bodyGeo = new THREE.LatheGeometry(bodyPts, 36);
    const bodyMesh = new THREE.Mesh(bodyGeo, mainMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);
    parts.push({ name: 'Teapot Chamber', mesh: bodyMesh, originalY: 0, explodeOffset: 0 });
    disposables.push(bodyGeo);

    // 3. Arched pour spout
    const spoutCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.55, 0.45, 0),
      new THREE.Vector3(0.85, 0.65, 0),
      new THREE.Vector3(1.15, 1.05, 0),
      new THREE.Vector3(1.22, 1.25, 0)
    ]);
    const spoutGeo = new THREE.TubeGeometry(spoutCurve, 20, 0.09, 14, false);
    const spoutMesh = new THREE.Mesh(spoutGeo, mainMat);
    spoutMesh.castShadow = true;
    group.add(spoutMesh);
    parts.push({ name: 'Curved Pour Spout', mesh: spoutMesh, originalY: 0, explodeOffset: 0.2 });
    disposables.push(spoutGeo);

    // 4. Inset Lid
    const lidPts = [
      new THREE.Vector2(0, 1.2),
      new THREE.Vector2(0.44, 1.2),
      new THREE.Vector2(0.44, 1.26),
      new THREE.Vector2(0.3, 1.35),
      new THREE.Vector2(0, 1.38)
    ];
    const lidGeo = new THREE.LatheGeometry(lidPts, 32);
    const lidMesh = new THREE.Mesh(lidGeo, mainMat);
    lidMesh.castShadow = true;
    group.add(lidMesh);
    parts.push({ name: 'Fitted Lid', mesh: lidMesh, originalY: 0, explodeOffset: 0.4 });
    disposables.push(lidGeo);

    // 5. Sculpted Brass Lid Knob
    const knobGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const knobMesh = new THREE.Mesh(knobGeo, brassMat);
    knobMesh.position.y = 1.46;
    knobMesh.castShadow = true;
    group.add(knobMesh);
    parts.push({ name: 'Brass Lid Knob', mesh: knobMesh, originalY: 1.46, explodeOffset: 0.55 });
    disposables.push(knobGeo);

    // 6. Overhead Handle Arch
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.15, 0.65),
      new THREE.Vector3(0, 1.85, 0.45),
      new THREE.Vector3(0, 2.05, 0),
      new THREE.Vector3(0, 1.85, -0.45),
      new THREE.Vector3(0, 1.15, -0.65)
    ]);
    const handleGeo = new THREE.TubeGeometry(handleCurve, 24, 0.045, 12, false);
    const handleMesh = new THREE.Mesh(handleGeo, brassMat);
    handleMesh.castShadow = true;
    group.add(handleMesh);
    parts.push({ name: 'Steam-Bent Overhead Handle', mesh: handleMesh, originalY: 0, explodeOffset: 0.3 });
    disposables.push(handleGeo);
  }

  // Builder: Carved Walnut Live-Edge Catchall Bowl
  else if (type === 'carved-bowl') {
    // 1. Heavy Lathed Bowl Body with gouged rim
    const bowlPts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.65, 0),
      new THREE.Vector2(0.95, 0.15),
      new THREE.Vector2(1.35, 0.45),
      new THREE.Vector2(1.5, 0.8),
      new THREE.Vector2(1.35, 0.78),
      new THREE.Vector2(1.15, 0.45),
      new THREE.Vector2(0.8, 0.2),
      new THREE.Vector2(0, 0.15)
    ];
    const bowlGeo = new THREE.LatheGeometry(bowlPts, 40);
    const bowlMesh = new THREE.Mesh(bowlGeo, woodMat);
    bowlMesh.castShadow = true;
    bowlMesh.receiveShadow = true;
    group.add(bowlMesh);
    parts.push({ name: 'Carved Walnut Basin', mesh: bowlMesh, originalY: 0, explodeOffset: 0 });
    disposables.push(bowlGeo);

    // 2. Brass inlaid coin in center
    const coinGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.02, 24);
    const coinMesh = new THREE.Mesh(coinGeo, brassMat);
    coinMesh.position.y = 0.16;
    group.add(coinMesh);
    parts.push({ name: 'Inlaid Maker Crest', mesh: coinMesh, originalY: 0.16, explodeOffset: 0.2 });
    disposables.push(coinGeo);

    // 3. Three brass leveling feet
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const footGeo = new THREE.SphereGeometry(0.05, 12, 12);
      const footMesh = new THREE.Mesh(footGeo, brassMat);
      footMesh.position.set(Math.cos(angle) * 0.5, 0.03, Math.sin(angle) * 0.5);
      group.add(footMesh);
      parts.push({ name: `Brass Foot #${i + 1}`, mesh: footMesh, originalY: 0.03, explodeOffset: -0.15 });
      disposables.push(footGeo);
    }
  }

  // Builder: Hammered Brass & Turquoise Pendant Jewelry
  else if (type === 'brass-jewelry') {
    // 1. Hammered brass circular bezel tray
    const bezelGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.12, 32);
    const bezelMesh = new THREE.Mesh(bezelGeo, brassMat);
    bezelMesh.position.y = 0.6;
    bezelMesh.rotation.x = Math.PI / 6;
    bezelMesh.castShadow = true;
    group.add(bezelMesh);
    parts.push({ name: 'Hammered Brass Bezel', mesh: bezelMesh, originalY: 0.6, explodeOffset: 0 });
    disposables.push(bezelGeo);

    // 2. Turquoise gemstone cabochon
    const cabGeo = new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const cabMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2FA8A8'),
      roughness: 0.22,
      metalness: 0.1,
      clearcoat: 0.8
    });
    const cabMesh = new THREE.Mesh(cabGeo, cabMat);
    cabMesh.position.y = 0.66;
    cabMesh.rotation.x = Math.PI / 6;
    cabMesh.castShadow = true;
    group.add(cabMesh);
    parts.push({ name: 'Sleeping Beauty Turquoise', mesh: cabMesh, originalY: 0.66, explodeOffset: 0.35 });
    disposables.push(cabGeo, cabMat);

    // 3. Rope twist rim ring
    const ropeGeo = new THREE.TorusGeometry(0.87, 0.045, 16, 40);
    const ropeMesh = new THREE.Mesh(ropeGeo, brassMat);
    ropeMesh.position.y = 0.64;
    ropeMesh.rotation.x = Math.PI / 6;
    group.add(ropeMesh);
    parts.push({ name: 'Rope-Twist Border', mesh: ropeMesh, originalY: 0.64, explodeOffset: 0.2 });
    disposables.push(ropeGeo);

    // 4. Bail hanger loop
    const bailGeo = new THREE.TorusGeometry(0.14, 0.04, 16, 24);
    const bailMesh = new THREE.Mesh(bailGeo, brassMat);
    bailMesh.position.set(0, 1.45, -0.45);
    bailMesh.rotation.y = Math.PI / 2;
    group.add(bailMesh);
    parts.push({ name: 'Solid Bail Hanger', mesh: bailMesh, originalY: 1.45, explodeOffset: 0.5 });
    disposables.push(bailGeo);

    // 5. Braided leather cord strand
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.2, 2.5, -0.6),
      new THREE.Vector3(-0.6, 1.9, -0.5),
      new THREE.Vector3(0, 1.45, -0.45),
      new THREE.Vector3(0.6, 1.9, -0.5),
      new THREE.Vector3(1.2, 2.5, -0.6)
    ]);
    const cordGeo = new THREE.TubeGeometry(cordCurve, 30, 0.035, 10, false);
    const cordMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2B201A'),
      roughness: 0.9,
      metalness: 0.02
    });
    const cordMesh = new THREE.Mesh(cordGeo, cordMat);
    group.add(cordMesh);
    parts.push({ name: 'Braided Artisan Cord', mesh: cordMesh, originalY: 0, explodeOffset: 0.4 });
    disposables.push(cordGeo, cordMat);
  }

  // Dispose helper
  const dispose = () => {
    disposables.forEach((item) => {
      if ('dispose' in item && typeof item.dispose === 'function') {
        item.dispose();
      }
    });
  };

  return { group, parts, contactShadow, dispose };
}
