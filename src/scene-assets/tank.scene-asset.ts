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
  SphereGeometry,
} from '@iwsdk/core';

const RADIUS = 41; // 82 m diameter
const HEIGHT = 35;
const EDGE_ANGLE_THRESHOLD_DEG = 40; // keeps rim/cap edges, drops the smooth side seams

// Low geodesic-dome roof, modeled as a shallow spherical cap sitting flush on
// the cylinder's top rim. DOME_RISE is a staging placeholder (no source gives
// a real rise-to-diameter ratio) — 6 m on an 82 m diameter (~7%) is well
// below a hemisphere (which would rise 41 m, 50%), deliberately far enough
// from that to read unambiguously as "casquete bajo" per escena.md, not half
// a ball. See docs/desiciones_diseño.md.
const DOME_RISE = 6;
const domeSphereRadius = (RADIUS * RADIUS + DOME_RISE * DOME_RISE) / (2 * DOME_RISE);
const domeThetaMax = Math.asin(RADIUS / domeSphereRadius);

const geometry = new CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
geometry.translate(0, HEIGHT / 2, 0);

const bodyMaterial = new MeshStandardMaterial({
  color: '#8a8f94',
  roughness: 0.55,
  metalness: 0.3,
});

const body = new Mesh(geometry, bodyMaterial);
body.name = 'body';

// Dome segment counts are lower than the body's — small, usually-distant
// feature, doesn't need the same tessellation.
const domeGeometry = new SphereGeometry(
  domeSphereRadius,
  24,
  8,
  0,
  Math.PI * 2,
  0,
  domeThetaMax,
);
// Rim sits flush at the cylinder's top (y = HEIGHT); apex ends up at
// HEIGHT + DOME_RISE.
domeGeometry.translate(0, HEIGHT - domeSphereRadius * Math.cos(domeThetaMax), 0);

// Domes are aluminum, distinct from the steel envelope below — escena.md
// flags this as a common press mix-up, so give it a visibly lighter, more
// reflective finish than the body.
const domeMaterial = new MeshStandardMaterial({
  color: '#c7cdd2',
  roughness: 0.35,
  metalness: 0.6,
});

const dome = new Mesh(domeGeometry, domeMaterial);
dome.name = 'dome';

// Horizontal seam rings, marking the welded steel courses ("virolas") the
// envelope is built from. A short open-ended cylinder band, not a torus — a
// girth weld is a near-flat course boundary, not a wrapped tube. 12 courses
// over the 35 m envelope (35/12 ≈ 2.92 m apart, close to the requested ~3 m
// without leaving a short leftover course at the top) gives 11 interior
// seams; none on the dome, which is bolted aluminum, not welded steel
// plate. See docs/desiciones_diseño.md.
const SEAM_COURSE_COUNT = 12;
const SEAM_HEIGHT = 0.12;
const seamMaterial = new MeshStandardMaterial({
  color: '#6f747a',
  roughness: 0.6,
  metalness: 0.3,
});
function seamRing(y: number): Mesh {
  const seamGeometry = new CylinderGeometry(
    RADIUS + 0.03,
    RADIUS + 0.03,
    SEAM_HEIGHT,
    32,
    1,
    true,
  );
  const seam = new Mesh(seamGeometry, seamMaterial);
  seam.position.y = y;
  seam.castShadow = false;
  seam.name = 'seam';
  return seam;
}
const seams: Mesh[] = [];
for (let i = 1; i < SEAM_COURSE_COUNT; i++) {
  seams.push(seamRing((i * HEIGHT) / SEAM_COURSE_COUNT));
}

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

// Shares edgesMaterial with the body outline — TransparencySystem just sets
// .opacity on every LineSegments it finds, so one shared instance is fine.
const domeEdges = new LineSegments(
  new EdgesGeometry(domeGeometry, EDGE_ANGLE_THRESHOLD_DEG),
  edgesMaterial,
);
domeEdges.name = 'edges';
domeEdges.renderOrder = 1;

const tank = new Group();
tank.name = 'Tank';
tank.add(body);
tank.add(dome);
tank.add(...seams);
tank.add(edges);
tank.add(domeEdges);

export default tank;
