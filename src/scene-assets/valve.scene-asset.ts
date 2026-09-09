/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BoxGeometry, Mesh, MeshStandardMaterial } from '@iwsdk/core';

const SIZE = 1.2; // scaled to read as a valve body on a 0.8 m-diameter line

const geometry = new BoxGeometry(SIZE, SIZE, SIZE);

const material = new MeshStandardMaterial({
  color: '#c1502e',
  roughness: 0.45,
  metalness: 0.25,
});

const valve = new Mesh(geometry, material);
valve.name = 'Valve';

export default valve;
