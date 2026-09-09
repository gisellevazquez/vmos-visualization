/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CylinderGeometry, Mesh, MeshStandardMaterial } from '@iwsdk/core';

const RADIUS = 0.6;
const HEIGHT = 1.4;

const geometry = new CylinderGeometry(RADIUS, RADIUS, HEIGHT, 32);
geometry.translate(0, HEIGHT / 2, 0);

const material = new MeshStandardMaterial({
  color: '#8a8f94',
  roughness: 0.55,
  metalness: 0.3,
});

const tank = new Mesh(geometry, material);
tank.name = 'Tank';

export default tank;
