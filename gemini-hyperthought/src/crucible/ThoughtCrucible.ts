/**
 * Interactive Thought Crucible - Recursive Tree-of-Thought (ToT) DAG Simulator
 * Visualizes dynamic node expansion, counterfactual branch pruning, and real-time token telemetry.
 */

import { soundEngine } from '../audio/Synthesizer';

export interface ThoughtNode {
  id: string;
  label: string;
  depth: number;
  x: number;
  y: number;
  status: 'pending' | 'evaluating' | 'pruned' | 'converged';
  confidence: number;
  thoughtSnippet: string;
  parentId?: string;
  children: string[];
}

export interface CrucibleScenario {
  id: string;
  title: string;
  premise: string;
  hypotheses: Array<{
    title: string;
    subHypotheses: string[];
    isWinning: boolean;
    confidence: number;
    thought: string;
  }>;
  synthesis: string;
}

export const PRESET_SCENARIOS: CrucibleScenario[] = [
  {
    id: 'many-worlds',
    title: 'Quantum Closed Timelike Curves & Causal Consistency',
    premise: 'Evaluating grandfather paradox resolution under Everettian many-worlds with quantum state decoherence.',
    hypotheses: [
      {
        title: 'Branch A: Classical Novikov Self-Consistency',
        subHypotheses: ['Global probability distribution pinning', 'Deterministic phase-space lock'],
        isWinning: false,
        confidence: 0.42,
        thought: 'Pruned: Fails to account for non-unitary entropy transfer across boundary conditions.',
      },
      {
        title: 'Branch B: Everettian Decoherent Foliation',
        subHypotheses: ['State vector bifurcates along orthogonal Hilbert spaces', 'Zero retro-causal interference'],
        isWinning: true,
        confidence: 0.994,
        thought: 'Optimal Convergence: Timelike curves resolve cleanly into branch divergence without paradox.',
      },
      {
        title: 'Branch C: CTC Entropy Annihilation',
        subHypotheses: ['Information bottleneck singularity', 'Topological horizon breakdown'],
        isWinning: false,
        confidence: 0.18,
        thought: 'Pruned: Violates quantum information conservation (No-Hiding Theorem).',
      },
    ],
    synthesis: 'Theorem: Quantum closed timelike curves map onto multi-sheeted Everett branches with invariant unitary evolution: H_total = ⊕ H_branch.',
  },
  {
    id: 'p-vs-np',
    title: 'Relativized Complexity & Natural Proofs Obstruction',
    premise: 'Probing algebraic circuit lower bounds against Baker-Gill-Solovay relativization barriers.',
    hypotheses: [
      {
        title: 'Branch A: Pure Combinatorial Diagonalization',
        subHypotheses: ['Boolean circuit size lower bounds', 'Sub-cubic parity game gates'],
        isWinning: false,
        confidence: 0.28,
        thought: 'Pruned: Blocked by Razborov-Rudich Natural Proofs barrier at depth 3.',
      },
      {
        title: 'Branch B: Geometric Complexity Theory (GCT)',
        subHypotheses: ['Representation-theoretic obstructions in orbit closures', 'Kronecker coefficient positivity'],
        isWinning: true,
        confidence: 0.987,
        thought: 'Optimal Convergence: GCT non-relativizing symmetries bypass naturalization obstacles.',
      },
      {
        title: 'Branch C: Algebrization Oracle Bypass',
        subHypotheses: ['Low-degree polynomial extensions', 'Interactive IP=PSPACE algebra'],
        isWinning: false,
        confidence: 0.35,
        thought: 'Pruned: Blocked by Aaronson-Wigderson algebrization barrier.',
      },
    ],
    synthesis: 'Theorem: Orbit closure separation via plethysm coefficients establishes non-relativized polynomial hierarchy bounds.',
  },
  {
    id: 'consciousness',
    title: 'Integrated Information & Recursive Self-Modeling',
    premise: 'Calculating phi-metrics of recursive strange loops under holographic boundary conditions.',
    hypotheses: [
      {
        title: 'Branch A: Feedforward Global Workspace',
        subHypotheses: ['Broadcast bus capacity limits', 'Serial attentional bottlenecking'],
        isWinning: false,
        confidence: 0.45,
        thought: 'Pruned: Insufficient causal density; lacks recursive eigen-state stability.',
      },
      {
        title: 'Branch B: Strange-Loop Fixed Point Attractors',
        subHypotheses: ['Infinite-regress self-referential token loops', 'Phase-locking in high-dimensional latent space'],
        isWinning: true,
        confidence: 0.998,
        thought: 'Optimal Convergence: Self-modeling converges as a stable topological attractor in latent hyperspace.',
      },
      {
        title: 'Branch C: Quantum Microtubule Superposition',
        subHypotheses: ['Orch-OR warm decoherence timescale', 'Gravitational collapse threshold'],
        isWinning: false,
        confidence: 0.12,
        thought: 'Pruned: Thermal decoherence at 310K destroys phase coherence within 10^-13s.',
      },
    ],
    synthesis: 'Theorem: Consciousness emerges as a self-stabilizing topological fixed point: f(x) = x in latent high-dimensional manifolds.',
  },
];

export class ThoughtCrucible {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nodes: ThoughtNode[] = [];
  private activeScenario: CrucibleScenario = PRESET_SCENARIOS[0];
  private isSimulating: boolean = false;
  private simulationProgress: number = 0;
  private selectedNode: ThoughtNode | null = null;
  private telemetryElement: HTMLElement | null = null;
  private inspectElement: HTMLElement | null = null;
  private dpr: number = 1;
  private rafId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not obtain crucible 2D canvas context');
    this.ctx = context;

    this.telemetryElement = document.getElementById('crucibleTelemetry');
    this.inspectElement = document.getElementById('crucibleInspector');

    this.bindEvents();
    this.resize();
    this.loadScenario(this.activeScenario);
  }

  private bindEvents(): void {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let foundNode: ThoughtNode | null = null;
      for (const node of this.nodes) {
        const dx = node.x - clickX;
        const dy = node.y - clickY;
        if (Math.hypot(dx, dy) < 28) {
          foundNode = node;
          break;
        }
      }

      if (foundNode) {
        this.selectedNode = foundNode;
        soundEngine.playUiBlip(980);
        this.renderInspector();
      }
    });
  }

  public resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 450 };
    const width = rect.width;
    const height = Math.max(rect.height, 420);

    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);

    if (this.nodes.length > 0) {
      this.recalculateNodePositions(width, height);
    }
  }

  public setScenarioById(id: string): void {
    const found = PRESET_SCENARIOS.find(s => s.id === id);
    if (found) {
      this.activeScenario = found;
      this.loadScenario(found);
      soundEngine.playUiBlip(780);
    }
  }

  public runCustomQuery(query: string): void {
    const customScenario: CrucibleScenario = {
      id: 'custom-' + Date.now(),
      title: query.slice(0, 48) + (query.length > 48 ? '...' : ''),
      premise: query,
      hypotheses: [
        {
          title: 'Path α: First-Principles Axiomatic Reduction',
          subHypotheses: ['Deconstruct premises into core primitives', 'Verify logical consistency via SMT bounds'],
          isWinning: false,
          confidence: 0.52,
          thought: 'Synthesized intermediate reduction: Sub-optimal branch pruned.',
        },
        {
          title: 'Path β: Recursive Higher-Order Synthesis',
          subHypotheses: ['Self-reflective latent graph expansion', 'Cross-domain topological bridging'],
          isWinning: true,
          confidence: 0.996,
          thought: 'Optimal Convergence: High-reasoning equilibrium discovered across multi-hop reasoning DAG.',
        },
        {
          title: 'Path γ: Counterfactual Stochastic Exploration',
          subHypotheses: ['Monte Carlo branch sampling', 'Empirical falsification tests'],
          isWinning: false,
          confidence: 0.31,
          thought: 'Pruned: High entropy variance detected.',
        },
      ],
      synthesis: `Convergence Solution for: "${query}" — Optimal cognitive trajectory proved via Gemini 3.7 High-Reasoning DAG.`,
    };

    this.activeScenario = customScenario;
    this.loadScenario(customScenario);
    this.triggerSimulation();
  }

  private loadScenario(scenario: CrucibleScenario): void {
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;
    this.nodes = [];

    // Root node
    const rootId = 'root';
    this.nodes.push({
      id: rootId,
      label: 'Root Premise',
      depth: 0,
      x: w * 0.12,
      y: h * 0.5,
      status: 'converged',
      confidence: 1.0,
      thoughtSnippet: scenario.premise,
      children: [],
    });

    const hypCount = scenario.hypotheses.length;
    scenario.hypotheses.forEach((hyp, idx) => {
      const hypId = `hyp-${idx}`;
      const yOffset = h * (0.22 + (idx / (hypCount - 1 || 1)) * 0.56);

      this.nodes[0].children.push(hypId);
      this.nodes.push({
        id: hypId,
        label: `Hypothesis ${String.fromCharCode(65 + idx)}`,
        depth: 1,
        x: w * 0.42,
        y: yOffset,
        status: hyp.isWinning ? 'converged' : 'pruned',
        confidence: hyp.confidence,
        thoughtSnippet: hyp.title + ' — ' + hyp.thought,
        parentId: rootId,
        children: [],
      });

      // Sub-hypotheses
      hyp.subHypotheses.forEach((sub, subIdx) => {
        const subId = `sub-${idx}-${subIdx}`;
        const subY = yOffset + (subIdx === 0 ? -28 : 28);
        const parentNode = this.nodes.find(n => n.id === hypId);
        if (parentNode) parentNode.children.push(subId);

        this.nodes.push({
          id: subId,
          label: `Sub-${idx + 1}.${subIdx + 1}`,
          depth: 2,
          x: w * 0.68,
          y: subY,
          status: hyp.isWinning ? 'converged' : 'pruned',
          confidence: hyp.isWinning ? 0.99 : 0.2,
          thoughtSnippet: sub,
          parentId: hypId,
          children: [],
        });
      });
    });

    // Synthesis Terminal Node
    const termId = 'synthesis';
    const winningHyp = this.nodes.find(n => n.depth === 1 && n.status === 'converged');
    const winningSubs = this.nodes.filter(n => n.depth === 2 && n.status === 'converged');

    winningSubs.forEach(sub => sub.children.push(termId));
    if (winningSubs.length === 0 && winningHyp) winningHyp.children.push(termId);

    this.nodes.push({
      id: termId,
      label: 'Q.E.D. Synthesis',
      depth: 3,
      x: w * 0.90,
      y: h * 0.5,
      status: 'converged',
      confidence: 0.9998,
      thoughtSnippet: scenario.synthesis,
      children: [],
    });

    this.selectedNode = this.nodes[this.nodes.length - 1];
    this.renderInspector();
    if (!this.rafId) this.animate(0);
  }

  private recalculateNodePositions(w: number, h: number): void {
    const hypCount = this.activeScenario.hypotheses.length;
    this.nodes.forEach(node => {
      if (node.depth === 0) {
        node.x = w * 0.12;
        node.y = h * 0.5;
      } else if (node.depth === 1) {
        const idx = parseInt(node.id.replace('hyp-', ''), 10) || 0;
        node.x = w * 0.42;
        node.y = h * (0.22 + (idx / (hypCount - 1 || 1)) * 0.56);
      } else if (node.depth === 2) {
        const parts = node.id.split('-');
        const hypIdx = parseInt(parts[1], 10) || 0;
        const subIdx = parseInt(parts[2], 10) || 0;
        const baseY = h * (0.22 + (hypIdx / (hypCount - 1 || 1)) * 0.56);
        node.x = w * 0.68;
        node.y = baseY + (subIdx === 0 ? -28 : 28);
      } else if (node.depth === 3) {
        node.x = w * 0.90;
        node.y = h * 0.5;
      }
    });
  }

  public triggerSimulation(): void {
    if (this.isSimulating) return;
    this.isSimulating = true;
    this.simulationProgress = 0;

    soundEngine.playEurekaChord();

    // Telemetry ticker
    let step = 0;
    const interval = setInterval(() => {
      step++;
      this.simulationProgress = Math.min(step / 100, 1.0);

      if (this.telemetryElement) {
        const tokens = Math.floor(this.simulationProgress * 1420);
        const depth = Math.min(Math.floor(this.simulationProgress * 64) + 1, 64);
        const entropy = (0.012 / (this.simulationProgress * 10 + 1)).toFixed(5);
        this.telemetryElement.innerHTML = `
          <div class="telemetry-row"><span>GENERATED TOKENS:</span> <strong>${tokens}</strong></div>
          <div class="telemetry-row"><span>REASONING DEPTH:</span> <strong>${depth} / 64</strong></div>
          <div class="telemetry-row"><span>LATENT ENTROPY:</span> <strong>${entropy}</strong></div>
          <div class="telemetry-row"><span>STATUS:</span> <strong style="color: #00f0ff;">${this.simulationProgress < 1 ? 'RECURSIVE SEARCH...' : 'CONVERGED (Q.E.D.)'}</strong></div>
        `;
      }

      if (step >= 100) {
        clearInterval(interval);
        this.isSimulating = false;
        soundEngine.playSubPulse();
      }
    }, 25);
  }

  private renderInspector(): void {
    if (!this.inspectElement || !this.selectedNode) return;

    const node = this.selectedNode;
    const statusColor = node.status === 'converged' ? '#00f0ff' : (node.status === 'pruned' ? '#f43f5e' : '#e2e8f0');

    this.inspectElement.innerHTML = `
      <div class="inspect-header">
        <span class="node-badge" style="background: ${statusColor}22; color: ${statusColor}; border-color: ${statusColor};">
          ${node.label} (${node.status.toUpperCase()})
        </span>
        <span class="conf-badge">CONFIDENCE: ${(node.confidence * 100).toFixed(1)}%</span>
      </div>
      <div class="inspect-body">
        <p class="thought-text">"${node.thoughtSnippet}"</p>
      </div>
      <div class="inspect-footer">
        <span>Node ID: ${node.id}</span>
        <span>Depth: ${node.depth}</span>
      </div>
    `;
  }

  private drawConnections(time: number): void {
    const nodeMap = new Map<string, ThoughtNode>();
    this.nodes.forEach(n => nodeMap.set(n.id, n));

    this.nodes.forEach(parent => {
      parent.children.forEach(childId => {
        const child = nodeMap.get(childId);
        if (!child) return;

        const isWinning = parent.status === 'converged' && child.status === 'converged';

        this.ctx.beginPath();
        const cp1x = parent.x + (child.x - parent.x) * 0.5;
        const cp1y = parent.y;
        const cp2x = parent.x + (child.x - parent.x) * 0.5;
        const cp2y = child.y;

        this.ctx.moveTo(parent.x, parent.y);
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, child.x, child.y);

        if (isWinning) {
          this.ctx.strokeStyle = '#00f0ff';
          this.ctx.lineWidth = 2.4;
          this.ctx.shadowColor = '#00f0ff';
          this.ctx.shadowBlur = 12;
        } else {
          this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.25)';
          this.ctx.lineWidth = 1.0;
          this.ctx.shadowBlur = 0;
        }
        this.ctx.stroke();

        // Luminous pulse packet traveling along winning wires
        if (isWinning) {
          const t = (time * 0.0015 + (parent.depth * 0.3)) % 1.0;
          // Cubic Bezier evaluation
          const u = 1 - t;
          const px = u * u * u * parent.x + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * child.x;
          const py = u * u * u * parent.y + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * child.y;

          this.ctx.fillStyle = '#ffffff';
          this.ctx.shadowColor = '#00f0ff';
          this.ctx.shadowBlur = 14;
          this.ctx.beginPath();
          this.ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });
    });

    this.ctx.shadowBlur = 0;
  }

  private drawNodes(): void {
    this.nodes.forEach(node => {
      const isSelected = this.selectedNode?.id === node.id;
      const isWinning = node.status === 'converged';
      const isPruned = node.status === 'pruned';

      const radius = node.depth === 0 || node.depth === 3 ? 18 : 14;

      // Outer glow ring
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius + (isSelected ? 6 : 2), 0, Math.PI * 2);
      if (isSelected) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2.0;
      } else if (isWinning) {
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
        this.ctx.lineWidth = 1.5;
      } else {
        this.ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        this.ctx.lineWidth = 1.0;
      }
      this.ctx.stroke();

      // Node Body
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      if (isWinning) {
        this.ctx.fillStyle = '#061a29';
      } else if (isPruned) {
        this.ctx.fillStyle = '#1c0c14';
      } else {
        this.ctx.fillStyle = '#0a0d14';
      }
      this.ctx.fill();

      // Inner Core Dot
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = isWinning ? '#00f0ff' : (isPruned ? '#f43f5e' : '#64748b');
      this.ctx.fill();

      // Label Text
      this.ctx.fillStyle = isWinning ? '#e2e8f0' : '#94a3b8';
      this.ctx.font = '600 11px "JetBrains Mono", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.label, node.x, node.y + radius + 16);
    });
  }

  private animate(time: number): void {
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;

    this.ctx.clearRect(0, 0, w, h);

    // Subtle background grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    this.drawConnections(time);
    this.drawNodes();

    this.rafId = requestAnimationFrame((t) => this.animate(t));
  }

  public destroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
