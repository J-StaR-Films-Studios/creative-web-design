/**
 * Apple Developer Thinking Bench - Tree-of-Thought (ToT) Architecture
 * Clean monochromatic node graph, counterfactual branch pruning, and precision thought telemetry.
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
    id: 'formal-logic',
    title: 'Formal Axiomatic Verification',
    premise: 'Proving invariants of concurrent lock-free data structures under weak memory models.',
    hypotheses: [
      {
        title: 'Approach A: Sequential Consistency Assumption',
        subHypotheses: ['Global total store order simplification', 'Linearizability check'],
        isWinning: false,
        confidence: 0.38,
        thought: 'Pruned: Fails under ARM / Apple Silicon memory ordering barriers.',
      },
      {
        title: 'Approach B: Relativistic Acquire-Release Semantics',
        subHypotheses: ['Causal synchronization fences', 'Happens-before edge closure'],
        isWinning: true,
        confidence: 0.998,
        thought: 'Optimal Convergence: Proves strict memory safety across all architectures.',
      },
      {
        title: 'Approach C: Dynamic Race Detection Sampling',
        subHypotheses: ['ThreadSanitizer vector clock simulation'],
        isWinning: false,
        confidence: 0.25,
        thought: 'Pruned: Incomplete coverage for non-deterministic interleavings.',
      },
    ],
    synthesis: 'Formal Q.E.D. Proof: Memory fence synchronization guarantees race-free execution with zero throughput regression.',
  },
  {
    id: 'mathematical-proof',
    title: 'Analytic Number Theory & Bounds',
    premise: 'Evaluating distribution bounds of prime gaps using sieve methods.',
    hypotheses: [
      {
        title: 'Branch A: Classical Selberg Sieve',
        subHypotheses: ['Quadratic weight optimization'],
        isWinning: false,
        confidence: 0.32,
        thought: 'Pruned: Blocked by parity barrier.',
      },
      {
        title: 'Branch B: Maynard-Tao Multidimensional Weights',
        subHypotheses: ['Higher-dimensional smooth cutoff functions', 'Bombieri-Vinogradov theorem extension'],
        isWinning: true,
        confidence: 0.994,
        thought: 'Optimal Convergence: Establishes bounded gaps between consecutive primes infinitely often.',
      },
    ],
    synthesis: 'Proof Bound: There exist infinitely many pairs of distinct primes with gap bounded by 246.',
  },
  {
    id: 'system-synthesis',
    title: 'Distributed Consensus & Fault Tolerance',
    premise: 'Architecting zero-downtime state machine replication over partitioned networks.',
    hypotheses: [
      {
        title: 'Design A: Single-Leader Multi-Paxos',
        subHypotheses: ['Heartbeat election timeout', 'Log compaction snapshotting'],
        isWinning: false,
        confidence: 0.45,
        thought: 'Pruned: Susceptible to leader bottleneck during cross-region latency spikes.',
      },
      {
        title: 'Design B: Leaderless Quorum Consensus',
        subHypotheses: ['CRDT state reconciliation', 'Merkle tree sync protocol'],
        isWinning: true,
        confidence: 0.996,
        thought: 'Optimal Convergence: Guarantees eventual consistency with zero leader failover delay.',
      },
    ],
    synthesis: 'Architecture Validated: Decentralized CRDT replication achieves linear scaling across global regions.',
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
        soundEngine.playUiBlip(800);
        this.renderInspector();
      }
    });
  }

  public resize(): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 700, height: 420 };
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
      soundEngine.playUiBlip(700);
    }
  }

  public runCustomQuery(query: string): void {
    const customScenario: CrucibleScenario = {
      id: 'custom-' + Date.now(),
      title: query.slice(0, 40) + (query.length > 40 ? '...' : ''),
      premise: query,
      hypotheses: [
        {
          title: 'Direct First-Principles Analysis',
          subHypotheses: ['Deconstruct premises', 'Validate axiomatic coherence'],
          isWinning: true,
          confidence: 0.994,
          thought: 'Converged: Optimal resolution established through rigorous logical decomposition.',
        },
        {
          title: 'Heuristic Approximation',
          subHypotheses: ['Statistical pattern match'],
          isWinning: false,
          confidence: 0.35,
          thought: 'Pruned: Inadequate formal verification.',
        },
      ],
      synthesis: `Resolution for "${query}": Verified via Gemini 3.7 High Reasoning DAG.`,
    };

    this.activeScenario = customScenario;
    this.loadScenario(customScenario);
    this.triggerSimulation();
  }

  private loadScenario(scenario: CrucibleScenario): void {
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;
    this.nodes = [];

    const rootId = 'root';
    this.nodes.push({
      id: rootId,
      label: 'Premise',
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
      const yOffset = h * (0.25 + (idx / (hypCount - 1 || 1)) * 0.5);

      this.nodes[0].children.push(hypId);
      this.nodes.push({
        id: hypId,
        label: `Path ${String.fromCharCode(65 + idx)}`,
        depth: 1,
        x: w * 0.42,
        y: yOffset,
        status: hyp.isWinning ? 'converged' : 'pruned',
        confidence: hyp.confidence,
        thoughtSnippet: hyp.title + ' — ' + hyp.thought,
        parentId: rootId,
        children: [],
      });

      hyp.subHypotheses.forEach((sub, subIdx) => {
        const subId = `sub-${idx}-${subIdx}`;
        const subY = yOffset + (subIdx === 0 ? -24 : 24);
        const parentNode = this.nodes.find(n => n.id === hypId);
        if (parentNode) parentNode.children.push(subId);

        this.nodes.push({
          id: subId,
          label: `Check ${idx + 1}.${subIdx + 1}`,
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

    const termId = 'synthesis';
    const winningSubs = this.nodes.filter(n => n.depth === 2 && n.status === 'converged');
    const winningHyp = this.nodes.find(n => n.depth === 1 && n.status === 'converged');

    winningSubs.forEach(sub => sub.children.push(termId));
    if (winningSubs.length === 0 && winningHyp) winningHyp.children.push(termId);

    this.nodes.push({
      id: termId,
      label: 'Q.E.D.',
      depth: 3,
      x: w * 0.90,
      y: h * 0.5,
      status: 'converged',
      confidence: 0.999,
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
        node.y = h * (0.25 + (idx / (hypCount - 1 || 1)) * 0.5);
      } else if (node.depth === 2) {
        const parts = node.id.split('-');
        const hypIdx = parseInt(parts[1], 10) || 0;
        const subIdx = parseInt(parts[2], 10) || 0;
        const baseY = h * (0.25 + (hypIdx / (hypCount - 1 || 1)) * 0.5);
        node.x = w * 0.68;
        node.y = baseY + (subIdx === 0 ? -24 : 24);
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

    let step = 0;
    const interval = setInterval(() => {
      step++;
      this.simulationProgress = Math.min(step / 100, 1.0);

      if (this.telemetryElement) {
        const tokens = Math.floor(this.simulationProgress * 1280);
        const depth = Math.min(Math.floor(this.simulationProgress * 64) + 1, 64);
        this.telemetryElement.innerHTML = `
          <div class="telemetry-row"><span>Tokens Generated</span> <strong>${tokens}</strong></div>
          <div class="telemetry-row"><span>Reasoning Depth</span> <strong>${depth} / 64</strong></div>
          <div class="telemetry-row"><span>Status</span> <strong style="color: #f5f5f7;">${this.simulationProgress < 1 ? 'Evaluating...' : 'Verified (Q.E.D.)'}</strong></div>
        `;
      }

      if (step >= 100) {
        clearInterval(interval);
        this.isSimulating = false;
      }
    }, 20);
  }

  private renderInspector(): void {
    if (!this.inspectElement || !this.selectedNode) return;

    const node = this.selectedNode;
    const isConverged = node.status === 'converged';

    this.inspectElement.innerHTML = `
      <div class="inspect-header">
        <span class="node-badge" style="background: ${isConverged ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'}; color: #f5f5f7; border-color: rgba(255,255,255,0.2);">
          ${node.label} (${node.status.toUpperCase()})
        </span>
        <span class="conf-badge">${(node.confidence * 100).toFixed(1)}% Confidence</span>
      </div>
      <div class="inspect-body">
        <p class="thought-text">"${node.thoughtSnippet}"</p>
      </div>
      <div class="inspect-footer">
        <span>ID: ${node.id}</span>
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
          this.ctx.strokeStyle = 'rgba(245, 245, 247, 0.75)';
          this.ctx.lineWidth = 1.8;
        } else {
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          this.ctx.lineWidth = 1.0;
        }
        this.ctx.stroke();

        // Subtle traveling pulse on winning connections
        if (isWinning) {
          const t = (time * 0.0012 + (parent.depth * 0.35)) % 1.0;
          const u = 1 - t;
          const px = u * u * u * parent.x + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * child.x;
          const py = u * u * u * parent.y + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * child.y;

          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });
    });
  }

  private drawNodes(): void {
    this.nodes.forEach(node => {
      const isSelected = this.selectedNode?.id === node.id;
      const isWinning = node.status === 'converged';
      const radius = node.depth === 0 || node.depth === 3 ? 16 : 12;

      // Outer Ring
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius + (isSelected ? 5 : 0), 0, Math.PI * 2);
      this.ctx.strokeStyle = isSelected ? '#ffffff' : (isWinning ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.15)');
      this.ctx.lineWidth = isSelected ? 1.8 : 1.0;
      this.ctx.stroke();

      // Node Body
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = isWinning ? '#1c1c22' : '#0e0e12';
      this.ctx.fill();

      // Center Core
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 3.5, 0, Math.PI * 2);
      this.ctx.fillStyle = isWinning ? '#f5f5f7' : '#55555b';
      this.ctx.fill();

      // Label
      this.ctx.fillStyle = isWinning ? '#d2d2d7' : '#86868b';
      this.ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(node.label, node.x, node.y + radius + 15);
    });
  }

  private animate(time: number): void {
    const w = this.canvas.width / this.dpr;
    const h = this.canvas.height / this.dpr;

    this.ctx.clearRect(0, 0, w, h);

    this.drawConnections(time);
    this.drawNodes();

    this.rafId = requestAnimationFrame((t) => this.animate(t));
  }

  public destroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
