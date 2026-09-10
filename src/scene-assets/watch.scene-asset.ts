/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CylinderGeometry, Group, Mesh, MeshStandardMaterial } from '@iwsdk/core';

// A small wrist watch — the physical control that opens the feed panel.
// Placeholder proportions, not measured: 3.5 cm dial radius, 1.2 cm thick,
// roughly a real smartwatch face. See docs/desiciones_diseño.md.
const DIAL_RADIUS = 0.035;
const DIAL_THICKNESS = 0.012;
const SCREEN_RADIUS = 0.027;
const SCREEN_THICKNESS = 0.002;

const bodyGeometry = new CylinderGeometry(DIAL_RADIUS, DIAL_RADIUS, DIAL_THICKNESS, 24);
const bodyMaterial = new MeshStandardMaterial({
  color: '#2a2d30',
  roughness: 0.4,
  metalness: 0.6,
});
const body = new Mesh(bodyGeometry, bodyMaterial);
body.name = 'body';

const screenGeometry = new CylinderGeometry(SCREEN_RADIUS, SCREEN_RADIUS, SCREEN_THICKNESS, 24);
const screenMaterial = new MeshStandardMaterial({
  color: '#4ea8b8',
  roughness: 0.25,
  metalness: 0.1,
  emissive: '#1f4750',
  emissiveIntensity: 0.6,
});
const screen = new Mesh(screenGeometry, screenMaterial);
screen.name = 'screen';
screen.position.set(0, DIAL_THICKNESS / 2 + SCREEN_THICKNESS / 2, 0);

const watch = new Group();
watch.name = 'Watch';
watch.add(body, screen);

export default watch;
