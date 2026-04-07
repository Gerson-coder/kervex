import * as THREE from 'three';

const CYAN = 0x00e5ff;
const PANEL = 0x0c1020;
const DARK = 0x050810;
const WIRE_DARK = 0x1a2040;

export class RobotScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private rafId = 0;
  private robot!: THREE.Group;
  private leftEye!: THREE.Mesh;
  private rightEye!: THREE.Mesh;
  private antennaTip!: THREE.Mesh;
  private disposed = false;
  private reducedMotion: boolean;

  constructor(private canvas: HTMLCanvasElement) {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(60, 72);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 60 / 72, 0.1, 100);
    this.camera.position.z = 5;

    this.buildRobot();

    if (this.reducedMotion) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.animate();
    }
  }

  private buildRobot(): void {
    this.robot = new THREE.Group();

    // Head
    const headGeo = new THREE.BoxGeometry(1.6, 1.1, 1);
    const headMat = new THREE.MeshBasicMaterial({ color: PANEL });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.9;
    this.robot.add(head);

    // Head wireframe overlay
    const headWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(headGeo),
      new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.3 }),
    );
    headWire.position.copy(head.position);
    this.robot.add(headWire);

    // Visor (screen on head)
    const visorGeo = new THREE.BoxGeometry(1.2, 0.5, 0.1);
    const visorMat = new THREE.MeshBasicMaterial({ color: DARK });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.95, 0.51);
    this.robot.add(visor);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: CYAN });

    this.leftEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
    this.leftEye.position.set(-0.3, 0.95, 0.55);
    this.robot.add(this.leftEye);

    this.rightEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
    this.rightEye.position.set(0.3, 0.95, 0.55);
    this.robot.add(this.rightEye);

    // Antenna stick
    const antennaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6);
    const antennaMat = new THREE.MeshBasicMaterial({ color: CYAN });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(0, 1.7, 0);
    this.robot.add(antenna);

    // Antenna tip
    const tipGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const tipMat = new THREE.MeshBasicMaterial({ color: CYAN });
    this.antennaTip = new THREE.Mesh(tipGeo, tipMat);
    this.antennaTip.position.set(0, 2.0, 0);
    this.robot.add(this.antennaTip);

    // Body
    const bodyGeo = new THREE.BoxGeometry(1.4, 1.4, 0.9);
    const bodyMat = new THREE.MeshBasicMaterial({ color: PANEL });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = -0.45;
    this.robot.add(body);

    // Body wireframe
    const bodyWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(bodyGeo),
      new THREE.LineBasicMaterial({ color: WIRE_DARK, transparent: true, opacity: 0.5 }),
    );
    bodyWire.position.copy(body.position);
    this.robot.add(bodyWire);

    // Body chest lights
    const chestColors = [0x00ff88, CYAN, 0xff0aff];
    for (let i = 0; i < 3; i++) {
      const dotGeo = new THREE.SphereGeometry(0.08, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({ color: chestColors[i] });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(-0.3 + i * 0.3, -0.35, 0.46);
      this.robot.add(dot);
    }

    // Left arm
    const armGeo = new THREE.CylinderGeometry(0.12, 0.1, 1, 6);
    const armMat = new THREE.MeshBasicMaterial({ color: PANEL });

    const leftArm = new THREE.Mesh(armGeo, armMat.clone());
    leftArm.position.set(-1.0, -0.4, 0);
    leftArm.rotation.z = 0.15;
    this.robot.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat.clone());
    rightArm.position.set(1.0, -0.4, 0);
    rightArm.rotation.z = -0.15;
    this.robot.add(rightArm);

    // Legs (short feet blocks)
    const legGeo = new THREE.BoxGeometry(0.4, 0.25, 0.5);
    const legMat = new THREE.MeshBasicMaterial({ color: WIRE_DARK });

    const leftLeg = new THREE.Mesh(legGeo, legMat.clone());
    leftLeg.position.set(-0.35, -1.3, 0);
    this.robot.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, legMat.clone());
    rightLeg.position.set(0.35, -1.3, 0);
    this.robot.add(rightLeg);

    this.robot.position.y = -0.3;
    this.scene.add(this.robot);
  }

  private animate(): void {
    if (this.disposed) return;

    this.rafId = requestAnimationFrame(() => this.animate());
    const t = performance.now() * 0.001;

    // Hover float
    this.robot.position.y = -0.3 + Math.sin(t * 1.2) * 0.15;

    // Slow Y rotation
    this.robot.rotation.y += 0.005;

    // Eye blink (opacity pulse)
    const eyeOpacity = 0.5 + Math.sin(t * 2) * 0.5;
    (this.leftEye.material as THREE.MeshBasicMaterial).opacity = eyeOpacity;
    (this.leftEye.material as THREE.MeshBasicMaterial).transparent = true;
    (this.rightEye.material as THREE.MeshBasicMaterial).opacity = eyeOpacity;
    (this.rightEye.material as THREE.MeshBasicMaterial).transparent = true;

    // Antenna pulse
    const scale = 1 + Math.sin(t * 3) * 0.3;
    this.antennaTip.scale.set(scale, scale, scale);

    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}
