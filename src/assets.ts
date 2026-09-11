/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AssetType, defineAssets } from '@iwsdk/core';
import ground from './scene-assets/ground.scene-asset.js';
import manifoldPad from './scene-assets/manifold-pad.scene-asset.js';
import pipeEndcap from './scene-assets/pipe-endcap.scene-asset.js';
import { createPipeRun } from './scene-assets/pipe-run.scene-asset.js';
import pipeTee from './scene-assets/pipe-tee.scene-asset.js';
import shed from './scene-assets/shed.scene-asset.js';
import tank from './scene-assets/tank.scene-asset.js';
import tankEnclosure from './scene-assets/tank-enclosure.scene-asset.js';
import tankStair from './scene-assets/tank-stair.scene-asset.js';
import valve from './scene-assets/valve.scene-asset.js';
import watch from './scene-assets/watch.scene-asset.js';

// Straight run lengths for the manifold's pipe segments — reused across
// several scene nodes (see "pipe-main-line" duplicated 4x in the scene
// JSON), each instance repositioned/rotated by hand in the editor to the
// cross-junction layout in the user's plan-view reference. The length
// values themselves predate that manual rework and are no longer tied to
// a single derived TK404-to-export span; see "Ruteo manual: cruce de 4
// vías" in docs/desiciones_diseño.md.
const MAIN_LINE_LENGTH = 37.811;
const BRANCH_LENGTH = 4.5;
const STUB_LENGTH = 2.5;

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/u, '')}`;
const DEFAULT_STOCK_ASSET_BASE =
  'https://cdn.jsdelivr.net/npm/@iwsdk/example-assets@0.4.2/assets';
const configuredStockAssetBase =
  import.meta.env.VITE_IWSDK_EXAMPLE_ASSET_BASE_URL?.trim();
const stockAssetBase = (
  configuredStockAssetBase || DEFAULT_STOCK_ASSET_BASE
).replace(/\/+$/u, '');

function stockAssetUrl(assetId: string, fileName: string): string {
  return `${stockAssetBase}/${assetId}/${fileName}`;
}

export default defineAssets({
  'environment-desk': {
    url: stockAssetUrl('environment-desk', 'environmentDesk.gltf'),
    type: AssetType.GLTF,
    name: 'Environment Desk',
    priority: 'lazy',
  },
  'plant-sansevieria': {
    url: stockAssetUrl('plant-sansevieria', 'plantSansevieria.gltf'),
    type: AssetType.GLTF,
    name: 'Plant Sansevieria',
    priority: 'lazy',
  },
  robot: {
    url: stockAssetUrl('robot', 'robot.gltf'),
    type: AssetType.GLTF,
    name: 'Robot',
    priority: 'lazy',
  },
  'welcome-panel': {
    url: publicAssetUrl('ui/welcome.uikitml'),
    type: AssetType.UIKitML,
    name: 'Welcome Panel',
  },
  'webxr-banner': {
    url: publicAssetUrl('gltf/webxr-banner/banner.gltf'),
    type: AssetType.GLTF,
    name: 'WebXR Banner',
    priority: 'lazy',
  },
  ground,
  tank,
  'tank-enclosure': tankEnclosure,
  'tank-stair': tankStair,
  shed,
  'pipe-main-line': createPipeRun(MAIN_LINE_LENGTH),
  'pipe-branch': createPipeRun(BRANCH_LENGTH),
  'pipe-stub': createPipeRun(STUB_LENGTH),
  'pipe-tee': pipeTee,
  'pipe-endcap': pipeEndcap,
  valve,
  watch,
  'manifold-pad': manifoldPad,
  'path-status-panel': {
    url: publicAssetUrl('ui/path-status.uikitml'),
    type: AssetType.UIKitML,
    name: 'Path Status Panel',
  },
  'controller-hints-panel': {
    url: publicAssetUrl('ui/controller-hints.uikitml'),
    type: AssetType.UIKitML,
    name: 'Controller Hints',
  },
  'mission-panel': {
    url: publicAssetUrl('ui/mission-briefing.uikitml'),
    type: AssetType.UIKitML,
    name: 'Mission Briefing',
  },
  'tk404-id-label': {
    url: publicAssetUrl('ui/tank-id-tk404.uikitml'),
    type: AssetType.UIKitML,
    name: 'TK404 Label',
  },
  'tk401-id-label': {
    url: publicAssetUrl('ui/tank-id-tk401.uikitml'),
    type: AssetType.UIKitML,
    name: 'TK401 Label',
  },
  'valve-nameplate-panel': {
    url: publicAssetUrl('ui/valve-nameplate.uikitml'),
    type: AssetType.UIKitML,
    name: 'Valve Nameplate',
  },
  'valve-nameplate-hv4002-panel': {
    url: publicAssetUrl('ui/valve-nameplate-hv4002.uikitml'),
    type: AssetType.UIKitML,
    name: 'Valve Nameplate HV-4002',
  },
  'valve-nameplate-hv4003-panel': {
    url: publicAssetUrl('ui/valve-nameplate-hv4003.uikitml'),
    type: AssetType.UIKitML,
    name: 'Valve Nameplate HV-4003',
  },
});
