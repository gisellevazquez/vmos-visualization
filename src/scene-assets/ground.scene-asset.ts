/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BoxGeometry, Mesh, MeshStandardMaterial } from '@iwsdk/core';

const WIDTH = 10;
const DEPTH = 10;
const THICKNESS = 0.05;

const geometry = new BoxGeometry(WIDTH, THICKNESS, DEPTH);
geometry.translate(0, -THICKNESS / 2, 0);

const material = new MeshStandardMaterial({
  color: '#6b6f73',
  roughness: 0.9,
  metalness: 0,
});

const ground = new Mesh(geometry, material);
ground.name = 'Ground';

export default ground;
