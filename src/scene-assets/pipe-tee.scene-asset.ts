/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Mesh, MeshStandardMaterial, SphereGeometry } from '@iwsdk/core';

// The manifold's branch point: TK404's line runs straight through this point
// (main line to the export valve), and the secondary branch peels off here
// at 90 deg — a real tee, not a molded fitting, so no need to model the
// branch arm itself: it's a separate pipe-run node in the scene, this is
// just the ball that hides the 3-way seam where main line, branch and hub
// meet. Radius 0.5 m, bigger than the 0.38 m pipe radius (pipe.scene-asset.ts)
// on purpose, same as the corner-overlap trick already used for the berm
// walls — cheaper than a mitered joint, invisible at this scale.
const RADIUS = 0.5;

const geometry = new SphereGeometry(RADIUS, 16, 12);

const material = new MeshStandardMaterial({
  color: '#5b6470',
  roughness: 0.5,
  metalness: 0.4,
});

const tee = new Mesh(geometry, material);
tee.name = 'Pipe tee';

export default tee;
