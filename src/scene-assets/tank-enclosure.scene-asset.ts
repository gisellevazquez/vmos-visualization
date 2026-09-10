/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from '@iwsdk/core';

const TANK_RADIUS = 41; // matches tank.scene-asset.ts

// Staging placeholders — escena.md declares real containment sizing as
// "not calculated here" (it follows a volume-percentage rule this project
// doesn't compute). These only need to read as "rectangular enclosure, wide
// margin, perimeter berm", not hold a real capacity. See
// docs/desiciones_diseño.md.
const SETBACK = 15; // clearance from the tank wall to the inner berm face
const FOOTPRINT = 2 * (TANK_RADIUS + SETBACK); // square footprint, 112 m
const BERM_HEIGHT = 2.5;
const BERM_WIDTH = 3;
const PAD_THICKNESS = 0.1;

const padGeometry = new BoxGeometry(FOOTPRINT, PAD_THICKNESS, FOOTPRINT);
padGeometry.translate(0, PAD_THICKNESS / 2, 0);

const padMaterial = new MeshStandardMaterial({
  color: '#23262a',
  roughness: 0.95,
  metalness: 0,
});

const pad = new Mesh(padGeometry, padMaterial);
pad.name = 'pad';

const bermMaterial = new MeshStandardMaterial({
  color: '#8f7f68',
  roughness: 1,
  metalness: 0,
});

// Four walls run the full footprint length each, so they overlap slightly at
// the corners — invisible at this thickness/footprint ratio, cheaper than
// mitering.
function bermWall(width: number, depth: number): Mesh {
  const geometry = new BoxGeometry(width, BERM_HEIGHT, depth);
  geometry.translate(0, BERM_HEIGHT / 2, 0);
  return new Mesh(geometry, bermMaterial);
}

const bermInset = FOOTPRINT / 2 - BERM_WIDTH / 2;

const bermNorth = bermWall(FOOTPRINT, BERM_WIDTH);
bermNorth.position.set(0, 0, -bermInset);
bermNorth.name = 'berm-north';

const bermSouth = bermWall(FOOTPRINT, BERM_WIDTH);
bermSouth.position.set(0, 0, bermInset);
bermSouth.name = 'berm-south';

const bermEast = bermWall(BERM_WIDTH, FOOTPRINT);
bermEast.position.set(bermInset, 0, 0);
bermEast.name = 'berm-east';

const bermWest = bermWall(BERM_WIDTH, FOOTPRINT);
bermWest.position.set(-bermInset, 0, 0);
bermWest.name = 'berm-west';

const enclosure = new Group();
enclosure.name = 'Tank Enclosure';
enclosure.add(pad, bermNorth, bermSouth, bermEast, bermWest);

export default enclosure;
