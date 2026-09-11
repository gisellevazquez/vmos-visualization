/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createSystem,
  FollowBehavior,
  Follower,
  InputComponent,
  Pressed,
  UIKitMLAsset,
  VisibilityState,
} from '@iwsdk/core';
import { Valve } from './valve-component.js';

const PANEL_ASSET_ID = 'controller-hints-panel';
const AUTO_HIDE_SECONDS = 6;
const OFFSET_ABOVE_GRIP: [number, number, number] = [0, 0.1, 0];

export class ControllerHintSystem extends createSystem({
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
        // setValue()/getVectorView() on a component the entity doesn't
        // already carry is a silent no-op, not an implicit add — this panel
        // sat at the scene origin, never actually following the grip. See
        // docs/desiciones_diseño.md.
        entity.addComponent(Follower, {
          target: this.player.gripSpaces.left,
          offsetPosition: OFFSET_ABOVE_GRIP,
          behavior: FollowBehavior.PivotY,
        });
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

    const left = this.input.xr.gamepads.left;
    if (left?.getButtonDown(InputComponent.X_Button)) {
      this.setVisible(!this.visible);
      return;
    }

    if (this.globals.transparencyModeUsed === true) {
      this.markUsed();
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
