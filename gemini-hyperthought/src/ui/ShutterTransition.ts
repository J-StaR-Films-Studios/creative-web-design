/**
 * Seamless Cinematic Shutter Transition System
 * Promise-orchestrated dual-opposing curtain wipes with Expo.inOut easing.
 */

import { gsap } from 'gsap';
import { soundEngine } from '../audio/Synthesizer';

export class ShutterTransition {
  private container: HTMLElement | null = null;

  constructor() {
    this.container = document.querySelector('.transition-container');
  }

  public reveal(): Promise<void> {
    return new Promise((resolve) => {
      const topBlocks = document.querySelectorAll('.row-top .shutter-block');
      const bottomBlocks = document.querySelectorAll('.row-bottom .shutter-block');

      if (!topBlocks.length || !bottomBlocks.length) {
        resolve();
        return;
      }

      gsap.set('.shutter-block', { scaleY: 1, visibility: 'visible' });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set('.shutter-block', { visibility: 'hidden' });
          if (this.container) {
            this.container.style.pointerEvents = 'none';
          }
          resolve();
        },
      });

      tl.to(topBlocks, {
        scaleY: 0,
        duration: 0.9,
        stagger: { each: 0.06, from: 'start' },
        ease: 'expo.inOut',
      })
      .to(bottomBlocks, {
        scaleY: 0,
        duration: 0.9,
        stagger: { each: 0.06, from: 'start' },
        ease: 'expo.inOut',
      }, '<');
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve) => {
      const topBlocks = document.querySelectorAll('.row-top .shutter-block');
      const bottomBlocks = document.querySelectorAll('.row-bottom .shutter-block');

      if (!topBlocks.length || !bottomBlocks.length) {
        resolve();
        return;
      }

      if (this.container) {
        this.container.style.pointerEvents = 'all';
      }
      gsap.set('.shutter-block', { visibility: 'visible', scaleY: 0 });
      soundEngine.playSubPulse();

      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
        },
      });

      tl.to(topBlocks, {
        scaleY: 1,
        duration: 0.85,
        stagger: { each: 0.06, from: 'end' },
        ease: 'expo.inOut',
      })
      .to(bottomBlocks, {
        scaleY: 1,
        duration: 0.85,
        stagger: { each: 0.06, from: 'end' },
        ease: 'expo.inOut',
      }, '<');
    });
  }
}

export const shutter = new ShutterTransition();
