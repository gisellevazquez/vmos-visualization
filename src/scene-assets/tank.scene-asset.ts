/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  CylinderGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
} from '@iwsdk/core';

const RADIUS = 41; // 82 m diameter
const HEIGHT = 35;
const EDGE_ANGLE_THRESHOLD_DEG = 40; // keeps rim/cap edges, drops the smooth side seams

const geometry = new CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
geometry.translate(0, HEIGHT / 2, 0);

const bodyMaterial = new MeshStandardMaterial({
  color: '#8a8f94',
  roughness: 0.55,
  metalness: 0.3,
});

const body = new Mesh(geometry, bodyMaterial);
body.name = 'body';

// Kept visible (opacity raised) only while TransparencySystem ghosts the body,
// so the silhouette still reads once the fill goes see-through.
const edgesMaterial = new LineBasicMaterial({
  color: '#eef3f6',
  transparent: true,
  opacity: 0,
});
const edges = new LineSegments(
  new EdgesGeometry(geometry, EDGE_ANGLE_THRESHOLD_DEG),
  edgesMaterial,
);
edges.name = 'edges';
// Body and edges sit at the same origin and are both transparent while
// ghosted; Three.js doesn't reliably order two near-coincident transparent
// objects, so force edges to draw after the body instead of leaving it to
// the automatic back-to-front sort.
edges.renderOrder = 1;

const tank = new Group();
tank.name = 'Tank';
tank.add(body);
tank.add(edges);

export default tank;
