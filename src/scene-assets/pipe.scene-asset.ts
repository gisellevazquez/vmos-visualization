/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CylinderGeometry, Mesh, MeshStandardMaterial } from '@iwsdk/core';

const RADIUS = 0.08;
const LENGTH = 1.6;

const geometry = new CylinderGeometry(RADIUS, RADIUS, LENGTH, 20);
geometry.rotateZ(Math.PI / 2);

const material = new MeshStandardMaterial({
  color: '#5b6470',
  roughness: 0.5,
  metalness: 0.4,
});

const pipe = new Mesh(geometry, material);
pipe.name = 'Pipe segment';

export default pipe;
