import { useRef, useMemo, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─────────────────────────────────────────────
// ADVANCED REALISTIC SATELLITE — ISS-inspired wireframe
//
// Peningkatan dari versi sebelumnya:
//   • Badan utama lebih panjang & berdetail (cylindrical modules)
//   • Truss structure (ITS - Integrated Truss Structure)
//   • Semua solar panel = murni wireframe (LineSegments)
//   • Radiator panels wireframe
//   • RCS thruster pods di setiap junction
//   • Dish antenna lebih realistis (parabola spokes + feed horn)
//   • Docking nodes di depan & belakang
//   • Garis wireframe lebih jelas: opacity tinggi, tidak terputus
// ─────────────────────────────────────────────

// ── Helper: panel grid wireframe (full wireframe, tanpa fill) ──
const makePanelGrid = (
    w: number, h: number, cols: number, rows: number, depth = 0
): THREE.BufferGeometry => {
    const pts: THREE.Vector3[] = [];
    const hw = w / 2, hh = h / 2;

    // Outer border
    pts.push(
        new THREE.Vector3(-hw, -hh, depth), new THREE.Vector3(hw, -hh, depth),
        new THREE.Vector3(hw, -hh, depth), new THREE.Vector3(hw, hh, depth),
        new THREE.Vector3(hw, hh, depth), new THREE.Vector3(-hw, hh, depth),
        new THREE.Vector3(-hw, hh, depth), new THREE.Vector3(-hw, -hh, depth),
    );
    // Internal vertical
    for (let c = 1; c < cols; c++) {
        const x = -hw + (w / cols) * c;
        pts.push(new THREE.Vector3(x, -hh, depth), new THREE.Vector3(x, hh, depth));
    }
    // Internal horizontal
    for (let r = 1; r < rows; r++) {
        const y = -hh + (h / rows) * r;
        pts.push(new THREE.Vector3(-hw, y, depth), new THREE.Vector3(hw, y, depth));
    }
    // Diagonal per cell (solar cell pattern)
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const x0 = -hw + (w / cols) * c, y0 = -hh + (h / rows) * r;
            const x1 = -hw + (w / cols) * (c + 1), y1 = -hh + (h / rows) * (r + 1);
            pts.push(new THREE.Vector3(x0, y0, depth), new THREE.Vector3(x1, y1, depth));
        }
    }
    // Double border (inner border for realism)
    const inset = 0.04;
    pts.push(
        new THREE.Vector3(-hw + inset, -hh + inset, depth), new THREE.Vector3(hw - inset, -hh + inset, depth),
        new THREE.Vector3(hw - inset, -hh + inset, depth), new THREE.Vector3(hw - inset, hh - inset, depth),
        new THREE.Vector3(hw - inset, hh - inset, depth), new THREE.Vector3(-hw + inset, hh - inset, depth),
        new THREE.Vector3(-hw + inset, hh - inset, depth), new THREE.Vector3(-hw + inset, -hh + inset, depth),
    );
    return new THREE.BufferGeometry().setFromPoints(pts);
};

// ── Helper: 3D depth box wireframe (panel dengan ketebalan) ──
const makePanelBox = (w: number, h: number, d: number): THREE.BufferGeometry => {
    const hw = w / 2, hh = h / 2, hd = d / 2;
    const pts: THREE.Vector3[] = [];
    // Front face
    pts.push(
        new THREE.Vector3(-hw, -hh, hd), new THREE.Vector3(hw, -hh, hd),
        new THREE.Vector3(hw, -hh, hd), new THREE.Vector3(hw, hh, hd),
        new THREE.Vector3(hw, hh, hd), new THREE.Vector3(-hw, hh, hd),
        new THREE.Vector3(-hw, hh, hd), new THREE.Vector3(-hw, -hh, hd),
    );
    // Back face
    pts.push(
        new THREE.Vector3(-hw, -hh, -hd), new THREE.Vector3(hw, -hh, -hd),
        new THREE.Vector3(hw, -hh, -hd), new THREE.Vector3(hw, hh, -hd),
        new THREE.Vector3(hw, hh, -hd), new THREE.Vector3(-hw, hh, -hd),
        new THREE.Vector3(-hw, hh, -hd), new THREE.Vector3(-hw, -hh, -hd),
    );
    // Connecting edges
    pts.push(
        new THREE.Vector3(-hw, -hh, hd), new THREE.Vector3(-hw, -hh, -hd),
        new THREE.Vector3(hw, -hh, hd), new THREE.Vector3(hw, -hh, -hd),
        new THREE.Vector3(hw, hh, hd), new THREE.Vector3(hw, hh, -hd),
        new THREE.Vector3(-hw, hh, hd), new THREE.Vector3(-hw, hh, -hd),
    );
    return new THREE.BufferGeometry().setFromPoints(pts);
};

// ── Helper: dish parabola spokes + rings + feed ──
const makeDishDetailed = (r: number, spokeCnt: number): THREE.BufferGeometry => {
    const pts: THREE.Vector3[] = [];
    // Spokes from center to rim
    for (let i = 0; i < spokeCnt; i++) {
        const a = (i / spokeCnt) * Math.PI * 2;
        pts.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), 0));
    }
    // 4 concentric rings
    for (let ring = 1; ring <= 4; ring++) {
        const rr = r * (ring / 4);
        const segs = 36;
        for (let i = 0; i < segs; i++) {
            const a0 = (i / segs) * Math.PI * 2;
            const a1 = ((i + 1) / segs) * Math.PI * 2;
            pts.push(
                new THREE.Vector3(rr * Math.cos(a0), rr * Math.sin(a0), 0),
                new THREE.Vector3(rr * Math.cos(a1), rr * Math.sin(a1), 0),
            );
        }
    }
    // Feed horn (center post + small cross)
    pts.push(
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -0.22),
        new THREE.Vector3(-0.06, 0, -0.22), new THREE.Vector3(0.06, 0, -0.22),
        new THREE.Vector3(0, -0.06, -0.22), new THREE.Vector3(0, 0.06, -0.22),
    );
    return new THREE.BufferGeometry().setFromPoints(pts);
};

// ── Helper: truss segment (box frame lattice) ──
const makeTrussSegment = (length: number, width: number): THREE.BufferGeometry => {
    const pts: THREE.Vector3[] = [];
    const hw = width / 2;
    const corners = [
        [-hw, -hw], [hw, -hw], [hw, hw], [-hw, hw],
    ] as [number, number][];

    // Longitudinal rails
    for (const [cx, cy] of corners) {
        pts.push(
            new THREE.Vector3(cx, cy, -length / 2),
            new THREE.Vector3(cx, cy, length / 2),
        );
    }
    // Cross-sections at each end and middle
    for (const z of [-length / 2, 0, length / 2]) {
        for (let i = 0; i < 4; i++) {
            const [x0, y0] = corners[i];
            const [x1, y1] = corners[(i + 1) % 4];
            pts.push(new THREE.Vector3(x0, y0, z), new THREE.Vector3(x1, y1, z));
        }
    }
    // Diagonal braces on each face
    const faces = [
        [0, 1], [1, 2], [2, 3], [3, 0],
    ] as [number, number][];
    for (const [a, b] of faces) {
        const [ax, ay] = corners[a];
        const [bx, by] = corners[b];
        pts.push(
            new THREE.Vector3(ax, ay, -length / 2), new THREE.Vector3(bx, by, length / 2),
        );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
};

// ── Helper: cylinder wireframe (edges only, no mesh) ──
const makeCylWireframe = (r: number, h: number, segs: number, rings: number): THREE.BufferGeometry => {
    const pts: THREE.Vector3[] = [];
    const hh = h / 2;

    // Top & bottom circles
    for (const y of [-hh, hh]) {
        for (let i = 0; i < segs; i++) {
            const a0 = (i / segs) * Math.PI * 2;
            const a1 = ((i + 1) / segs) * Math.PI * 2;
            pts.push(
                new THREE.Vector3(r * Math.cos(a0), y, r * Math.sin(a0)),
                new THREE.Vector3(r * Math.cos(a1), y, r * Math.sin(a1)),
            );
        }
    }
    // Vertical lines
    for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(
            new THREE.Vector3(r * Math.cos(a), -hh, r * Math.sin(a)),
            new THREE.Vector3(r * Math.cos(a), hh, r * Math.sin(a)),
        );
    }
    // Ring lines
    for (let ring = 1; ring < rings; ring++) {
        const y = -hh + (h / rings) * ring;
        for (let i = 0; i < segs; i++) {
            const a0 = (i / segs) * Math.PI * 2;
            const a1 = ((i + 1) / segs) * Math.PI * 2;
            pts.push(
                new THREE.Vector3(r * Math.cos(a0), y, r * Math.sin(a0)),
                new THREE.Vector3(r * Math.cos(a1), y, r * Math.sin(a1)),
            );
        }
    }
    // Diagonal cross-bracing for structural modules, kept clean for clear prototype visibility
    if (r >= 0.2) {
        for (let ring = 0; ring < rings; ring++) {
            const y0 = -hh + (h / rings) * ring;
            const y1 = -hh + (h / rings) * (ring + 1);
            // Skip every other segment to reduce visual noise and preserve clean wireframe aesthetics
            for (let i = 0; i < segs; i += 2) {
                const a0 = (i / segs) * Math.PI * 2;
                const a1 = ((i + 1) / segs) * Math.PI * 2;
                // / diagonal
                pts.push(
                    new THREE.Vector3(r * Math.cos(a0), y0, r * Math.sin(a0)),
                    new THREE.Vector3(r * Math.cos(a1), y1, r * Math.sin(a1)),
                );
                // \ diagonal (cross)
                pts.push(
                    new THREE.Vector3(r * Math.cos(a1), y0, r * Math.sin(a1)),
                    new THREE.Vector3(r * Math.cos(a0), y1, r * Math.sin(a0)),
                );
            }
        }
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
};

// ── Helper: cone wireframe ──
const makeConeWireframe = (r: number, h: number, segs: number): THREE.BufferGeometry => {
    const pts: THREE.Vector3[] = [];
    // Base circle
    for (let i = 0; i < segs; i++) {
        const a0 = (i / segs) * Math.PI * 2;
        const a1 = ((i + 1) / segs) * Math.PI * 2;
        pts.push(
            new THREE.Vector3(r * Math.cos(a0), 0, r * Math.sin(a0)),
            new THREE.Vector3(r * Math.cos(a1), 0, r * Math.sin(a1)),
        );
    }
    // Apex lines
    for (let i = 0; i < segs; i += 2) {
        const a = (i / segs) * Math.PI * 2;
        pts.push(
            new THREE.Vector3(r * Math.cos(a), 0, r * Math.sin(a)),
            new THREE.Vector3(0, h, 0),
        );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
};

// ─────────────────────────────────────────────
// ADVANCED SATELLITE COMPONENT
// ─────────────────────────────────────────────
const AdvancedSatellite = () => {
    const groupRef = useRef<THREE.Group>(null);
    const { gl, clock } = useThree();
    const canvasEl = useRef(gl.domElement);
    const inView = useInView(canvasEl);

    // ── Materials ── CYAN COLOR SCHEME ─────────
    // Primary wireframe — bright cyan, crisp
    const wBright = useMemo(() => new THREE.LineBasicMaterial({
        color: '#00e5ff', opacity: 1.0, transparent: true,
    }), []);
    // Secondary wireframe — medium cyan for depth
    const wMid = useMemo(() => new THREE.LineBasicMaterial({
        color: '#00bcd4', opacity: 0.85, transparent: true,
    }), []);
    // Tertiary — dim cyan detail elements
    const wDim = useMemo(() => new THREE.LineBasicMaterial({
        color: '#0097a7', opacity: 0.70, transparent: true,
    }), []);
    // Solar panels — cyan tones
    const wSolar = useMemo(() => new THREE.LineBasicMaterial({
        color: '#00e5ff', opacity: 1.0, transparent: true,
    }), []);
    const wSolarDim = useMemo(() => new THREE.LineBasicMaterial({
        color: '#00bcd4', opacity: 0.82, transparent: true,
    }), []);
    // Extra fine wireframe for hull detail
    const wUltraFine = useMemo(() => new THREE.LineBasicMaterial({
        color: '#006064', opacity: 0.60, transparent: true,
    }), []);
    // Accent dots — keep orange for contrast
    const dotOrange = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#F26522', opacity: 1.0, transparent: true,
    }), []);
    // Cyan glow dots (replace white dots)
    const dotCyan = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#00e5ff', opacity: 0.95, transparent: true,
    }), []);
    // Fill (dark teal, for depth cue)
    const fillMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#001a1a', opacity: 0.10, transparent: true, side: THREE.DoubleSide,
    }), []);
    // Emissive glow mesh for body highlights
    const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#00e5ff', opacity: 0.04, transparent: true, side: THREE.DoubleSide,
    }), []);

    // ── Geometries ─────────────────────────────
    // Main body modules (wireframe) - balanced density for clear visual
    const mainBodyWire = useMemo(() => makeCylWireframe(0.44, 2.0, 24, 8), []);
    const fwdModuleWire = useMemo(() => makeCylWireframe(0.34, 0.75, 18, 5), []);
    const aftModuleWire = useMemo(() => makeCylWireframe(0.40, 1.0, 20, 6), []);
    const nodeModuleWire = useMemo(() => makeCylWireframe(0.28, 0.45, 16, 4), []);

    // Docking / cone
    const dockConeWire = useMemo(() => makeConeWireframe(0.25, 0.38, 20), []);
    const dockPortWire = useMemo(() => makeCylWireframe(0.09, 0.28, 16, 4), []);

    // Truss structure
    const trussMainGeo = useMemo(() => makeTrussSegment(0.7, 0.22), []);
    const trussSmallGeo = useMemo(() => makeTrussSegment(0.4, 0.14), []);

    // Dish
    const dishGeo = useMemo(() => makeDishDetailed(0.58, 10), []);
    const dishRimGeo = useMemo(() => new THREE.TorusGeometry(0.58, 0.005, 4, 40), []);

    // Mast
    const mastWire = useMemo(() => makeCylWireframe(0.018, 1.1, 12, 6), []);
    const crossbarWire = useMemo(() => makeCylWireframe(0.012, 0.6, 12, 4), []);

    // Connector arms
    const connArmWire = useMemo(() => makeCylWireframe(0.022, 0.5, 12, 6), []);
    const longConnWire = useMemo(() => makeCylWireframe(0.018, 0.8, 12, 6), []);

    // Thrusters
    const thrusterWire = useMemo(() => makeCylWireframe(0.07, 0.2, 16, 5), []);

    // RCS pod (small box)
    const rcsGeo = useMemo(() => makePanelBox(0.1, 0.06, 0.08), []);

    // Ring separators
    const ringGeo = useMemo(() => new THREE.TorusGeometry(0.46, 0.005, 4, 36), []);
    const bigRingGeo = useMemo(() => new THREE.TorusGeometry(0.50, 0.006, 4, 40), []);

    // Octahedron tips
    const tipGeo = useMemo(() => new THREE.OctahedronGeometry(0.052, 0), []);
    const smallTipGeo = useMemo(() => new THREE.OctahedronGeometry(0.032, 0), []);

    // Radiator panel (flat rectangle wireframe)
    const radiatorGeo = useMemo(() => makePanelBox(0.95, 0.38, 0.02), []);

    // Solar panel grids (wireframe)
    const panelLargeGeo = useMemo(() => makePanelGrid(1.6, 0.76, 5, 4), []);
    const panelMedGeo = useMemo(() => makePanelGrid(1.15, 0.55, 4, 3), []);
    const panelBoxLarge = useMemo(() => makePanelBox(1.6, 0.76, 0.03), []);
    const panelBoxMed = useMemo(() => makePanelBox(1.15, 0.55, 0.025), []);

    // ── Animation ──────────────────────────────
    useFrame((state, delta) => {
        if (!groupRef.current || !inView) return;
        const t = clock.getElapsedTime();
        const tx = (state.pointer.y * Math.PI) / 8;
        const ty = (state.pointer.x * Math.PI) / 8;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x, tx, 0.035
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y, ty + t * 0.065, 0.035
        );
    });

    // ── Solar Panel component (100% wireframe) ──
    const SolarPanel = ({
        pos, rot, gridGeo, boxGeo, large = true,
    }: {
        pos: [number, number, number];
        rot?: [number, number, number];
        gridGeo: THREE.BufferGeometry;
        boxGeo: THREE.BufferGeometry;
        large?: boolean;
    }) => (
        <group position={pos} rotation={rot}>
            {/* 3D box outline */}
            <lineSegments geometry={boxGeo}>
                <primitive object={wSolarDim} attach="material" />
            </lineSegments>
            {/* Solar cell grid front face */}
            <lineSegments geometry={gridGeo}>
                <primitive object={wSolar} attach="material" />
            </lineSegments>
            {/* Mirror grid on back face (offset slightly) */}
            <group rotation={[0, Math.PI, 0]}>
                <lineSegments geometry={gridGeo}>
                    <primitive object={wSolarDim} attach="material" />
                </lineSegments>
            </group>
        </group>
    );

    // ── RCS Thruster Pod ──
    const RCSPod = ({ pos }: { pos: [number, number, number] }) => (
        <group position={pos}>
            <lineSegments geometry={rcsGeo}>
                <primitive object={wDim} attach="material" />
            </lineSegments>
        </group>
    );

    return (
        <group ref={groupRef} rotation={[0.18, 0.5, 0.1]} scale={1.15} position={[-0.35, 0, 0]}>

            {/* ══════════════════════════════════════
                MAIN BODY — cylindrical pressure vessel
            ══════════════════════════════════════ */}
            {/* Main body fill (for depth cue only) */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.44, 0.44, 2.0, 16]} />
                <primitive object={fillMat} attach="material" />
            </mesh>
            {/* Main body wireframe */}
            <lineSegments geometry={mainBodyWire} rotation={[Math.PI / 2, 0, 0]}>
                <primitive object={wBright} attach="material" />
            </lineSegments>

            {/* Ring separators */}
            {[-0.75, -0.25, 0.25, 0.75].map((z, i) => (
                <mesh key={i} geometry={ringGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
                    <primitive object={wMid} attach="material" />
                </mesh>
            ))}

            {/* End caps: big rings */}
            {[-1.0, 1.0].map((z, i) => (
                <mesh key={i} geometry={bigRingGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z]}>
                    <primitive object={wBright} attach="material" />
                </mesh>
            ))}

            {/* ══════════════════════════════════════
                FORWARD MODULE (Pressurized Mating Adapter)
            ══════════════════════════════════════ */}
            <group position={[0, 0, -1.42]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.34, 0.44, 0.75, 12]} />
                    <primitive object={fillMat} attach="material" />
                </mesh>
                <lineSegments geometry={fwdModuleWire} rotation={[Math.PI / 2, 0, 0]}>
                    <primitive object={wBright} attach="material" />
                </lineSegments>

                {/* Docking cone */}
                <group position={[0, 0, -0.56]} rotation={[-Math.PI / 2, 0, 0]}>
                    <lineSegments geometry={dockConeWire}>
                        <primitive object={wMid} attach="material" />
                    </lineSegments>
                </group>
                {/* Docking port cylinder */}
                <lineSegments geometry={dockPortWire} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.82]}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
                {/* Docking port tip */}
                <mesh geometry={tipGeo} position={[0, 0, -0.98]}>
                    <primitive object={dotCyan} attach="material" />
                </mesh>

                {/* Node module side port */}
                <lineSegments geometry={nodeModuleWire} rotation={[0, 0, 0]} position={[0.48, 0.18, -0.1]}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>

                {/* RCS pods */}
                <RCSPod pos={[0.3, 0.3, 0]} />
                <RCSPod pos={[-0.3, 0.3, 0]} />
                <RCSPod pos={[0.3, -0.3, 0]} />
                <RCSPod pos={[-0.3, -0.3, 0]} />
            </group>

            {/* ══════════════════════════════════════
                AFT MODULE (Service Module)
            ══════════════════════════════════════ */}
            <group position={[0, 0, 1.55]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.40, 0.40, 1.0, 12]} />
                    <primitive object={fillMat} attach="material" />
                </mesh>
                <lineSegments geometry={aftModuleWire} rotation={[Math.PI / 2, 0, 0]}>
                    <primitive object={wBright} attach="material" />
                </lineSegments>

                {/* Ring on aft */}
                <mesh geometry={ringGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.3]}>
                    <primitive object={wMid} attach="material" />
                </mesh>

                {/* Thruster cluster — 4 at stern */}
                {([[0.2, 0.2], [-0.2, 0.2], [0.2, -0.2], [-0.2, -0.2]] as [number, number][]).map(([tx, ty], i) => (
                    <group key={i} position={[tx, ty, 0.62]}>
                        <lineSegments geometry={thrusterWire} rotation={[Math.PI / 2, 0, 0]}>
                            <primitive object={wMid} attach="material" />
                        </lineSegments>
                        <mesh geometry={smallTipGeo} position={[0, 0, 0.14]}>
                            <primitive object={dotOrange} attach="material" />
                        </mesh>
                    </group>
                ))}

                {/* Side protrusion (Zarya-style fuel pod) */}
                <lineSegments geometry={nodeModuleWire} rotation={[0, 0, Math.PI / 2]} position={[0.6, 0.22, -0.1]}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>
                <lineSegments geometry={nodeModuleWire} rotation={[0, 0, Math.PI / 2]} position={[-0.6, 0.22, -0.1]}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>

                {/* Aft thruster ring */}
                <mesh geometry={bigRingGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
                    <primitive object={wBright} attach="material" />
                </mesh>
            </group>

            {/* ══════════════════════════════════════
                INTEGRATED TRUSS STRUCTURE (ITS)
                — horizontal spine connecting solar arrays
            ══════════════════════════════════════ */}
            {/* Left truss arm */}
            <group position={[-0.8, 0.35, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={trussMainGeo}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
            </group>
            <group position={[-1.5, 0.35, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={trussMainGeo}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
            </group>
            {/* Right truss arm */}
            <group position={[0.8, 0.35, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={trussMainGeo}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
            </group>
            <group position={[1.5, 0.35, -0.2]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={trussMainGeo}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
            </group>
            {/* Truss junction nodes */}
            {[-2.1, -1.1, 1.1, 2.1].map((x, i) => (
                <mesh key={i} geometry={tipGeo} position={[x, 0.35, -0.2]}>
                    <primitive object={dotCyan} attach="material" />
                </mesh>
            ))}

            {/* ══════════════════════════════════════
                RADIATOR PANELS (small, below truss)
            ══════════════════════════════════════ */}
            <group position={[-1.3, -0.1, -0.2]} rotation={[Math.PI / 8, 0, 0]}>
                <lineSegments geometry={radiatorGeo}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>
            </group>
            <group position={[1.3, -0.1, -0.2]} rotation={[-Math.PI / 8, 0, 0]}>
                <lineSegments geometry={radiatorGeo}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>
            </group>

            {/* ══════════════════════════════════════
                DISH ANTENNA
            ══════════════════════════════════════ */}
            <group position={[0.78, -0.58, 0.65]} rotation={[0.45, -0.35, 0.18]}>
                {/* Dish rim (torus) */}
                <mesh geometry={dishRimGeo}>
                    <primitive object={wBright} attach="material" />
                </mesh>
                {/* Spokes + rings + feed horn */}
                <lineSegments geometry={dishGeo}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
                {/* Mount cylinder */}
                <lineSegments geometry={connArmWire} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.22]}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
                {/* Center dot */}
                <mesh geometry={tipGeo} scale={0.75}>
                    <primitive object={dotOrange} attach="material" />
                </mesh>
            </group>

            {/* ══════════════════════════════════════
                SECOND SMALL DISH (omni antenna)
            ══════════════════════════════════════ */}
            <group position={[-0.65, -0.42, -0.5]} rotation={[-0.5, 0.4, -0.2]}>
                <mesh geometry={new THREE.TorusGeometry(0.28, 0.004, 4, 28)}>
                    <primitive object={wMid} attach="material" />
                </mesh>
                <lineSegments geometry={makeDishDetailed(0.28, 6)}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>
                <lineSegments geometry={connArmWire} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.14]}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>
            </group>

            {/* ══════════════════════════════════════
                TOP MAST & ANTENNA
            ══════════════════════════════════════ */}
            <group position={[0, 0.54, -0.28]}>
                <lineSegments geometry={mastWire}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
                {/* Crossbar */}
                <group position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <lineSegments geometry={crossbarWire}>
                        <primitive object={wMid} attach="material" />
                    </lineSegments>
                </group>
                {/* Crossbar secondary */}
                <group position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                    <lineSegments geometry={trussSmallGeo}>
                        <primitive object={wDim} attach="material" />
                    </lineSegments>
                </group>
                {/* Tips */}
                {[[-0.3, 0.5, 0], [0.3, 0.5, 0]].map((p, i) => (
                    <mesh key={i} geometry={tipGeo} position={p as [number, number, number]}>
                        <primitive object={dotOrange} attach="material" />
                    </mesh>
                ))}
                {/* Mast apex */}
                <mesh geometry={tipGeo} position={[0, 0.58, 0]}>
                    <primitive object={dotCyan} attach="material" />
                </mesh>
            </group>

            {/* ══════════════════════════════════════
                SOLAR PANELS — PAIR 1 (main, large)
                Mounted on truss, left & right
            ══════════════════════════════════════ */}

            {/* LEFT connector arm */}
            <group position={[-1.1, 0.35, -0.55]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={longConnWire}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
            </group>

            {/* LEFT panels (2 per wing, tandem) */}
            <SolarPanel
                pos={[-2.1, 0.35, -0.55]}
                gridGeo={panelLargeGeo}
                boxGeo={panelBoxLarge}
                large={true}
            />
            <SolarPanel
                pos={[-2.1, 0.35, 0.32]}
                rot={[0, 0.03, 0]}
                gridGeo={panelLargeGeo}
                boxGeo={panelBoxLarge}
                large={true}
            />

            {/* RIGHT connector arm */}
            <group position={[1.1, 0.35, -0.55]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={longConnWire}>
                    <primitive object={wMid} attach="material" />
                </lineSegments>
            </group>

            {/* RIGHT panels */}
            <SolarPanel
                pos={[2.1, 0.35, -0.55]}
                gridGeo={panelLargeGeo}
                boxGeo={panelBoxLarge}
                large={true}
            />
            <SolarPanel
                pos={[2.1, 0.35, 0.32]}
                rot={[0, -0.03, 0]}
                gridGeo={panelLargeGeo}
                boxGeo={panelBoxLarge}
                large={true}
            />

            {/* ══════════════════════════════════════
                SOLAR PANELS — PAIR 2 (secondary, medium)
                Angled downward from aft module
            ══════════════════════════════════════ */}

            {/* Left secondary arm */}
            <group position={[-0.9, -0.28, 0.75]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={connArmWire}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>
            </group>
            <SolarPanel
                pos={[-1.72, -0.28, 0.75]}
                rot={[0.05, 0, 0]}
                gridGeo={panelMedGeo}
                boxGeo={panelBoxMed}
                large={false}
            />

            {/* Right secondary arm */}
            <group position={[0.9, -0.28, 0.75]} rotation={[0, 0, Math.PI / 2]}>
                <lineSegments geometry={connArmWire}>
                    <primitive object={wDim} attach="material" />
                </lineSegments>
            </group>
            <SolarPanel
                pos={[1.72, -0.28, 0.75]}
                rot={[-0.05, 0, 0]}
                gridGeo={panelMedGeo}
                boxGeo={panelBoxMed}
                large={false}
            />

        </group>
    );
};

// ─────────────────────────────────────────────
// CLOUDINARY BACKGROUND VIDEO
// ─────────────────────────────────────────────
const VIDEO_PUBLIC_ID = 'jh12t0xdsqheie36vvq7';

const buildCloudinaryUrl = (cloudName: string, publicId: string, ext: 'webm' | 'mp4') => {
    const transforms = ext === 'webm'
        ? 'q_auto:low,w_1280,vc_vp9'
        : 'q_auto:low,w_1280,vc_h264';
    return `https://res.cloudinary.com/${cloudName}/video/upload/${transforms}/${publicId}.${ext}`;
};

const HeroVideo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '';

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const onCanPlay = () => { video.play().catch(() => { }); };
        video.addEventListener('canplay', onCanPlay);
        return () => video.removeEventListener('canplay', onCanPlay);
    }, []);

    if (!cloudName) return null;

    return (
        <video
            ref={videoRef}
            aria-hidden="true"
            muted
            loop
            playsInline
            preload="metadata"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        >
            <source src={buildCloudinaryUrl(cloudName, VIDEO_PUBLIC_ID, 'webm')} type="video/webm" />
            <source src={buildCloudinaryUrl(cloudName, VIDEO_PUBLIC_ID, 'mp4')} type="video/mp4" />
        </video>
    );
};

// ─────────────────────────────────────────────
// CHARACTER STAGGER ANIMATION
// ─────────────────────────────────────────────
const AnimatedLine = ({
    text, delay = 0, className = '', style = {},
}: {
    text: string; delay?: number; className?: string; style?: React.CSSProperties;
}) => (
    <span className={`block whitespace-nowrap ${className}`} style={style}>
        <span className="sr-only">{text}</span>
        <motion.span
            className="inline-flex"
            aria-hidden="true"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.025, delayChildren: delay } },
            }}
        >
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
                    variants={{
                        hidden: { opacity: 0, y: 16 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    </span>
);

// ─────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────
export const Hero = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
    const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const objScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
    const objOpacity = useTransform(scrollYProgress, [0, 0.95], [1, 0]);
    const objY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const sectionOpacity = useTransform(scrollYProgress, [0, 0.98], [1, 0]);

    return (
        <motion.section
            ref={containerRef}
            style={{ opacity: sectionOpacity }}
            className="h-[105vh] w-full text-white flex items-center relative overflow-hidden"
        >
            {/* a11y */}
            <a
                href="#services"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-[#F26522] focus:text-white focus:px-4 focus:py-2 focus:text-sm"
            >
                Skip to content
            </a>

            {/* ── Layer 0: Background video ── */}
            <HeroVideo />

            {/* ── Layer 1: Gradient edges ── */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background: [
                        'linear-gradient(to bottom,',
                        '  rgba(4,4,4,0.55) 0%,',
                        '  rgba(4,4,4,0.0)  12%,',
                        '  rgba(4,4,4,0.0)  85%,',
                        '  rgba(4,4,4,0.45) 100%',
                        ')',
                    ].join(''),
                    pointerEvents: 'none',
                }}
            />

            {/* ── Layer 2: Orange ambient glow ── */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    zIndex: 2,
                    top: '50%', left: 0,
                    width: '55vw', height: '55vw',
                    transform: 'translateY(-50%)',
                    background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            {/* ── Layer 10+: Grid ── */}
            <div
                className="w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 items-center h-full px-6 md:px-12 lg:px-20 relative"
                style={{ zIndex: 10 }}
            >
                {/* LEFT: 3D Satellite */}
                <motion.div
                    style={{ scale: objScale, opacity: objOpacity, y: objY }}
                    className="relative w-full h-[55vh] md:h-[90vh] pointer-events-auto"
                >
                    <Canvas
                        camera={{ position: [0, 0, 9], fov: 50 }}
                        style={{ background: 'transparent', width: '100%', height: '100%' }}
                        gl={{ antialias: true, alpha: true }}
                    >
                        <AdvancedSatellite />
                    </Canvas>
                </motion.div>

                {/* RIGHT: Text */}
                <motion.div
                    style={{ y: textY, opacity: textOpacity }}
                    className="flex flex-col justify-center md:pl-8 lg:pl-12 relative overflow-hidden"
                >
                    <AnimatedLine
                        text="ENGINEERING"
                        delay={0.3}
                        className="text-[9.5vw] md:text-[4.2vw] font-black leading-[0.92] tracking-[-0.02em] uppercase"
                        style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}
                    />
                    <AnimatedLine
                        text="THE DIGITAL &"
                        delay={0.45}
                        className="text-[7.5vw] md:text-[3.5vw] font-black leading-[0.92] tracking-[-0.02em] uppercase mt-1"
                        style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: '1.5px var(--brand-dim)' }}
                    />
                    <AnimatedLine
                        text="PHYSICAL"
                        delay={0.6}
                        className="text-[11.5vw] md:text-[5.2vw] font-black leading-[0.88] tracking-[-0.03em] uppercase"
                        style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: '1.5px var(--brand-dim)' }}
                    />
                    <AnimatedLine
                        text="FRONTIER"
                        delay={0.75}
                        className="text-[9.5vw] md:text-[4.2vw] font-black leading-[0.92] tracking-[-0.02em] uppercase mt-1"
                        style={{ fontFamily: 'var(--font-nero)', color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="flex items-center gap-4 mt-6"
                    >
                        <div className="h-[1px] w-8 shrink-0" style={{ background: 'var(--brand-dim)' }} />
                        <span className="text-[var(--label-sm)] font-mono tracking-[0.25em] uppercase whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            Design · Build · Scale
                        </span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                style={{ zIndex: 20 }}
            >
                <span className="text-[0.55rem] font-mono tracking-[0.3em] text-white/25 uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[1px] h-6 bg-gradient-to-b from-[#F26522]/60 to-transparent"
                />
            </motion.div>
        </motion.section>
    );
};