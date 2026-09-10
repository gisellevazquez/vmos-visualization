/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  BoxGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
} from '@iwsdk/core';

const BODY_SIZE = 1.2; // scaled to read as a valve body on a 0.8 m-diameter line
const STEM_HEIGHT = 0.15;
const STEM_RADIUS = 0.06;
const HANDLE_LENGTH = 0.9;
const HANDLE_WIDTH = 0.1;
const HANDLE_THICKNESS = 0.08;

const bodyGeometry = new BoxGeometry(BODY_SIZE, BODY_SIZE, BODY_SIZE);
const bodyMaterial = new MeshStandardMaterial({
  color: '#c1502e',
  roughness: 0.45,
  metalness: 0.25,
});
const body = new Mesh(bodyGeometry, bodyMaterial);
body.name = 'body';

const fittingMaterial = new MeshStandardMaterial({
  color: '#3a3d40',
  roughness: 0.5,
  metalness: 0.6,
});

const stemGeometry = new CylinderGeometry(
  STEM_RADIUS,
  STEM_RADIUS,
  STEM_HEIGHT,
  12,
);
const stem = new Mesh(stemGeometry, fittingMaterial);
stem.name = 'stem';
stem.position.set(0, BODY_SIZE / 2 + STEM_HEIGHT / 2, 0);

// Butterfly-valve handle, not a color/light: the lever's own rotation is
// the state, read the same way a real valve reads in the field — see
// "La válvula muestra su posición en el mundo, no con color" in
// docs/desiciones_diseño.md. Rotated by ValveSystem around its own Y axis:
// 0 rad (long side on local X) is open, aligned with whatever direction the
// scene node's own rotationDeg points the pipe; Math.PI / 2 is closed,
// crossways. The valve NODE's authored rotation is what makes local X read
// as "aligned with the pipe" for that particular valve — see the scene
// JSON, each valve node is yawed to match its own pipe run.
const handleGeometry = new BoxGeometry(
  HANDLE_LENGTH,
  HANDLE_THICKNESS,
  HANDLE_WIDTH,
);
const handle = new Mesh(handleGeometry, fittingMaterial);
handle.name = 'handle';
handle.position.set(0, BODY_SIZE / 2 + STEM_HEIGHT + HANDLE_THICKNESS / 2, 0);

const valve = new Group();
valve.name = 'Valve';
valve.add(body, stem, handle);

export default valve;
