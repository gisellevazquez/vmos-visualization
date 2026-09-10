/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSystem, Pressed, UIKitMLAsset, VisibilityState } from '@iwsdk/core';
import { Valve } from './valve-component.js';

const PANEL_ASSET_ID = 'mission-panel';
// Longer than ControllerHintSystem's 6s — this is a sentence read once to
// understand the task, not a glanceable button legend.
const AUTO_HIDE_SECONDS = 12;
// Player spawns at [0,0,6] facing -Z; a panel at z=4 with default (+Z-facing)
// rotation already faces back toward the player, no yaw needed.
const PANEL_POSITION: [number, number, number] = [0, 1.7, 4];

export class MissionBriefingSystem extends createSystem({
  valveUsed: { required: [Valve, Pressed] },
}) {
  private panel: UIKitMLAsset | null = null;
  private visible = true;
  private everUsed = false;
  private xrEntered = false;
  private sessionStartTime: number | null = null;

  init(): void {
    this.world.assets
      .instantiate<UIKitMLAsset>(PANEL_ASSET_ID)
      .then((object) => {
        const entity = this.world.createTransformEntity(object);
        entity.object3D?.position.set(...PANEL_POSITION);
        this.panel = object;
        this.applyVisibility();
      });

    const unsubscribeUsed = this.queries.valveUsed.subscribe('qualify', () => {
      this.markUsed();
    });
    const unsubscribeVisibility = this.visibilityState.subscribe((state) => {
      if (!this.xrEntered && state !== VisibilityState.NonImmersive) {
        this.xrEntered = true;
        this.sessionStartTime = null;
        this.setVisible(true);
      }
    });
    this.cleanupFuncs.push(unsubscribeUsed, unsubscribeVisibility);
  }

  update(_delta: number, time: number): void {
    if (!this.xrEntered) {
      return;
    }
    if (this.sessionStartTime == null) {
      this.sessionStartTime = time;
    }

    if (
      this.visible &&
      !this.everUsed &&
      time - this.sessionStartTime >= AUTO_HIDE_SECONDS
    ) {
      this.setVisible(false);
    }
  }

  private markUsed(): void {
    if (this.everUsed) {
      return;
    }
    this.everUsed = true;
    this.setVisible(false);
  }

  private setVisible(visible: boolean): void {
    this.visible = visible;
    this.applyVisibility();
  }

  private applyVisibility(): void {
    if (this.panel != null) {
      this.panel.visible = this.visible;
    }
  }
}
