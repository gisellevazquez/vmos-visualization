/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from '@iwsdk/core';

// Small human-scale reference structure near the manifold — placeholder
// dimensions, no source. Box body + single-slope (lean-to) roof, no
// texture. See docs/desiciones_diseño.md.
const WIDTH = 3;
const DEPTH = 2.5;
const FRONT_WALL_HEIGHT = 2.4;
const BACK_WALL_HEIGHT = 3;
const ROOF_OVERHANG = 0.2;
const ROOF_THICKNESS = 0.08;

const bodyMaterial = new MeshStandardMaterial({
  color: '#7a7264',
  roughness: 0.85,
  metalness: 0.1,
});

// Body as a single tapered box: front short, back tall, both walls implied
// by the top face's slope — cheapest way to get a lean-to silhouette
// without separate wall/roof pieces reading as disconnected.
const bodyGeometry = new BoxGeometry(WIDTH, 1, DEPTH);
const position = bodyGeometry.getAttribute('position');
for (let i = 0; i < position.count; i++) {
  const z = position.getZ(i);
  const y = position.getY(i);
  // Top vertices (y > 0 in the unit box) slope from FRONT_WALL_HEIGHT at
  // +Z (front) to BACK_WALL_HEIGHT at -Z (back); bottom vertices stay at 0.
  if (y > 0) {
    const t = (DEPTH / 2 - z) / DEPTH; // 0 at front (+Z), 1 at back (-Z)
    const height = FRONT_WALL_HEIGHT + t * (BACK_WALL_HEIGHT - FRONT_WALL_HEIGHT);
    position.setY(i, height);
  } else {
    position.setY(i, 0);
  }
}
position.needsUpdate = true;
bodyGeometry.computeVertexNormals();

const body = new Mesh(bodyGeometry, bodyMaterial);
body.name = 'body';

const roofMaterial = new MeshStandardMaterial({
  color: '#3f4448',
  roughness: 0.7,
  metalness: 0.2,
});

const roofLength = Math.hypot(DEPTH + ROOF_OVERHANG * 2, BACK_WALL_HEIGHT - FRONT_WALL_HEIGHT);
const roofGeometry = new BoxGeometry(WIDTH + ROOF_OVERHANG, ROOF_THICKNESS, roofLength);
const roof = new Mesh(roofGeometry, roofMaterial);
const roofAngle = Math.atan2(BACK_WALL_HEIGHT - FRONT_WALL_HEIGHT, DEPTH);
roof.rotation.x = roofAngle;
roof.position.set(0, (FRONT_WALL_HEIGHT + BACK_WALL_HEIGHT) / 2, 0);
roof.name = 'roof';

const shed = new Group();
shed.name = 'Shed';
shed.add(body, roof);

export default shed;
