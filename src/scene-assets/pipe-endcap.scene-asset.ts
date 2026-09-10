/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CylinderGeometry, Mesh, MeshStandardMaterial } from '@iwsdk/core';

// A blind flange capping a stub that leaves the modeled area (toward the
// export line / secondary destination, neither of which exists as a
// physical asset here — escena.md defers whatever is beyond this point).
// Wider than the 0.38 m pipe radius (pipe.scene-asset.ts) so it reads as a
// flange plate, not just the pipe end.
const FLANGE_RADIUS = 0.5;
const FLANGE_THICKNESS = 0.08;

const geometry = new CylinderGeometry(
  FLANGE_RADIUS,
  FLANGE_RADIUS,
  FLANGE_THICKNESS,
  20,
);
geometry.rotateZ(Math.PI / 2);

const material = new MeshStandardMaterial({
  color: '#3a3d40',
  roughness: 0.6,
  metalness: 0.5,
});

const endcap = new Mesh(geometry, material);
endcap.name = 'Pipe endcap';

export default endcap;
