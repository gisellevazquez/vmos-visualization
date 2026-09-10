/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// One-time generator for the two synthetic ambient loops used by the scene
// (manifold hum, background wind) — hand-rolled RIFF/WAVE + 16-bit PCM, no
// dependencies (none exist in this project). Run with:
//   node scripts/generate-audio.mjs
// Regenerating overwrites the files under public/audio/.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SAMPLE_RATE = 44100;

function writeWav(path, samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8, 'ascii');
  buffer.write('fmt ', 12, 'ascii');
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate (mono, 16-bit)
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write('data', 36, 'ascii');
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  writeFileSync(path, buffer);
  console.log(`wrote ${path} (${(dataSize / 1024).toFixed(1)} KB, ${(samples.length / SAMPLE_RATE).toFixed(2)}s)`);
}

// Soft harmonic drone near the manifold. Every frequency involved completes
// a whole number of cycles over the loop duration, so sample 0 and the
// final sample are phase-identical — a seamless loop with no crossfade.
function generateHum() {
  const duration = 4;
  const n = SAMPLE_RATE * duration;
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const fundamental = Math.sin(2 * Math.PI * 55 * t) * 0.05;
    const second = Math.sin(2 * Math.PI * 110 * t) * 0.025;
    const third = Math.sin(2 * Math.PI * 165 * t) * 0.012;
    const breathing = 1 + 0.08 * Math.sin(2 * Math.PI * 0.25 * t);
    samples[i] = (fundamental + second + third) * breathing;
  }
  return samples;
}

// Filtered-noise wind bed with a gust-like swell envelope — same
// whole-cycles-per-loop trick for the two envelope LFOs.
function generateWind() {
  const duration = 8;
  const n = SAMPLE_RATE * duration;
  const samples = new Float32Array(n);
  const cutoff = 500;
  const alpha = 1 - Math.exp((-2 * Math.PI * cutoff) / SAMPLE_RATE);
  let filtered = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const white = (Math.random() * 2 - 1) * 0.15;
    filtered = filtered + alpha * (white - filtered);
    const envelope =
      0.6 +
      0.25 * Math.sin(2 * Math.PI * 0.125 * t) +
      0.15 * Math.sin(2 * Math.PI * 0.375 * t);
    samples[i] = filtered * envelope;
  }
  // Normalize peak to ~0.04 ("muy suave y bajo").
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(samples[i]));
  const scale = peak > 0 ? 0.04 / peak : 1;
  for (let i = 0; i < n; i++) samples[i] *= scale;
  return samples;
}

const audioDir = fileURLToPath(new URL('../public/audio/', import.meta.url));
writeWav(`${audioDir}manifold-hum.wav`, generateHum());
writeWav(`${audioDir}wind.wav`, generateWind());
