/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from '@iwsdk/core';

// Human-scale reference prop, not a real engineering stair — placeholder
// dimensions (nothing in escena.md sources a stair), just plausible
// industrial proportions. See docs/desiciones_diseño.md.
const RISER = 0.2;
const TREAD = 0.3;
const STEP_COUNT = 30;
const STEP_WIDTH = 1.2;
const TOTAL_RISE = RISER * STEP_COUNT; // 6 m
const TOTAL_RUN = TREAD * STEP_COUNT; // 9 m

const stepMaterial = new MeshStandardMaterial({
  color: '#6b6f73',
  roughness: 0.8,
  metalness: 0.2,
});

// Stacked solid boxes (a "ziggurat" profile from the side) — no texture
// pipeline in this project to fake painted risers on a ramp, so each step
// is real geometry. One prefab function, looped, per
// composition-patterns.md's repetition guidance.
function step(index: number): Mesh {
  const height = (index + 1) * RISER;
  const geometry = new BoxGeometry(STEP_WIDTH, height, TREAD);
  geometry.translate(0, height / 2, 0);
  const mesh = new Mesh(geometry, stepMaterial);
  mesh.position.z = -index * TREAD;
  mesh.name = 'step';
  return mesh;
}

const steps: Mesh[] = [];
for (let i = 0; i < STEP_COUNT; i++) {
  steps.push(step(i));
}

// Handrail: one rail along the stair's hypotenuse plus four support posts,
// not per-step balusters — cheaper, same "tube along explicit points"
// treatment as the pipe run.
const railMaterial = new MeshStandardMaterial({
  color: '#8f949a',
  roughness: 0.4,
  metalness: 0.6,
});
const RAIL_RADIUS = 0.03;
const RAIL_HEIGHT_ABOVE_TREAD = 0.9;
const railLength = Math.hypot(TOTAL_RUN, TOTAL_RISE);
const railAngle = Math.atan2(TOTAL_RISE, TOTAL_RUN);

const railGeometry = new CylinderGeometry(RAIL_RADIUS, RAIL_RADIUS, railLength, 8);
const rail = new Mesh(railGeometry, railMaterial);
rail.rotation.x = railAngle - Math.PI / 2;
rail.position.set(
  STEP_WIDTH / 2 + 0.05,
  RAIL_HEIGHT_ABOVE_TREAD + TOTAL_RISE / 2,
  -TOTAL_RUN / 2,
);
rail.castShadow = false;
rail.name = 'rail';

const POST_INDICES = [0, 10, 20, STEP_COUNT - 1];
function railPost(index: number): Mesh {
  const treadY = (index + 1) * RISER;
  const height = RAIL_HEIGHT_ABOVE_TREAD;
  const geometry = new CylinderGeometry(RAIL_RADIUS, RAIL_RADIUS, height, 8);
  geometry.translate(0, height / 2, 0);
  const mesh = new Mesh(geometry, railMaterial);
  mesh.position.set(STEP_WIDTH / 2 + 0.05, treadY, -index * TREAD);
  mesh.castShadow = false;
  mesh.name = 'rail-post';
  return mesh;
}

const posts = POST_INDICES.map(railPost);

const stair = new Group();
stair.name = 'Tank Stair';
stair.add(...steps, rail, ...posts);

export default stair;
