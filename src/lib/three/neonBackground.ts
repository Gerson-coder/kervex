import * as THREE from 'three';

const CYAN = new THREE.Color(0x00e5ff);
const PINK = new THREE.Color(0xff0aff);
const GREEN = new THREE.Color(0x00ff88);

const CONNECTION_DISTANCE = 4;
const LERP_FACTOR = 0.03;
const ROTATION_SPEED = 0.0003;
const PARALLAX_STRENGTH = 0.15;

export class NeonBackground {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private group: THREE.Group;
  private particles!: THREE.Points;
  private connections!: THREE.LineSegments;
  private animationId: number = 0;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetMouseX: number = 0;
  private targetMouseY: number = 0;
  private particleCount: number;
  private positions: Float32Array = new Float32Array(0);
  private baseSizes: Float32Array = new Float32Array(0);

  private handleMouseMove: (e: MouseEvent) => void;
  private handleResize: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.particleCount = window.innerWidth < 768 ? 50 : 100;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.z = 15;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createParticles();
    this.createConnections();

    this.handleMouseMove = (e: MouseEvent) => {
      this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    this.handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    };

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);

    this.animate();
  }

  private createParticles(): void {
    const count = this.particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const r = Math.random();
      let color: THREE.Color;
      if (r < 0.6) {
        color = CYAN;
      } else if (r < 0.85) {
        color = PINK;
      } else {
        color = GREEN;
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 2 + Math.random() * 1.5;
    }

    this.positions = positions;
    this.baseSizes = sizes;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes.slice(), 1));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.group.add(this.particles);
  }

  private createConnections(): void {
    const count = this.particleCount;
    const linePositions: number[] = [];

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const i3 = i * 3;
        const j3 = j * 3;

        const dx = this.positions[i3] - this.positions[j3];
        const dy = this.positions[i3 + 1] - this.positions[j3 + 1];
        const dz = this.positions[i3 + 2] - this.positions[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          linePositions.push(
            this.positions[i3],
            this.positions[i3 + 1],
            this.positions[i3 + 2],
            this.positions[j3],
            this.positions[j3 + 1],
            this.positions[j3 + 2]
          );
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    const material = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.06,
      depthWrite: false,
    });

    this.connections = new THREE.LineSegments(geometry, material);
    this.group.add(this.connections);
  }

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    // Lerp mouse
    this.mouseX += (this.targetMouseX - this.mouseX) * LERP_FACTOR;
    this.mouseY += (this.targetMouseY - this.mouseY) * LERP_FACTOR;

    // Slow rotation
    this.group.rotation.y += ROTATION_SPEED;

    // Mouse parallax
    this.group.rotation.x = this.mouseY * PARALLAX_STRENGTH;
    this.group.rotation.y += this.mouseX * PARALLAX_STRENGTH * 0.01;

    // Pulse particle sizes
    const time = performance.now() * 0.001;
    const sizeAttr = this.particles.geometry.getAttribute('size') as THREE.BufferAttribute;
    const sizes = sizeAttr.array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      const pulse = Math.sin(time * 0.8 + i * 0.5) * 0.3 + 1;
      sizes[i] = this.baseSizes[i] * pulse;
    }
    sizeAttr.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);

    this.particles.geometry.dispose();
    (this.particles.material as THREE.PointsMaterial).dispose();
    this.connections.geometry.dispose();
    (this.connections.material as THREE.LineBasicMaterial).dispose();
    this.renderer.dispose();
  }
}
