/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from '@iwsdk/core';

// Staging placeholders — escena.md calls for the manifold as its own small,
// dense sector, at grade on low supports, separate from the tanks. Sizes
// here aren't sourced, just enough to read as a paved apron with visible
// pipe support instead of the line floating unsupported. See
// docs/desiciones_diseño.md.
// 8 m, not the original 10 — shrunk to buy clearance from the TK404 berm
// within a 30 m corridor that's fixed by tank spacing. See "El corredor no
// tiene margen para centrar, hay que achicar" in docs/desiciones_diseño.md.
const APRON_SIZE = 8;
const APRON_THICKNESS = 0.1;
// Pipe/valve sit at y=1.3 with a 0.38 m pipe radius (pipe-run.scene-asset.ts,
// shared with the scene JSON's manifold placement) — support height reaches
// exactly to the pipe's underside.
//
// The two built-in supports below are still axis-aligned in local space
// (x=+-SUPPORT_SPACING/2, z=0) — they only land under the main line if this
// asset's scene node is yawed to match the main line's direction (see the
// "Reubicación real del manifold" entry in docs/desiciones_diseño.md). The
// branch toward the secondary valve has no dedicated support of its own —
// flagged there as a known gap, not fixed here.
const SUPPORT_HEIGHT = 1.3 - 0.38;
const SUPPORT_WIDTH = 0.3;
const SUPPORT_SPACING = 3; // distance apart along the pipe run (X axis)

const apronGeometry = new BoxGeometry(APRON_SIZE, APRON_THICKNESS, APRON_SIZE);
apronGeometry.translate(0, APRON_THICKNESS / 2, 0);

const apronMaterial = new MeshStandardMaterial({
  color: '#9a9d9f',
  roughness: 0.85,
  metalness: 0,
});

const apron = new Mesh(apronGeometry, apronMaterial);
apron.name = 'apron';

const supportMaterial = new MeshStandardMaterial({
  color: '#4d5257',
  roughness: 0.6,
  metalness: 0.4,
});

function pipeSupport(x: number): Mesh {
  const geometry = new BoxGeometry(SUPPORT_WIDTH, SUPPORT_HEIGHT, SUPPORT_WIDTH);
  geometry.translate(0, SUPPORT_HEIGHT / 2, 0);
  const support = new Mesh(geometry, supportMaterial);
  support.position.set(x, 0, 0);
  support.name = 'support';
  return support;
}

const manifoldPad = new Group();
manifoldPad.name = 'Manifold Pad';
manifoldPad.add(
  apron,
  pipeSupport(-SUPPORT_SPACING / 2),
  pipeSupport(SUPPORT_SPACING / 2),
);

export default manifoldPad;
