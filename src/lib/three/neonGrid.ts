import * as THREE from 'three';

const CYAN = 0x00e5ff;
const PINK = 0xff0aff;
const GREEN = 0x00ff88;

interface DataLine {
  mesh: THREE.LineSegments;
  speed: number;
  resetY: number;
}

interface Particle {
  baseY: number;
  speed: number;
  offset: number;
}

export class NeonGrid {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private rafId = 0;
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };
  private grid!: THREE.Mesh;
  private particles!: THREE.Points;
  private particleData: Particle[] = [];
  private dataLines: DataLine[] = [];
  private reducedMotion: boolean;
  private isMobile: boolean;
  private disposed = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth < 768;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 15;

    this.createGrid();
    this.createParticles();
    if (!this.isMobile) {
      this.createDataLines();
    }

    this.onResize = this.onResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);

    if (this.reducedMotion) {
      this.renderer.render(this.scene, this.camera);
    } else {
      this.animate();
    }
  }

  private createGrid(): void {
    const geo = new THREE.PlaneGeometry(80, 80, 40, 40);
    const mat = new THREE.MeshBasicMaterial({
      color: CYAN,
      wireframe: true,
      transparent: true,
      opacity: 0.03,
    });
    this.grid = new THREE.Mesh(geo, mat);
    this.grid.rotation.x = -Math.PI / 4;
    this.grid.position.y = -5;
    this.scene.add(this.grid);
  }

  private createParticles(): void {
    const count = this.isMobile ? 30 : 60;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const cyan = new THREE.Color(CYAN);
    const pink = new THREE.Color(PINK);
    const green = new THREE.Color(GREEN);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const r = Math.random();
      const color = r < 0.6 ? cyan : r < 0.85 ? pink : green;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      this.particleData.push({
        baseY: positions[i3 + 1],
        speed: 0.3 + Math.random() * 0.7,
        offset: Math.random() * Math.PI * 2,
      });
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private createDataLines(): void {
    const lineCount = 15 + Math.floor(Math.random() * 6);

    for (let i = 0; i < lineCount; i++) {
      const x = (Math.random() - 0.5) * 40;
      const startY = Math.random() * 20 + 10;
      const length = 2 + Math.random() * 4;

      const positions = new Float32Array([x, startY, -5, x, startY - length, -5]);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.LineBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0.04,
      });

      const mesh = new THREE.LineSegments(geo, mat);
      this.scene.add(mesh);

      this.dataLines.push({
        mesh,
        speed: 0.02 + Math.random() * 0.06,
        resetY: startY,
      });
    }
  }

  private animate(): void {
    if (this.disposed) return;

    this.rafId = requestAnimationFrame(() => this.animate());
    const t = performance.now() * 0.001;

    // Grid movement
    this.grid.position.z = (t * 0.5) % 2;

    // Mouse parallax
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.02;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.02;
    this.camera.position.x = this.mouse.x * 2;
    this.camera.position.y = this.mouse.y * 1.5;
    this.camera.lookAt(0, 0, 0);

    // Particle floating
    const posAttr = this.particles.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < this.particleData.length; i++) {
      const p = this.particleData[i];
      posAttr.setY(i, p.baseY + Math.sin(t * p.speed + p.offset) * 1.5);
    }
    posAttr.needsUpdate = true;

    // Data lines falling
    for (const line of this.dataLines) {
      line.mesh.position.y -= line.speed;
      if (line.mesh.position.y < -20) {
        line.mesh.position.y = line.resetY;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);

    if (this.reducedMotion) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private onMouseMove(e: MouseEvent): void {
    this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);

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
