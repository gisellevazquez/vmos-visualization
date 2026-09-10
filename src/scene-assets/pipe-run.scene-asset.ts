/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CylinderGeometry, Mesh, MeshStandardMaterial } from '@iwsdk/core';

// Same radius/material as pipe.scene-asset.ts (30" line, 0.762 m diameter /
// 2). Duplicated rather than imported — three straight runs of different
// length are needed (TK404 spur, export stub, secondary stub), so this file
// exports a factory instead of one fixed Mesh.
const RADIUS = 0.38;

const material = new MeshStandardMaterial({
  color: '#5b6470',
  roughness: 0.5,
  metalness: 0.4,
});

export function createPipeRun(length: number): Mesh {
  const geometry = new CylinderGeometry(RADIUS, RADIUS, length, 20);
  geometry.rotateZ(Math.PI / 2);
  const pipe = new Mesh(geometry, material);
  pipe.name = 'Pipe run';
  return pipe;
}
