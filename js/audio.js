/**
 * audio.js
 * Small sound-effect engine built on the Web Audio API.
 */

const GameAudio = (() => {
  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
    }
    return ctx;
  }

  function tone({ freq = 440, duration = 0.12, type = 'sine', gain = 0.15, glideTo = null }) {
    if (muted) return;
    const audioCtx = getCtx();
    const osc = audioCtx.createOscillator();
    const amp = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (glideTo) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, audioCtx.currentTime + duration);
    }

    amp.gain.setValueAtTime(gain, audioCtx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(amp);
    amp.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  return {
    setMuted(value) { muted = value; },
    isMuted() { return muted; },

    click() { tone({ freq: 520, duration: 0.07, type: 'triangle', gain: 0.12 }); },
    paperFlip() { tone({ freq: 220, duration: 0.18, type: 'sawtooth', gain: 0.05, glideTo: 340 }); },
    stamp() { tone({ freq: 160, duration: 0.12, type: 'square', gain: 0.14, glideTo: 90 }); },
    eliminate() { tone({ freq: 700, duration: 0.1, type: 'triangle', gain: 0.1, glideTo: 300 }); },
    sparkle() {
      [880, 1180, 1480].forEach((f, i) => {
        setTimeout(() => tone({ freq: f, duration: 0.18, type: 'sine', gain: 0.08 }), i * 70);
      });
    },
  };
})();
