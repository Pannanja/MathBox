import type { Moment } from './experience';
/** Audio starts only after an explicit gesture. Notes follow the existing playback clock. */
export class ExhibitSound {
  private context: AudioContext | null = null;
  private gain: GainNode | null = null;
  private voices = new Set<OscillatorNode>();
  async enable(volume: number) {
    this.context ??= new AudioContext();
    if (!this.gain) {
      this.gain = this.context.createGain();
      this.gain.connect(this.context.destination);
    }
    this.volume(volume);
    await this.context.resume();
    return this.context.state === 'running';
  }
  volume(value: number) {
    if (this.gain && this.context)
      this.gain.gain.setTargetAtTime(value * 0.15, this.context.currentTime, 0.02);
  }
  play(events: Moment[]) {
    if (!this.context || this.context.state !== 'running' || !this.gain) return;
    for (const event of events.filter((e) => !e.reverse && e.kind !== 'power').slice(-4)) {
      if (this.voices.size >= 12) break;
      const ctx = this.context,
        osc = ctx.createOscillator(),
        envelope = ctx.createGain(),
        now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.value =
        event.kind === 'zero' ? 660 : 110 * 2 ** ((Math.log2(event.value) % 3) / 2);
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(0.3, now + 0.015);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(envelope);
      envelope.connect(this.gain);
      this.voices.add(osc);
      osc.onended = () => {
        this.voices.delete(osc);
        osc.disconnect();
        envelope.disconnect();
      };
      osc.start(now);
      osc.stop(now + 0.5);
    }
  }
  silence() {
    for (const voice of this.voices) {
      try {
        voice.stop();
      } catch {}
    }
    this.voices.clear();
  }
  close() {
    this.silence();
    void this.context?.close();
    this.context = null;
    this.gain = null;
  }
}
