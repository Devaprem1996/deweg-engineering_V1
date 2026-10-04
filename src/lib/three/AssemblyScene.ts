import * as THREE from 'three';

export type AssemblyViewMode = 'solid' | 'xray' | 'cad';

export interface AssemblyHotspot {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  metrics: string[];
  x: number; // Percentage 0 - 100
  y: number; // Percentage 0 - 100
  visible: boolean;
}

export interface AssemblySceneOptions {
  isMobile?: boolean;
}

/**
 * AssemblyScene - High-Fidelity 3D Tied-Arch Conveyor Gallery & Industrial Transfer Tower
 * Strictly built to match reference blueprint:
 * 1. Stacked double-chord tubular blue arch with open flanged mouths, internal web spacers & inverted V-hangers
 * 2. Cantilevered conveyor gallery, rubber belt, 3-roll trough idlers, head pulley & 45° black/yellow hazard bumper
 * 3. Heavy-duty under-deck Warren steel truss girder with top/bottom chords, vertical posts, diagonals & planar wind bracing
 * 4. Multi-tier transfer tower with wide-flange columns, X-bracing, gabled canopy roof, rafters & cantilever catwalk
 * 5. Two-flight industrial switchback staircase with intermediate landing, support columns & yellow OSHA safety handrails
 * 6. Vertical exhaust flue stack with yellow maintenance cage, vertical yellow caged ladder, cyclone silo, rock chute & piping
 * 7. 8-caisson concrete foundation with column capital collars, tie-beams, monolithic pier cap, corbel bearing & rebar dowels
 * 8. Studio Lighting Rig (Light-Architectural Alignment): Real PCF soft shadow mapping, 4-point studio rig & soft ground contact shadow
 */
export class AssemblyScene {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // Root container for whole infrastructure facility
  private modelRoot: THREE.Group;

  // Sub-Assembly Groups matching reference blueprint:
  private foundationGroup: THREE.Group;
  private trussGirderGroup: THREE.Group;
  private deckGroup: THREE.Group;
  private archGroup: THREE.Group;
  private towerGroup: THREE.Group;
  private processGroup: THREE.Group;
  private enclosureGroup: THREE.Group;

  // Studio Ground Planes
  private shadowPlane: THREE.Mesh;
  private groundContactMesh: THREE.Mesh;

  // Materials and Geometries tracking for cleanup & viewing mode transitions
  private solidMaterials: THREE.Material[] = [];
  private meshes: THREE.Mesh[] = [];
  private geometries: THREE.BufferGeometry[] = [];
  private textures: THREE.Texture[] = [];

  // PBR Materials
  private concreteMat!: THREE.MeshStandardMaterial;
  private concretePilesMat!: THREE.MeshStandardMaterial;
  private steelTowerMat!: THREE.MeshStandardMaterial;
  private steelTrussMat!: THREE.MeshStandardMaterial;
  private steelBraceMat!: THREE.MeshStandardMaterial;
  private blueArchMat!: THREE.MeshStandardMaterial;
  private blueEquipmentMat!: THREE.MeshStandardMaterial;
  private redCableMat!: THREE.MeshStandardMaterial;
  private yellowOshaMat!: THREE.MeshStandardMaterial;
  private siloMat!: THREE.MeshStandardMaterial;
  private pipingMat!: THREE.MeshStandardMaterial;
  private rubberBeltMat!: THREE.MeshStandardMaterial;
  private roofSheetMat!: THREE.MeshStandardMaterial;
  private glassMat!: THREE.MeshPhysicalMaterial;
  private chevronMat!: THREE.MeshStandardMaterial;
  private pulleyMat!: THREE.MeshStandardMaterial;
  private rebarMat!: THREE.MeshStandardMaterial;

  // Viewing Modes & Interactive Controls
  private viewMode: AssemblyViewMode = 'solid';
  private isDragging: boolean = false;
  private dragStart = { x: 0, y: 0 };
  private orbitOffset = { x: 0, y: 0 };
  private pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // Scrollytelling state & physics
  private rafId: number = 0;
  private isRunning: boolean = false;
  private currentProgress: number = 0;
  private targetProgress: number = 0;
  private isMobile: boolean = false;
  private clock = new THREE.Clock();
  private tempVec = new THREE.Vector3();

  constructor(canvas: HTMLCanvasElement, options?: AssemblySceneOptions) {
    this.canvas = canvas;
    this.isMobile = options?.isMobile ?? window.innerWidth < 768;

    // 1. Initialize WebGL Renderer with High-Performance & PCF Soft Shadows
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });

    const dpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Real dynamic shadow mapping
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Camera Setup (Architectural Three-Quarter Isometric Perspective)
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      33,
      canvas.clientWidth / Math.max(canvas.clientHeight, 1),
      0.1,
      60
    );
    this.camera.position.set(0, 0.45, 9.6);

    // 3. Studio Lighting Rig (Light-Architectural Alignment)
    this.setupLighting();

    // 4. Initialize Sub-assembly Groups
    this.modelRoot = new THREE.Group();
    this.scene.add(this.modelRoot);

    this.foundationGroup = new THREE.Group();
    this.trussGirderGroup = new THREE.Group();
    this.deckGroup = new THREE.Group();
    this.archGroup = new THREE.Group();
    this.towerGroup = new THREE.Group();
    this.processGroup = new THREE.Group();
    this.enclosureGroup = new THREE.Group();

    this.modelRoot.add(this.foundationGroup);
    this.modelRoot.add(this.trussGirderGroup);
    this.modelRoot.add(this.deckGroup);
    this.modelRoot.add(this.archGroup);
    this.modelRoot.add(this.towerGroup);
    this.modelRoot.add(this.processGroup);
    this.modelRoot.add(this.enclosureGroup);

    // 5. Construct PBR Materials & Hazard Texture
    this.initMaterials();

    // 6. Build the Infrastructure Components matching reference blueprint
    this.buildFoundations();
    this.buildConveyorGalleryAndTruss();
    this.buildTwinArchAndHangers();
    this.buildTransferTower();
    this.buildProcessEquipmentAndMEP();
    this.buildStairsAndScreens();

    // 7. Dynamic Shadow Receiver Ground & Soft Contact Shadow
    const ground = this.buildStudioGround();
    this.shadowPlane = ground.shadowPlane;
    this.groundContactMesh = ground.contactMesh;
    this.scene.add(this.shadowPlane, this.groundContactMesh);

    // Enable castShadow & receiveShadow on all structural meshes
    this.meshes.forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    // Initial Layout position
    this.applyScrollLayout(0, this.isMobile);

    // Start render loop
    this.start();
  }

  /* -------------------------------------------------------------
   * Studio Lighting Rig (Light-Architectural Alignment)
   * 4-Point High-Key Architectural Studio Lighting + Real PCF Soft Shadows
   * ----------------------------------------------------------- */
  private setupLighting() {
    // 1. Ambient Lighting: High-key crisp architectural ambient illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    this.scene.add(ambientLight);

    // 2. Primary Studio Key Light (Crisp Warm Sunlight from Top-Left, highlights arch crowns & truss)
    const keyLight = new THREE.DirectionalLight(0xfffbf2, 2.65);
    keyLight.position.set(-7, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 32;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.02;
    keyLight.shadow.radius = 2.0;
    this.scene.add(keyLight);

    // 3. Secondary Cool Architectural Fill Light (Fills tower structural interior & under-chutes)
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
    fillLight.position.set(9, 4, 7);
    this.scene.add(fillLight);

    // 4. Razor-Sharp Rim / Edge Light (Apple-style specular highlight along blue tubes & yellow rails)
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(2, 9, -9);
    this.scene.add(rimLight);

    // 5. Upward Ground Bounce Light (Simulates reflection from white studio floor onto bottom truss chords)
    const bounceLight = new THREE.DirectionalLight(0xf1f5f9, 0.75);
    bounceLight.position.set(0, -6, 2.5);
    this.scene.add(bounceLight);
  }

  /* -------------------------------------------------------------
   * PBR Materials & Dynamic Canvas Textures
   * ----------------------------------------------------------- */
  private initMaterials() {
    // 1. Architectural Cast Concrete (Pier Cap Box, Corbels)
    this.concreteMat = new THREE.MeshStandardMaterial({
      color: 0xdce2ea,
      roughness: 0.85,
      metalness: 0.05,
    });

    // 2. Concrete Pile Columns & Pedestal Footings
    this.concretePilesMat = new THREE.MeshStandardMaterial({
      color: 0xc9d3de,
      roughness: 0.80,
      metalness: 0.08,
    });

    // 3. Structural Steel Skeleton (Columns, Girders, Rafters - Industrial Slate)
    this.steelTowerMat = new THREE.MeshStandardMaterial({
      color: 0x242f3d,
      roughness: 0.32,
      metalness: 0.88,
    });

    // 4. Open-Web Steel Truss Girder (Metallic Grey Structural Steel)
    this.steelTrussMat = new THREE.MeshStandardMaterial({
      color: 0x3d4b5c,
      roughness: 0.30,
      metalness: 0.90,
    });

    // 5. Diagonal Bracing & Tension Tie Rods
    this.steelBraceMat = new THREE.MeshStandardMaterial({
      color: 0x5a6a7e,
      roughness: 0.25,
      metalness: 0.92,
    });

    // 6. Stacked Double-Chord Tubular Tied-Arch & Deck Skirts (Vibrant Industrial Sky Blue)
    this.blueArchMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.18,
      metalness: 0.65,
    });

    // 7. Heavy Conveyor Head Drive Motors & Pulleys (Equipment Blue)
    this.blueEquipmentMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.28,
      metalness: 0.55,
    });

    // 8. Triangulated Inverted V-Hangers (Safety Red)
    this.redCableMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.22,
      metalness: 0.65,
    });

    // 9. OSHA Safety Yellow (Handrails, Caged Ladder, Saddle Brackets, Stairs)
    this.yellowOshaMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.28,
      metalness: 0.25,
    });

    // 10. Process Cyclone Silo & Bulk Tanks (Clean Off-White)
    this.siloMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.28,
      metalness: 0.18,
    });

    // 11. High-Pressure Process Piping Manifolds (Polished Stainless Steel)
    this.pipingMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.12,
      metalness: 0.96,
    });

    // 12. Heavy Vulcanized Rubber Conveyor Belt
    this.rubberBeltMat = new THREE.MeshStandardMaterial({
      color: 0x181e29,
      roughness: 0.95,
      metalness: 0.05,
    });

    // 13. Conveyor Pulley Roller Cylinder
    this.pulleyMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.85,
    });

    // 14. Corrugated Sheet Metal Roof Canopy
    this.roofSheetMat = new THREE.MeshStandardMaterial({
      color: 0x8a99ad,
      roughness: 0.35,
      metalness: 0.75,
    });

    // 15. Architectural Glazed Wind-screens
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.06,
      transmission: 0.85,
      ior: 1.52,
      transparent: true,
      opacity: 0.52,
    });

    // 16. Protruding Foundation Rebar Starter Dowels
    this.rebarMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.25,
    });

    // 17. 45° Black & Yellow Safety Hazard Chevron Texture
    const chevronTexture = this.buildChevronTexture();
    this.textures.push(chevronTexture);
    this.chevronMat = new THREE.MeshStandardMaterial({
      map: chevronTexture,
      roughness: 0.40,
      metalness: 0.20,
    });

    this.solidMaterials.push(
      this.concreteMat,
      this.concretePilesMat,
      this.steelTowerMat,
      this.steelTrussMat,
      this.steelBraceMat,
      this.blueArchMat,
      this.blueEquipmentMat,
      this.redCableMat,
      this.yellowOshaMat,
      this.siloMat,
      this.pipingMat,
      this.rubberBeltMat,
      this.pulleyMat,
      this.roofSheetMat,
      this.glassMat,
      this.chevronMat,
      this.rebarMat
    );
  }

  /**
   * Generates a 45° alternating black & yellow hazard chevron canvas texture
   */
  private buildChevronTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Fill Safety Yellow
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(0, 0, 128, 128);

    // Draw 45° Black Stripes
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    const stripeWidth = 16;
    for (let i = -128; i < 256; i += stripeWidth * 2) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + stripeWidth, 0);
      ctx.lineTo(i + stripeWidth + 128, 128);
      ctx.lineTo(i + 128, 128);
      ctx.closePath();
    }
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 1);
    return texture;
  }

  /* -------------------------------------------------------------
   * Layer 1: Substructure, Concrete Piles, Column Capitals & Rebar
   * ----------------------------------------------------------- */
  private buildFoundations() {
    // 1. Monolithic Reinforced Concrete Pier Cap Box
    const capGeo = new THREE.BoxGeometry(2.35, 1.45, 2.05);
    this.geometries.push(capGeo);
    const capMesh = new THREE.Mesh(capGeo, this.concreteMat);
    capMesh.position.set(1.5, -0.65, 0);
    this.foundationGroup.add(capMesh);
    this.meshes.push(capMesh);

    // Formwork Reveal Indentation Lines on Pier Cap
    const revealGeo = new THREE.BoxGeometry(2.38, 0.03, 2.08);
    this.geometries.push(revealGeo);
    const darkRevealMat = new THREE.MeshStandardMaterial({ color: 0x8a99ad, roughness: 0.9 });
    this.solidMaterials.push(darkRevealMat);
    const reveal1 = new THREE.Mesh(revealGeo, darkRevealMat);
    reveal1.position.set(1.5, -0.4, 0);
    const reveal2 = new THREE.Mesh(revealGeo, darkRevealMat);
    reveal2.position.set(1.5, -0.95, 0);
    this.foundationGroup.add(reveal1, reveal2);
    this.meshes.push(reveal1, reveal2);

    // Architectural doorway / ingress niche into pier cap
    const portalGeo = new THREE.BoxGeometry(0.55, 0.85, 0.18);
    this.geometries.push(portalGeo);
    const portalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 });
    this.solidMaterials.push(portalMat);
    const portalMesh = new THREE.Mesh(portalGeo, portalMat);
    portalMesh.position.set(1.15, -0.7, 1.02);
    this.foundationGroup.add(portalMesh);
    this.meshes.push(portalMesh);

    // 2. Cantilevered Corbel Shelf supporting Conveyor Bridge Expansion Bearing
    const corbelGeo = new THREE.BoxGeometry(0.55, 0.45, 1.25);
    this.geometries.push(corbelGeo);
    const corbel = new THREE.Mesh(corbelGeo, this.concreteMat);
    corbel.position.set(0.28, -0.15, 0);
    this.foundationGroup.add(corbel);
    this.meshes.push(corbel);

    // Elastomeric Bridge Bearing Pads on corbel
    const bearingGeo = new THREE.BoxGeometry(0.25, 0.08, 0.35);
    this.geometries.push(bearingGeo);
    const bearingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.85 });
    this.solidMaterials.push(bearingMat);
    const bearingF = new THREE.Mesh(bearingGeo, bearingMat);
    bearingF.position.set(0.28, 0.1, 0.35);
    const bearingB = new THREE.Mesh(bearingGeo, bearingMat);
    bearingB.position.set(0.28, 0.1, -0.35);
    this.foundationGroup.add(bearingF, bearingB);
    this.meshes.push(bearingF, bearingB);

    // 3. 8 Concrete Pile Columns with Flared Capitals & Square Pedestal Footings
    const pileGeo = new THREE.CylinderGeometry(0.125, 0.125, 1.7, 24);
    const capitalGeo = new THREE.CylinderGeometry(0.17, 0.13, 0.12, 24); // Column capital collar
    const footingGeo = new THREE.BoxGeometry(0.38, 0.15, 0.38);
    const rebarGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.22, 8);
    const tieBeamGeo = new THREE.BoxGeometry(0.12, 0.18, 1.45); // Cross tie-beam connecting pile pairs
    this.geometries.push(pileGeo, capitalGeo, footingGeo, rebarGeo, tieBeamGeo);

    const xOffsets = [0.65, 1.25, 1.85, 2.45];
    const zOffsets = [-0.75, 0.75];

    xOffsets.forEach((x, colIdx) => {
      // Cylindrical Piles (Front & Back)
      zOffsets.forEach((z) => {
        // Pile Shaft
        const pile = new THREE.Mesh(pileGeo, this.concretePilesMat);
        pile.position.set(x, -2.1, z);

        // Flared Column Capital at top
        const cap = new THREE.Mesh(capitalGeo, this.concretePilesMat);
        cap.position.set(x, -1.35, z);

        // Flanged Pedestal Footing at base
        const footing = new THREE.Mesh(footingGeo, this.concretePilesMat);
        footing.position.set(x, -2.9, z);

        this.foundationGroup.add(pile, cap, footing);
        this.meshes.push(pile, cap, footing);

        // Protruding Rebar Starter Dowels on outer pedestal corners
        if (colIdx === 0 || colIdx === 3) {
          const pinOffsets = [-0.11, 0.11];
          pinOffsets.forEach((px) => {
            pinOffsets.forEach((pz) => {
              const rebar = new THREE.Mesh(rebarGeo, this.rebarMat);
              rebar.position.set(x + px, -2.76, z + pz);
              this.foundationGroup.add(rebar);
              this.meshes.push(rebar);
            });
          });
        }
      });

      // Horizontal Cross Tie-Beam connecting front pile to back pile
      const tieBeam = new THREE.Mesh(tieBeamGeo, this.concretePilesMat);
      tieBeam.position.set(x, -2.1, 0);
      this.foundationGroup.add(tieBeam);
      this.meshes.push(tieBeam);
    });
  }

  /* -------------------------------------------------------------
   * Layer 2: Open-Web Steel Warren Truss Girder & Conveyor Deck Details
   * ----------------------------------------------------------- */
  private buildConveyorGalleryAndTruss() {
    // 1. Cantilever Bridge Deck Top Plate
    const deckGeo = new THREE.BoxGeometry(4.75, 0.08, 1.05);
    this.geometries.push(deckGeo);
    const deckMesh = new THREE.Mesh(deckGeo, this.concreteMat);
    deckMesh.position.set(-1.8, 0.18, 0);
    this.deckGroup.add(deckMesh);
    this.meshes.push(deckMesh);

    // Blue Longitudinal Side Skirt Channels
    const skirtGeo = new THREE.BoxGeometry(4.75, 0.24, 0.04);
    this.geometries.push(skirtGeo);
    const skirtFront = new THREE.Mesh(skirtGeo, this.blueArchMat);
    skirtFront.position.set(-1.8, 0.24, 0.54);
    const skirtBack = new THREE.Mesh(skirtGeo, this.blueArchMat);
    skirtBack.position.set(-1.8, 0.24, -0.54);
    this.deckGroup.add(skirtFront, skirtBack);
    this.meshes.push(skirtFront, skirtBack);

    // 2. Vulcanized Rubber Conveyor Belt
    const beltGeo = new THREE.BoxGeometry(4.55, 0.025, 0.48);
    this.geometries.push(beltGeo);
    const belt = new THREE.Mesh(beltGeo, this.rubberBeltMat);
    belt.position.set(-1.75, 0.23, 0);
    this.deckGroup.add(belt);
    this.meshes.push(belt);

    // 3. Troughing Idler Roller Sets spaced along the conveyor span
    const idlerCenterGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.28, 12);
    const idlerWingGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.14, 12);
    const returnIdlerGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.52, 12);
    this.geometries.push(idlerCenterGeo, idlerWingGeo, returnIdlerGeo);

    for (let idr = 0; idr < 7; idr++) {
      const ix = -3.8 + idr * 0.65;
      // Center roller
      const rCenter = new THREE.Mesh(idlerCenterGeo, this.steelBraceMat);
      rCenter.rotation.x = Math.PI / 2;
      rCenter.position.set(ix, 0.21, 0);

      // Angled wing rollers (35° trough angle)
      const rWingF = new THREE.Mesh(idlerWingGeo, this.steelBraceMat);
      rWingF.position.set(ix, 0.23, 0.18);
      rWingF.rotation.x = Math.PI / 2 + 0.35;

      const rWingB = new THREE.Mesh(idlerWingGeo, this.steelBraceMat);
      rWingB.position.set(ix, 0.23, -0.18);
      rWingB.rotation.x = Math.PI / 2 - 0.35;

      // Underside return roller
      const rReturn = new THREE.Mesh(returnIdlerGeo, this.steelBraceMat);
      rReturn.rotation.x = Math.PI / 2;
      rReturn.position.set(ix, 0.08, 0);

      this.deckGroup.add(rCenter, rWingF, rWingB, rReturn);
      this.meshes.push(rCenter, rWingF, rWingB, rReturn);
    }

    // 4. Conveyor Head/Tail Pulley Roller (Around which the belt loops)
    const pulleyGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.52, 24);
    const bearingBlockGeo = new THREE.BoxGeometry(0.12, 0.18, 0.08);
    this.geometries.push(pulleyGeo, bearingBlockGeo);

    const pulley = new THREE.Mesh(pulleyGeo, this.pulleyMat);
    pulley.rotation.x = Math.PI / 2;
    pulley.position.set(-4.12, 0.16, 0);

    const bearingBlockF = new THREE.Mesh(bearingBlockGeo, this.blueEquipmentMat);
    bearingBlockF.position.set(-4.12, 0.16, 0.32);
    const bearingBlockB = new THREE.Mesh(bearingBlockGeo, this.blueEquipmentMat);
    bearingBlockB.position.set(-4.12, 0.16, -0.32);

    this.deckGroup.add(pulley, bearingBlockF, bearingBlockB);
    this.meshes.push(pulley, bearingBlockF, bearingBlockB);

    // 5. End Bumper Beam with 45° Black & Yellow Hazard Stripes
    const bumperGeo = new THREE.BoxGeometry(0.14, 0.28, 1.08);
    this.geometries.push(bumperGeo);
    const bumper = new THREE.Mesh(bumperGeo, this.chevronMat);
    bumper.position.set(-4.24, 0.06, 0);
    this.deckGroup.add(bumper);
    this.meshes.push(bumper);

    // 6. Open-Web Steel Warren Truss Girder Running Underneath the Entire Deck
    const chordGeo = new THREE.BoxGeometry(4.75, 0.06, 0.06);
    this.geometries.push(chordGeo);

    // Front Bottom Chord (below deck)
    const bChordF = new THREE.Mesh(chordGeo, this.steelTrussMat);
    bChordF.position.set(-1.8, -0.25, 0.48);

    // Back Bottom Chord
    const bChordB = new THREE.Mesh(chordGeo, this.steelTrussMat);
    bChordB.position.set(-1.8, -0.25, -0.48);

    this.trussGirderGroup.add(bChordF, bChordB);
    this.meshes.push(bChordF, bChordB);

    // Vertical Stiffener Struts & Diagonal Web Braces (Warren Truss)
    const vStrutGeo = new THREE.BoxGeometry(0.06, 0.42, 0.06);
    const diagBraceGeo = new THREE.BoxGeometry(0.05, 0.58, 0.05);
    const windBraceGeo = new THREE.BoxGeometry(0.03, 0.03, 1.08);
    this.geometries.push(vStrutGeo, diagBraceGeo, windBraceGeo);

    const trussBays = 11;
    const bayWidth = 4.4 / trussBays;

    for (let i = 0; i <= trussBays; i++) {
      const tx = -4.0 + i * bayWidth;

      // Vertical Struts (Front and Back)
      const vStrutF = new THREE.Mesh(vStrutGeo, this.steelTrussMat);
      vStrutF.position.set(tx, -0.04, 0.48);
      const vStrutB = new THREE.Mesh(vStrutGeo, this.steelTrussMat);
      vStrutB.position.set(tx, -0.04, -0.48);

      // Transverse Bottom Cross-Tie Beam connecting front to back
      const crossTieGeo = new THREE.BoxGeometry(0.05, 0.05, 0.96);
      this.geometries.push(crossTieGeo);
      const crossTie = new THREE.Mesh(crossTieGeo, this.steelTrussMat);
      crossTie.position.set(tx, -0.25, 0);

      this.trussGirderGroup.add(vStrutF, vStrutB, crossTie);
      this.meshes.push(vStrutF, vStrutB, crossTie);

      // Diagonal Truss Braces (Alternating Warren Truss pattern)
      if (i < trussBays) {
        const diagAngle = (i % 2 === 0 ? 1 : -1) * (Math.PI / 4.4);
        const diagF = new THREE.Mesh(diagBraceGeo, this.steelTrussMat);
        diagF.position.set(tx + bayWidth / 2, -0.04, 0.48);
        diagF.rotation.z = diagAngle;

        const diagB = new THREE.Mesh(diagBraceGeo, this.steelTrussMat);
        diagB.position.set(tx + bayWidth / 2, -0.04, -0.48);
        diagB.rotation.z = diagAngle;

        // Planar horizontal wind brace across bottom truss bay
        const wBrace = new THREE.Mesh(windBraceGeo, this.steelBraceMat);
        wBrace.position.set(tx + bayWidth / 2, -0.25, 0);
        wBrace.rotation.y = (i % 2 === 0 ? 1 : -1) * (Math.PI / 5.2);

        this.trussGirderGroup.add(diagF, diagB, wBrace);
        this.meshes.push(diagF, diagB, wBrace);
      }
    }

    // 7. Structural Hanger Anchor Posts (Vertical steel posts extending up from truss to receive red V-hangers)
    const hangerPostGeo = new THREE.BoxGeometry(0.08, 0.52, 0.08);
    const gussetPlateGeo = new THREE.BoxGeometry(0.12, 0.14, 0.02);
    this.geometries.push(hangerPostGeo, gussetPlateGeo);

    // 5 Hanger Station Locations along X:
    const stationX = [-3.85, -3.15, -2.35, -1.55, -0.75];
    stationX.forEach((sx) => {
      // Front Post
      const hPostF = new THREE.Mesh(hangerPostGeo, this.steelTrussMat);
      hPostF.position.set(sx, 0.26, 0.52);
      const gussetF = new THREE.Mesh(gussetPlateGeo, this.yellowOshaMat);
      gussetF.position.set(sx, 0.42, 0.52);

      // Back Post
      const hPostB = new THREE.Mesh(hangerPostGeo, this.steelTrussMat);
      hPostB.position.set(sx, 0.26, -0.52);
      const gussetB = new THREE.Mesh(gussetPlateGeo, this.yellowOshaMat);
      gussetB.position.set(sx, 0.42, -0.52);

      this.deckGroup.add(hPostF, gussetF, hPostB, gussetB);
      this.meshes.push(hPostF, gussetF, hPostB, gussetB);
    });

    // 8. OSHA 3-Rail Safety Handrails (Top Rail, Mid Rail, Kickplate, Stanchions)
    const railLength = 4.7;
    const topRailGeo = new THREE.CylinderGeometry(0.012, 0.012, railLength, 12);
    const midRailGeo = new THREE.CylinderGeometry(0.009, 0.009, railLength, 12);
    const toeBoardGeo = new THREE.BoxGeometry(railLength, 0.05, 0.01);
    this.geometries.push(topRailGeo, midRailGeo, toeBoardGeo);

    // Front Railing
    const topRailF = new THREE.Mesh(topRailGeo, this.yellowOshaMat);
    topRailF.rotation.z = Math.PI / 2;
    topRailF.position.set(-1.8, 0.48, 0.51);

    const midRailF = new THREE.Mesh(midRailGeo, this.yellowOshaMat);
    midRailF.rotation.z = Math.PI / 2;
    midRailF.position.set(-1.8, 0.36, 0.51);

    const toeBoardF = new THREE.Mesh(toeBoardGeo, this.yellowOshaMat);
    toeBoardF.position.set(-1.8, 0.27, 0.51);

    // Back Railing
    const topRailB = new THREE.Mesh(topRailGeo, this.yellowOshaMat);
    topRailB.rotation.z = Math.PI / 2;
    topRailB.position.set(-1.8, 0.48, -0.51);

    const midRailB = new THREE.Mesh(midRailGeo, this.yellowOshaMat);
    midRailB.rotation.z = Math.PI / 2;
    midRailB.position.set(-1.8, 0.36, -0.51);

    const toeBoardB = new THREE.Mesh(toeBoardGeo, this.yellowOshaMat);
    toeBoardB.position.set(-1.8, 0.27, -0.51);

    this.deckGroup.add(topRailF, midRailF, toeBoardF, topRailB, midRailB, toeBoardB);
    this.meshes.push(topRailF, midRailF, toeBoardF, topRailB, midRailB, toeBoardB);

    // Vertical Stanchions spaced along catwalk
    const postGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.28, 12);
    this.geometries.push(postGeo);
    for (let i = 0; i < 15; i++) {
      const px = -4.05 + i * 0.32;
      const postF = new THREE.Mesh(postGeo, this.yellowOshaMat);
      postF.position.set(px, 0.35, 0.51);
      const postB = new THREE.Mesh(postGeo, this.yellowOshaMat);
      postB.position.set(px, 0.35, -0.51);
      this.deckGroup.add(postF, postB);
      this.meshes.push(postF, postB);
    }
  }

  /* -------------------------------------------------------------
   * Layer 3: Stacked Double-Chord Blue Arch Pipes & Inverted V-Hangers
   * ----------------------------------------------------------- */
  private buildTwinArchAndHangers() {
    // Upper Arch Curve
    const upperCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.15, 0.65, 0.0),
      new THREE.Vector3(-3.25, 1.68, 0.0),
      new THREE.Vector3(-2.15, 2.05, 0.0),
      new THREE.Vector3(-0.95, 1.78, 0.0),
      new THREE.Vector3(0.65, 0.95, 0.0),
    ]);

    // Lower Arch Curve (parallel, offset ~0.34 units lower)
    const lowerCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.15, 0.31, 0.0),
      new THREE.Vector3(-3.25, 1.34, 0.0),
      new THREE.Vector3(-2.15, 1.71, 0.0),
      new THREE.Vector3(-0.95, 1.44, 0.0),
      new THREE.Vector3(0.65, 0.61, 0.0),
    ]);

    const archPipeGeo = new THREE.TubeGeometry(upperCurve, 64, 0.078, 20, false);
    const lowerPipeGeo = new THREE.TubeGeometry(lowerCurve, 64, 0.078, 20, false);
    this.geometries.push(archPipeGeo, lowerPipeGeo);

    const upperPipe = new THREE.Mesh(archPipeGeo, this.blueArchMat);
    const lowerPipe = new THREE.Mesh(lowerPipeGeo, this.blueArchMat);
    this.archGroup.add(upperPipe, lowerPipe);
    this.meshes.push(upperPipe, lowerPipe);

    // Open Flanged Pipe Mouths at cantilever tip (Reference blueprint detailing)
    const flangeCollarGeo = new THREE.CylinderGeometry(0.098, 0.098, 0.035, 24);
    const pipeInnerBoreGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.04, 24);
    this.geometries.push(flangeCollarGeo, pipeInnerBoreGeo);

    const boreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });
    this.solidMaterials.push(boreMat);

    // Upper pipe tip collar & dark inner bore
    const tipFlangeTop = new THREE.Mesh(flangeCollarGeo, this.blueArchMat);
    tipFlangeTop.rotation.z = Math.PI / 2;
    tipFlangeTop.position.set(-4.16, 0.65, 0.0);

    const boreTop = new THREE.Mesh(pipeInnerBoreGeo, boreMat);
    boreTop.rotation.z = Math.PI / 2;
    boreTop.position.set(-4.17, 0.65, 0.0);

    // Lower pipe tip collar & dark inner bore
    const tipFlangeBottom = new THREE.Mesh(flangeCollarGeo, this.blueArchMat);
    tipFlangeBottom.rotation.z = Math.PI / 2;
    tipFlangeBottom.position.set(-4.16, 0.31, 0.0);

    const boreBottom = new THREE.Mesh(pipeInnerBoreGeo, boreMat);
    boreBottom.rotation.z = Math.PI / 2;
    boreBottom.position.set(-4.17, 0.31, 0.0);

    this.archGroup.add(tipFlangeTop, boreTop, tipFlangeBottom, boreBottom);
    this.meshes.push(tipFlangeTop, boreTop, tipFlangeBottom, boreBottom);

    // Vertical & Diagonal Structural Web Spacers connecting upper & lower pipes
    const spacerGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.34, 10);
    this.geometries.push(spacerGeo);
    const spacerT = [0.12, 0.28, 0.48, 0.68, 0.88];
    spacerT.forEach((t) => {
      const pU = upperCurve.getPoint(t);
      const pL = lowerCurve.getPoint(t);
      const dir = new THREE.Vector3().subVectors(pU, pL);
      const len = dir.length();
      const sMeshGeo = new THREE.CylinderGeometry(0.02, 0.02, len, 8);
      this.geometries.push(sMeshGeo);
      const sMesh = new THREE.Mesh(sMeshGeo, this.steelBraceMat);
      sMesh.position.copy(pL).addScaledVector(dir, 0.5);
      sMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      this.archGroup.add(sMesh);
      this.meshes.push(sMesh);
    });

    // 5 Vierendeel Saddle Clamps & Triangulated Inverted V-Hangers
    const vStations = [
      {
        clampX: -3.85,
        tVal: 0.065,
        deckAnchorA: new THREE.Vector3(-4.0, 0.45, 0.52),
        deckAnchorB: new THREE.Vector3(-3.7, 0.45, 0.52),
      },
      {
        clampX: -3.15,
        tVal: 0.22,
        deckAnchorA: new THREE.Vector3(-3.35, 0.45, 0.52),
        deckAnchorB: new THREE.Vector3(-2.95, 0.45, 0.52),
      },
      {
        clampX: -2.35,
        tVal: 0.41,
        deckAnchorA: new THREE.Vector3(-2.55, 0.45, 0.52),
        deckAnchorB: new THREE.Vector3(-2.15, 0.45, 0.52),
      },
      {
        clampX: -1.55,
        tVal: 0.61,
        deckAnchorA: new THREE.Vector3(-1.75, 0.45, 0.52),
        deckAnchorB: new THREE.Vector3(-1.35, 0.45, 0.52),
      },
      {
        clampX: -0.75,
        tVal: 0.81,
        deckAnchorA: new THREE.Vector3(-0.95, 0.45, 0.52),
        deckAnchorB: new THREE.Vector3(-0.55, 0.45, 0.52),
      },
    ];

    const saddleGeo = new THREE.BoxGeometry(0.14, 0.46, 0.16);
    const clevisGeo = new THREE.BoxGeometry(0.06, 0.08, 0.06);
    this.geometries.push(saddleGeo, clevisGeo);

    vStations.forEach((stn) => {
      const ptU = upperCurve.getPoint(stn.tVal);
      const ptL = lowerCurve.getPoint(stn.tVal);
      const midY = (ptU.y + ptL.y) / 2;

      // Saddle Clamp wrapping around both upper and lower tubes
      const saddle = new THREE.Mesh(saddleGeo, this.yellowOshaMat);
      saddle.position.set(ptU.x, midY, 0);
      this.archGroup.add(saddle);
      this.meshes.push(saddle);

      // Clevis attachment pin under saddle
      const clevis = new THREE.Mesh(clevisGeo, this.yellowOshaMat);
      const apex = new THREE.Vector3(ptL.x, ptL.y - 0.08, 0);
      clevis.position.copy(apex);
      this.archGroup.add(clevis);
      this.meshes.push(clevis);

      // Helper to build a red hanger tie rod between two 3D points
      const buildStrut = (p1: THREE.Vector3, p2: THREE.Vector3) => {
        const dir = new THREE.Vector3().subVectors(p2, p1);
        const len = dir.length();
        const strutGeo = new THREE.CylinderGeometry(0.016, 0.016, len, 10);
        this.geometries.push(strutGeo);

        const strut = new THREE.Mesh(strutGeo, this.redCableMat);
        strut.position.copy(p1).addScaledVector(dir, 0.5);
        strut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return strut;
      };

      // Front Leg A (Inverted V front branch)
      const strutA_F = buildStrut(apex, stn.deckAnchorA);
      // Front Leg B (Inverted V back branch)
      const strutB_F = buildStrut(apex, stn.deckAnchorB);

      // Symmetrical Back Hanger Rods (reaching to rear deck chord)
      const backAnchorA = stn.deckAnchorA.clone().setZ(-0.52);
      const backAnchorB = stn.deckAnchorB.clone().setZ(-0.52);
      const strutA_B = buildStrut(apex, backAnchorA);
      const strutB_B = buildStrut(apex, backAnchorB);

      this.archGroup.add(strutA_F, strutB_F, strutA_B, strutB_B);
      this.meshes.push(strutA_F, strutB_F, strutA_B, strutB_B);
    });
  }

  /* -------------------------------------------------------------
   * Layer 4: Structural Steel Transfer Head Tower & Gabled Roof
   * ----------------------------------------------------------- */
  private buildTransferTower() {
    // 4 Wide-Flange Corner Columns (W-beams with baseplates)
    const colGeo = new THREE.BoxGeometry(0.09, 2.38, 0.09);
    const baseplateGeo = new THREE.BoxGeometry(0.18, 0.04, 0.18);
    this.geometries.push(colGeo, baseplateGeo);

    const towerX = [0.65, 2.42];
    const towerZ = [-0.85, 0.85];

    towerX.forEach((x) => {
      towerZ.forEach((z) => {
        const col = new THREE.Mesh(colGeo, this.steelTowerMat);
        col.position.set(x, 1.25, z);

        const bp = new THREE.Mesh(baseplateGeo, this.steelBraceMat);
        bp.position.set(x, 0.1, z);

        this.towerGroup.add(col, bp);
        this.meshes.push(col, bp);
      });
    });

    // Horizontal W-Beams at 3 Floor Levels
    const beamLongGeo = new THREE.BoxGeometry(1.86, 0.09, 0.06);
    const beamTransGeo = new THREE.BoxGeometry(0.06, 0.09, 1.76);
    this.geometries.push(beamLongGeo, beamTransGeo);

    const levels = [0.35, 1.45, 2.38];
    levels.forEach((ly) => {
      const bFront = new THREE.Mesh(beamLongGeo, this.steelTowerMat);
      bFront.position.set(1.53, ly, 0.85);

      const bRear = new THREE.Mesh(beamLongGeo, this.steelTowerMat);
      bRear.position.set(1.53, ly, -0.85);

      const bLeft = new THREE.Mesh(beamTransGeo, this.steelTowerMat);
      bLeft.position.set(0.65, ly, 0);

      const bRight = new THREE.Mesh(beamTransGeo, this.steelTowerMat);
      bRight.position.set(2.42, ly, 0);

      this.towerGroup.add(bFront, bRear, bLeft, bRight);
      this.meshes.push(bFront, bRear, bLeft, bRight);
    });

    // Diagonal Cross-Bracing (X-Bracing) across Rear and Right Tower Bays
    const braceGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.05, 8);
    this.geometries.push(braceGeo);

    // Rear Bay X-Braces
    const braceR1 = new THREE.Mesh(braceGeo, this.steelBraceMat);
    braceR1.position.set(1.53, 0.9, -0.85);
    braceR1.rotation.z = Math.PI / 4.2;

    const braceR2 = new THREE.Mesh(braceGeo, this.steelBraceMat);
    braceR2.position.set(1.53, 0.9, -0.85);
    braceR2.rotation.z = -Math.PI / 4.2;

    // Right Bay X-Braces
    const braceRt1 = new THREE.Mesh(braceGeo, this.steelBraceMat);
    braceRt1.position.set(2.42, 0.9, 0);
    braceRt1.rotation.x = Math.PI / 4.2;

    const braceRt2 = new THREE.Mesh(braceGeo, this.steelBraceMat);
    braceRt2.position.set(2.42, 0.9, 0);
    braceRt2.rotation.x = -Math.PI / 4.2;

    this.towerGroup.add(braceR1, braceR2, braceRt1, braceRt2);
    this.meshes.push(braceR1, braceR2, braceRt1, braceRt2);

    // Gabled Roof Canopy Structure (Pitched double-sloped roof matching reference blueprint)
    const roofLeftGeo = new THREE.BoxGeometry(2.45, 0.04, 1.15);
    const roofRightGeo = new THREE.BoxGeometry(2.45, 0.04, 1.15);
    const ridgeBeamGeo = new THREE.BoxGeometry(2.45, 0.06, 0.06);
    this.geometries.push(roofLeftGeo, roofRightGeo, ridgeBeamGeo);

    const roofL = new THREE.Mesh(roofLeftGeo, this.roofSheetMat);
    roofL.position.set(1.48, 2.58, 0.54);
    roofL.rotation.x = -0.14; // Pitch slope forward

    const roofR = new THREE.Mesh(roofRightGeo, this.roofSheetMat);
    roofR.position.set(1.48, 2.58, -0.54);
    roofR.rotation.x = 0.14; // Pitch slope backward

    const ridgeBeam = new THREE.Mesh(ridgeBeamGeo, this.steelTowerMat);
    ridgeBeam.position.set(1.48, 2.66, 0);

    // Roof Truss Rafters visible underneath
    const rafterGeo = new THREE.BoxGeometry(0.04, 0.04, 1.12);
    this.geometries.push(rafterGeo);
    const rafter1 = new THREE.Mesh(rafterGeo, this.steelTowerMat);
    rafter1.position.set(0.68, 2.52, 0.52);
    rafter1.rotation.x = -0.14;
    const rafter2 = new THREE.Mesh(rafterGeo, this.steelTowerMat);
    rafter2.position.set(2.38, 2.52, 0.52);
    rafter2.rotation.x = -0.14;

    this.towerGroup.add(roofL, roofR, ridgeBeam, rafter1, rafter2);
    this.meshes.push(roofL, roofR, ridgeBeam, rafter1, rafter2);

    // Cantilevered Perimeter Catwalk Platform wrapping around the right tower edge
    const catwalkGeo = new THREE.BoxGeometry(0.72, 0.05, 1.95);
    this.geometries.push(catwalkGeo);
    const catwalk = new THREE.Mesh(catwalkGeo, this.concreteMat);
    catwalk.position.set(2.78, 1.45, 0);
    this.towerGroup.add(catwalk);
    this.meshes.push(catwalk);

    // Diagonal Catwalk Knee Brackets supporting underside of platform
    const kneeGeo = new THREE.BoxGeometry(0.04, 0.45, 0.04);
    this.geometries.push(kneeGeo);
    const knee1 = new THREE.Mesh(kneeGeo, this.steelTowerMat);
    knee1.position.set(2.6, 1.25, 0.6);
    knee1.rotation.z = -Math.PI / 4;

    const knee2 = new THREE.Mesh(kneeGeo, this.steelTowerMat);
    knee2.position.set(2.6, 1.25, -0.6);
    knee2.rotation.z = -Math.PI / 4;

    this.towerGroup.add(knee1, knee2);
    this.meshes.push(knee1, knee2);

    // Catwalk Perimeter Yellow Guardrails
    const cRailGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.95, 12);
    this.geometries.push(cRailGeo);
    const cRail = new THREE.Mesh(cRailGeo, this.yellowOshaMat);
    cRail.rotation.x = Math.PI / 2;
    cRail.position.set(3.12, 1.75, 0);
    this.towerGroup.add(cRail);
    this.meshes.push(cRail);
  }

  /* -------------------------------------------------------------
   * Layer 5: Process Plant, Silo, Chutes & High-Pressure MEP Piping
   * ----------------------------------------------------------- */
  private buildProcessEquipmentAndMEP() {
    // 1. Process Cyclone Silo Vessel (Cylindrical Body + Conical Hopper)
    const siloBodyGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.72, 32);
    const hopperGeo = new THREE.CylinderGeometry(0.36, 0.08, 0.48, 32);
    const topCapGeo = new THREE.CylinderGeometry(0.24, 0.36, 0.12, 32);
    this.geometries.push(siloBodyGeo, hopperGeo, topCapGeo);

    const siloBody = new THREE.Mesh(siloBodyGeo, this.siloMat);
    siloBody.position.set(1.42, 1.5, -0.05);

    const hopper = new THREE.Mesh(hopperGeo, this.siloMat);
    hopper.position.set(1.42, 0.9, -0.05);

    const topCap = new THREE.Mesh(topCapGeo, this.siloMat);
    topCap.position.set(1.42, 1.92, -0.05);

    this.processGroup.add(siloBody, hopper, topCap);
    this.meshes.push(siloBody, hopper, topCap);

    // 2. Rectangular Discharge Chute / Rock Box feeding onto Conveyor Belt
    const chuteGeo = new THREE.BoxGeometry(0.35, 0.45, 0.28);
    this.geometries.push(chuteGeo);
    const chute = new THREE.Mesh(chuteGeo, this.steelTowerMat);
    chute.position.set(0.95, 0.58, 0);
    chute.rotation.z = Math.PI / 6;
    this.processGroup.add(chute);
    this.meshes.push(chute);

    // 3. Electric Conveyor Head Drive Motor & Gearbox in Equipment Blue (#1D4ED8)
    const motorGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.42, 16);
    const gearboxGeo = new THREE.BoxGeometry(0.28, 0.28, 0.32);
    this.geometries.push(motorGeo, gearboxGeo);

    const motor = new THREE.Mesh(motorGeo, this.blueEquipmentMat);
    motor.rotation.z = Math.PI / 2;
    motor.position.set(0.85, 0.38, 0.45);

    const gearbox = new THREE.Mesh(gearboxGeo, this.blueEquipmentMat);
    gearbox.position.set(0.62, 0.38, 0.45);

    this.processGroup.add(motor, gearbox);
    this.meshes.push(motor, gearbox);

    // 4. Silo Vertical Access Ladder with Semi-Circular Safety Hoop Cage
    const ladderSideGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.6, 8);
    const rungGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.22, 8);
    const hoopGeo = new THREE.TorusGeometry(0.18, 0.008, 8, 16, Math.PI * 1.3);
    this.geometries.push(ladderSideGeo, rungGeo, hoopGeo);

    const lSide1 = new THREE.Mesh(ladderSideGeo, this.yellowOshaMat);
    lSide1.position.set(1.82, 1.6, 0.22);
    const lSide2 = new THREE.Mesh(ladderSideGeo, this.yellowOshaMat);
    lSide2.position.set(1.82, 1.6, 0.44);

    this.processGroup.add(lSide1, lSide2);
    this.meshes.push(lSide1, lSide2);

    for (let r = 0; r < 8; r++) {
      const rung = new THREE.Mesh(rungGeo, this.yellowOshaMat);
      rung.position.set(1.82, 0.95 + r * 0.2, 0.33);
      this.processGroup.add(rung);
      this.meshes.push(rung);

      // Safety Cage Hoops
      if (r >= 2) {
        const hoop = new THREE.Mesh(hoopGeo, this.yellowOshaMat);
        hoop.rotation.x = Math.PI / 2;
        hoop.position.set(1.88, 0.95 + r * 0.2, 0.33);
        this.processGroup.add(hoop);
        this.meshes.push(hoop);
      }
    }

    // 5. Industrial Exhaust Stack / Flue rising above roof with yellow maintenance crow's nest cage
    const stackGeo = new THREE.CylinderGeometry(0.09, 0.09, 1.65, 20);
    const stackPlatformGeo = new THREE.BoxGeometry(0.48, 0.04, 0.48);
    const stackRailGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.48, 8);
    this.geometries.push(stackGeo, stackPlatformGeo, stackRailGeo);

    const stack = new THREE.Mesh(stackGeo, this.pipingMat);
    stack.position.set(1.55, 2.55, 0.35);

    // Elevated Yellow Crow's Nest Platform at top of stack (Matching reference image)
    const stackPlatform = new THREE.Mesh(stackPlatformGeo, this.yellowOshaMat);
    stackPlatform.position.set(1.55, 3.25, 0.35);

    // Safety Cage Railings around Crow's Nest
    const sRail1 = new THREE.Mesh(stackRailGeo, this.yellowOshaMat);
    sRail1.position.set(1.55, 3.45, 0.58);
    sRail1.rotation.z = Math.PI / 2;

    const sRail2 = new THREE.Mesh(stackRailGeo, this.yellowOshaMat);
    sRail2.position.set(1.55, 3.45, 0.12);
    sRail2.rotation.z = Math.PI / 2;

    this.processGroup.add(stack, stackPlatform, sRail1, sRail2);
    this.meshes.push(stack, stackPlatform, sRail1, sRail2);

    // 6. High-Pressure Process Piping Header Rack (Stainless Steel with Flanged Elbows)
    const pipeMainGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.45, 16);
    const pipeRiserGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.15, 16);
    const elbowGeo = new THREE.TorusGeometry(0.095, 0.045, 12, 16, Math.PI / 2);
    const flangeGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16);
    this.geometries.push(pipeMainGeo, pipeRiserGeo, elbowGeo, flangeGeo);

    // Horizontal Main Header
    const pipeMain = new THREE.Mesh(pipeMainGeo, this.pipingMat);
    pipeMain.rotation.z = Math.PI / 2;
    pipeMain.position.set(1.65, 1.1, 0.94);

    // Elbow 90 deg leading up
    const elbow1 = new THREE.Mesh(elbowGeo, this.pipingMat);
    elbow1.position.set(2.32, 1.1, 0.94);

    // Vertical Riser Pipe
    const pipeRiser = new THREE.Mesh(pipeRiserGeo, this.pipingMat);
    pipeRiser.position.set(2.36, 1.65, 0.94);

    // Secondary Return Loop Line (Parallel pipe running below)
    const pipeSec = new THREE.Mesh(pipeMainGeo, this.pipingMat);
    pipeSec.rotation.z = Math.PI / 2;
    pipeSec.position.set(1.65, 0.85, 0.94);

    // Flange joints on piping
    const flg1 = new THREE.Mesh(flangeGeo, this.steelBraceMat);
    flg1.rotation.z = Math.PI / 2;
    flg1.position.set(1.25, 1.1, 0.94);

    const flg2 = new THREE.Mesh(flangeGeo, this.steelBraceMat);
    flg2.rotation.z = Math.PI / 2;
    flg2.position.set(2.05, 1.1, 0.94);

    this.processGroup.add(pipeMain, elbow1, pipeRiser, pipeSec, flg1, flg2);
    this.meshes.push(pipeMain, elbow1, pipeRiser, pipeSec, flg1, flg2);

    // Central Technological Digital Twin Beacon (Pulsing Light Core within tower)
    const coreBeaconGeo = new THREE.OctahedronGeometry(0.18, 0);
    this.geometries.push(coreBeaconGeo);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      emissive: 0x0d9488,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });
    this.solidMaterials.push(beaconMat);
    const beacon = new THREE.Mesh(coreBeaconGeo, beaconMat);
    beacon.position.set(1.42, 0.55, 0);
    this.processGroup.add(beacon);
    this.meshes.push(beacon);

    const beaconLight = new THREE.PointLight(0x0d9488, 2.0, 4.5);
    beaconLight.position.set(1.42, 0.55, 0);
    this.processGroup.add(beaconLight);
  }

  /* -------------------------------------------------------------
   * Layer 6: Two-Flight Switchback Stairs & Architectural Screens
   * ----------------------------------------------------------- */
  private buildStairsAndScreens() {
    // 1. Two-Flight Industrial Switchback Staircase (Matching reference blueprint)
    // Lower Flight: Rises from ground (y = -1.15) to Intermediate Landing (y = 0.22)
    const stringerGeo = new THREE.BoxGeometry(0.04, 1.65, 0.16);
    const stepGeo = new THREE.BoxGeometry(0.14, 0.025, 0.36);
    const stairPostGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.35, 12);
    this.geometries.push(stringerGeo, stepGeo, stairPostGeo);

    // Lower Flight Stringers
    const stringer1 = new THREE.Mesh(stringerGeo, this.steelTowerMat);
    stringer1.rotation.z = -Math.PI / 4.4;
    stringer1.position.set(2.05, -0.45, 1.15);

    const stringer2 = new THREE.Mesh(stringerGeo, this.steelTowerMat);
    stringer2.rotation.z = -Math.PI / 4.4;
    stringer2.position.set(2.05, -0.45, 1.51);

    this.enclosureGroup.add(stringer1, stringer2);
    this.meshes.push(stringer1, stringer2);

    // 8 Individual Anti-Slip Step Treads (Lower flight)
    for (let s = 0; s < 8; s++) {
      const step = new THREE.Mesh(stepGeo, this.concreteMat);
      step.position.set(1.55 + s * 0.125, -0.92 + s * 0.14, 1.33);
      this.enclosureGroup.add(step);
      this.meshes.push(step);
    }

    // Intermediate Landing Platform (Corner resting pad)
    const landingGeo = new THREE.BoxGeometry(0.55, 0.06, 0.65);
    this.geometries.push(landingGeo);
    const landing = new THREE.Mesh(landingGeo, this.concreteMat);
    landing.position.set(2.62, 0.22, 1.33);
    this.enclosureGroup.add(landing);
    this.meshes.push(landing);

    // Vertical Landing Support Columns anchoring down to foundation
    const postCol1 = new THREE.Mesh(stairPostGeo, this.steelTowerMat);
    postCol1.position.set(2.78, -0.45, 1.55);
    const postCol2 = new THREE.Mesh(stairPostGeo, this.steelTowerMat);
    postCol2.position.set(2.45, -0.45, 1.55);
    this.enclosureGroup.add(postCol1, postCol2);
    this.meshes.push(postCol1, postCol2);

    // Upper Switchback Flight: Rises from Landing (y = 0.22) to Main Catwalk (y = 1.45)
    const stringerUpperGeo = new THREE.BoxGeometry(0.04, 1.65, 0.16);
    this.geometries.push(stringerUpperGeo);

    const stringerU1 = new THREE.Mesh(stringerUpperGeo, this.steelTowerMat);
    stringerU1.rotation.z = Math.PI / 4.4; // Reversed angle (switchback)
    stringerU1.position.set(2.78, 0.85, 0.72);

    const stringerU2 = new THREE.Mesh(stringerUpperGeo, this.steelTowerMat);
    stringerU2.rotation.z = Math.PI / 4.4;
    stringerU2.position.set(2.78, 0.85, 1.08);

    this.enclosureGroup.add(stringerU1, stringerU2);
    this.meshes.push(stringerU1, stringerU2);

    // 8 Individual Step Treads (Upper flight)
    for (let u = 0; u < 8; u++) {
      const stepU = new THREE.Mesh(stepGeo, this.concreteMat);
      stepU.position.set(2.78, 0.35 + u * 0.135, 1.25 - u * 0.075);
      this.enclosureGroup.add(stepU);
      this.meshes.push(stepU);
    }

    // Yellow Handrails along Lower Flight
    const stairRailGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.55, 12);
    this.geometries.push(stairRailGeo);
    const sRail = new THREE.Mesh(stairRailGeo, this.yellowOshaMat);
    sRail.rotation.z = -Math.PI / 4.4;
    sRail.position.set(2.05, -0.22, 1.55);
    this.enclosureGroup.add(sRail);
    this.meshes.push(sRail);

    // Yellow Handrails along Upper Flight
    const sRailU = new THREE.Mesh(stairRailGeo, this.yellowOshaMat);
    sRailU.rotation.z = Math.PI / 4.4;
    sRailU.position.set(2.78, 1.05, 0.7);
    this.enclosureGroup.add(sRailU);
    this.meshes.push(sRailU);

    // 2. Glazed Architectural Wind-screens (Flanking Tower Sides)
    const screenGeo = new THREE.BoxGeometry(0.02, 1.15, 0.85);
    this.geometries.push(screenGeo);

    // Front Screen Panel
    const screenFront = new THREE.Mesh(screenGeo, this.glassMat);
    screenFront.position.set(0.55, 1.45, 0.98);

    // Back Screen Panel
    const screenBack = new THREE.Mesh(screenGeo, this.glassMat);
    screenBack.position.set(0.55, 1.45, -0.98);

    this.enclosureGroup.add(screenFront, screenBack);
    this.meshes.push(screenFront, screenBack);
  }

  /**
   * Studio Ground Plane with Real ShadowMaterial + Soft Ambient Occlusion Disc
   * (Light-Architectural Alignment matching reference image infinite white studio floor)
   */
  private buildStudioGround(): { shadowPlane: THREE.Mesh; contactMesh: THREE.Mesh } {
    // 1. Dynamic Real Soft Shadow Receiver Plane
    const shadowGeo = new THREE.PlaneGeometry(16, 12);
    this.geometries.push(shadowGeo);
    const shadowMat = new THREE.ShadowMaterial({
      opacity: 0.25,
    });
    this.solidMaterials.push(shadowMat);

    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -3.05, 0);
    shadowPlane.receiveShadow = true;

    // 2. Ambient Occlusion Contact Shadow Map (Canvas radial gradient under columns)
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Soft localized contact shadows under column footings
    const drawDisc = (cx: number, cy: number, rx: number, ry: number, alpha: number) => {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      grad.addColorStop(0, `rgba(15, 23, 42, ${alpha})`);
      grad.addColorStop(0.45, `rgba(15, 23, 42, ${alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.translate(cx, cy);
      ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
      ctx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    // Concrete pier footings cluster contact shadow (under tower)
    drawDisc(680, 512, 220, 140, 0.45);
    // Cantilever conveyor tip contact shadow
    drawDisc(310, 512, 190, 85, 0.22);

    const texture = new THREE.CanvasTexture(canvas);
    this.textures.push(texture);

    const contactGeo = new THREE.PlaneGeometry(14, 9);
    this.geometries.push(contactGeo);
    const contactMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      opacity: 0.85,
    });
    this.solidMaterials.push(contactMat);

    const contactMesh = new THREE.Mesh(contactGeo, contactMat);
    contactMesh.rotation.x = -Math.PI / 2;
    contactMesh.position.set(-0.2, -3.04, 0);

    return { shadowPlane, contactMesh };
  }

  /* -------------------------------------------------------------
   * Shading Modes: Solid / X-Ray / CAD Wireframe
   * ----------------------------------------------------------- */
  public setViewMode(mode: AssemblyViewMode) {
    this.viewMode = mode;

    if (mode === 'cad') {
      // Architectural Technical Wireframe
      this.solidMaterials.forEach((m) => {
        (m as THREE.MeshStandardMaterial).wireframe = true;
      });
      this.blueArchMat.color.setHex(0x0284c7);
      this.redCableMat.color.setHex(0xef4444);
      this.concreteMat.color.setHex(0x0d9488); // Cyan/Teal vector lines for concrete
      this.steelTowerMat.color.setHex(0x38bdf8); // Sky blue vectors for steel frame
      this.steelTrussMat.color.setHex(0x38bdf8);
      this.pipingMat.color.setHex(0xeda81c); // Gold vectors for process piping
      (this.groundContactMesh.material as THREE.MeshBasicMaterial).opacity = 0.15;
    } else if (mode === 'xray') {
      // Translucent Structural Cutaway
      this.solidMaterials.forEach((m) => {
        (m as THREE.MeshStandardMaterial).wireframe = false;
      });
      this.concreteMat.transparent = true;
      this.concreteMat.opacity = 0.22;
      this.concreteMat.depthWrite = false;

      this.steelTowerMat.transparent = true;
      this.steelTowerMat.opacity = 0.45;
      this.steelTowerMat.depthWrite = false;

      this.steelTrussMat.transparent = true;
      this.steelTrussMat.opacity = 0.45;
      this.steelTrussMat.depthWrite = false;

      this.blueArchMat.transparent = true;
      this.blueArchMat.opacity = 0.5;

      this.redCableMat.opacity = 1.0;
      this.pipingMat.opacity = 1.0;
      this.siloMat.opacity = 0.85;

      (this.groundContactMesh.material as THREE.MeshBasicMaterial).opacity = 0.35;
    } else {
      // Full Solid PBR Realistic Architectural Finish
      this.solidMaterials.forEach((m) => {
        (m as THREE.MeshStandardMaterial).wireframe = false;
        m.transparent = false;
        m.opacity = 1.0;
        m.depthWrite = true;
      });

      this.concreteMat.color.setHex(0xdce2ea);
      this.concretePilesMat.color.setHex(0xc9d3de);
      this.steelTowerMat.color.setHex(0x242f3d);
      this.steelTrussMat.color.setHex(0x3d4b5c);
      this.blueArchMat.color.setHex(0x0284c7);
      this.redCableMat.color.setHex(0xef4444);
      this.yellowOshaMat.color.setHex(0xf59e0b);
      this.siloMat.color.setHex(0xf8fafc);
      this.pipingMat.color.setHex(0x94a3b8);
      this.roofSheetMat.color.setHex(0x8a99ad);

      this.glassMat.transparent = true;
      this.glassMat.opacity = 0.52;

      (this.groundContactMesh.material as THREE.MeshBasicMaterial).transparent = true;
      (this.groundContactMesh.material as THREE.MeshBasicMaterial).opacity = 0.85;
    }
  }

  public getViewMode(): AssemblyViewMode {
    return this.viewMode;
  }

  /* -------------------------------------------------------------
   * Interactive 360° Drag Orbit Control
   * ----------------------------------------------------------- */
  public startDrag(clientX: number, clientY: number) {
    this.isDragging = true;
    this.dragStart.x = clientX;
    this.dragStart.y = clientY;
  }

  public moveDrag(clientX: number, clientY: number) {
    if (!this.isDragging) return;
    const dx = clientX - this.dragStart.x;
    const dy = clientY - this.dragStart.y;

    this.orbitOffset.x += dx * 0.007;
    this.orbitOffset.y = THREE.MathUtils.clamp(
      this.orbitOffset.y + dy * 0.007,
      -0.55,
      0.55
    );

    this.dragStart.x = clientX;
    this.dragStart.y = clientY;
  }

  public endDrag() {
    this.isDragging = false;
  }

  /* -------------------------------------------------------------
   * 3D Hotspot Screen Coordinates Projection
   * ----------------------------------------------------------- */
  public getHotspots(): AssemblyHotspot[] {
    const isDesktop = !this.isMobile && window.innerWidth >= 768;
    const inRange = this.currentProgress > 0.05 && this.currentProgress < 0.74;
    const isHotspotsVisible = isDesktop && inRange;

    const projectObject = (obj: THREE.Object3D, offset = new THREE.Vector3()) => {
      obj.getWorldPosition(this.tempVec);
      this.tempVec.add(offset);
      this.tempVec.project(this.camera);
      return {
        x: (this.tempVec.x * 0.5 + 0.5) * 100,
        y: (-this.tempVec.y * 0.5 + 0.5) * 100,
        inFront: this.tempVec.z < 1,
      };
    };

    const p1 = projectObject(this.archGroup, new THREE.Vector3(-2.2, 1.4, 0));
    const p2 = projectObject(this.towerGroup, new THREE.Vector3(1.5, 1.6, 0.5));
    const p3 = projectObject(this.foundationGroup, new THREE.Vector3(1.5, -1.8, 0.8));

    return [
      {
        id: 'arch-gallery',
        title: 'Tied-Arch Conveyor Gallery',
        subtitle: 'Stacked Double Chords, Warren Truss & Inverted V-Hangers',
        tag: 'FEA LRFD DESIGN',
        metrics: ['STACKED BLUE ARCH', 'INVERTED V-HANGERS', 'WARREN TRUSS'],
        x: p1.x,
        y: p1.y,
        visible: isHotspotsVisible && p1.inFront,
      },
      {
        id: 'tower-process',
        title: 'Transfer Tower & Process Plant',
        subtitle: 'Structural Steel Skeleton with Gabled Roof & Cyclone Silo',
        tag: 'LOD 500 BIM',
        metrics: ['ASTM A572 STEEL', 'CLASH-FREE MEP', 'SWITCHBACK STAIRS'],
        x: p2.x,
        y: p2.y,
        visible: isHotspotsVisible && p2.inFront,
      },
      {
        id: 'concrete-substructure',
        title: 'Reinforced Deep Foundation',
        subtitle: '8-Pier Caisson Grid with Monolithic Pier Cap & Rebar Dowels',
        tag: 'HEAVY CIVIL C35/45',
        metrics: ['DEEP PILE CAISSONS', 'MOMENT VAULT', 'REBAR DOWELS'],
        x: p3.x,
        y: p3.y,
        visible: isHotspotsVisible && p3.inFront,
      },
    ];
  }

  /* -------------------------------------------------------------
   * Scrollytelling Choreography (Disassembly / Assembly Flow)
   * ----------------------------------------------------------- */
  public updateProgress(progress: number, isMobile: boolean) {
    this.targetProgress = Math.max(0, Math.min(1, progress));
    this.isMobile = isMobile;
  }

  public setPointer(normalizedX: number, normalizedY: number) {
    this.pointer.targetX = normalizedX * 0.08;
    this.pointer.targetY = normalizedY * 0.05;
  }

  private applyScrollLayout(p: number, isMobile: boolean) {
    const HERO_END = 0.085;

    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    // 1. Root Position & Lateral Hero Placement
    // Position model comfortably on the right half so it never overlaps the left editorial column!
    if (isMobile) {
      this.modelRoot.position.set(0.1, -1.05, 0);
      this.modelRoot.scale.setScalar(0.44);
    } else {
      const heroPhase = smoothstep(0, HERO_END, p);
      const posX = THREE.MathUtils.lerp(1.36, 1.44, heroPhase);
      const posY = THREE.MathUtils.lerp(-0.02, -0.04, heroPhase);
      const scale = THREE.MathUtils.lerp(0.65, 0.67, heroPhase) * (1 + p * 0.02);

      this.modelRoot.position.set(posX, posY, 0);
      this.modelRoot.scale.setScalar(scale);
    }

    // 2. Exploded Disassembly Across Chapters (0.085 to 0.74)
    let explodeFactor = 0;
    if (p < HERO_END) {
      explodeFactor = 0;
    } else if (p >= HERO_END && p < 0.74) {
      explodeFactor = smoothstep(HERO_END, 0.58, p);
    } else {
      // Snap-back reassembly for CTA (0.74 to 1.0)
      const reassemblePhase = smoothstep(0.74, 0.92, p);
      explodeFactor = 1 - reassemblePhase;
    }

    const damp = (isMobile ? 0.55 : 1.0) * explodeFactor;

    // --- Exploded Component Displacements ---
    // Twin Blue Arch lifts upward and tilts slightly
    this.archGroup.position.y = damp * 0.92;
    this.archGroup.position.z = damp * 0.18;

    // Conveyor gallery deck slides gently along its span
    this.deckGroup.position.x = -damp * 0.22;

    // Under-deck truss girder slides downward to reveal open-web framing
    this.trussGirderGroup.position.y = -damp * 0.35;
    this.trussGirderGroup.position.x = -damp * 0.22;

    // Process silo & MEP piping lift out of the steel tower
    this.processGroup.position.y = damp * 0.85;
    this.processGroup.position.x = damp * 0.22;

    // Tower canopy roof truss lifts vertically
    this.towerGroup.position.y = damp * 0.28;

    // Concrete substructure slides slightly downward to reveal foundation anchor
    this.foundationGroup.position.y = -damp * 0.42;

    // Shadow plane tracking
    this.shadowPlane.position.x = this.modelRoot.position.x - 0.2;
    this.groundContactMesh.position.x = this.modelRoot.position.x - 0.2;

    // Isometric rotation angle strictly matching reference blueprint:
    // Conveyor projects towards the front-left, Tower in upper-right, switchback stairs fully visible!
    const baseRotationY = (isMobile ? -0.52 : -0.62) + p * 0.32;
    const baseRotationX = (isMobile ? 0.35 : 0.38) + Math.sin(p * Math.PI) * 0.03;

    // Add pointer parallax and user drag orbit
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.08;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.08;

    this.modelRoot.rotation.y = baseRotationY + this.pointer.x + this.orbitOffset.x;
    this.modelRoot.rotation.x = baseRotationX - this.pointer.y + this.orbitOffset.y;
    this.modelRoot.rotation.z = -0.01;
  }

  /* -------------------------------------------------------------
   * Animation & Render Loop
   * ----------------------------------------------------------- */
  private tick = () => {
    if (!this.isRunning) return;

    // Lerp target scroll progress
    this.currentProgress += (this.targetProgress - this.currentProgress) * 0.12;

    // Spring damping for 360 drag orbit return
    if (!this.isDragging) {
      this.orbitOffset.x *= 0.94;
      this.orbitOffset.y *= 0.94;
    }

    // Apply scroll layout & transforms
    this.applyScrollLayout(this.currentProgress, this.isMobile);

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.tick);
  };

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.rafId = requestAnimationFrame(this.tick);
  }

  public pause() {
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
  }

  public resize() {
    const width = this.canvas.clientWidth;
    const height = Math.max(this.canvas.clientHeight, 1);
    this.isMobile = width < 768;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const dpr = Math.min(window.devicePixelRatio || 1, this.isMobile ? 1.5 : 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
  }

  /* -------------------------------------------------------------
   * Clean Disposal
   * ----------------------------------------------------------- */
  public dispose() {
    this.pause();

    this.geometries.forEach((g) => g.dispose());
    this.solidMaterials.forEach((m) => m.dispose());
    this.textures.forEach((t) => t.dispose());

    this.scene.clear();
    this.renderer.dispose();
  }
}
