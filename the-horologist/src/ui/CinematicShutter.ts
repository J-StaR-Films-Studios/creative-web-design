/**
 * Camera Shutter Aperture Transition & Telemetry Timecode HUD
 */
export class CinematicShutter {
  private portal: HTMLElement;
  private topBlade: HTMLElement;
  private bottomBlade: HTMLElement;
  private indicator: HTMLElement;
  private timecodeEl: HTMLElement;

  constructor() {
    this.portal = document.getElementById('shutter-portal')!;
    this.topBlade = this.portal.querySelector('.blade-top')!;
    this.bottomBlade = this.portal.querySelector('.blade-bottom')!;
    this.indicator = this.portal.querySelector('.shutter-indicator')!;
    this.timecodeEl = document.getElementById('shutter-timecode')!;

    this.startTimecode();
    this.openShutter();
  }

  private startTimecode() {
    let frame = 0;
    setInterval(() => {
      frame++;
      const hrs = String(Math.floor(frame / 216000)).padStart(2, '0');
      const mins = String(Math.floor((frame % 216000) / 3600)).padStart(2, '0');
      const secs = String(Math.floor((frame % 3600) / 60)).padStart(2, '0');
      const f = String(frame % 60).padStart(2, '0');
      this.timecodeEl.textContent = `${hrs}:${mins}:${secs}:${f}`;
    }, 16.6);
  }

  public openShutter() {
    setTimeout(() => {
      this.indicator.style.opacity = '0';
      this.topBlade.style.transform = 'translateY(-100%)';
      this.bottomBlade.style.transform = 'translateY(100%)';
    }, 400);
  }

  public flashShutter(callback?: () => void) {
    this.topBlade.style.transform = 'translateY(0%)';
    this.bottomBlade.style.transform = 'translateY(0%)';
    this.indicator.style.opacity = '1';

    setTimeout(() => {
      if (callback) callback();
      this.openShutter();
    }, 600);
  }
}
