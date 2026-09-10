/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createSystem,
  InputComponent,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
} from '@iwsdk/core';
import { Ghostable } from './ghostable-component.js';

const GHOST_OPACITY = 0.16;

/**
 * Global toggle: applies to every Ghostable entity's whole mesh subtree, not
 * just tanks — tanks, pipe segments, and the valve all carry Ghostable so the
 * same button ghosts the full installation, not one object type.
 */
export class TransparencySystem extends createSystem({
  ghostables: { required: [Ghostable] },
}) {
  private active = false;

  update(): void {
    const left = this.input.xr.gamepads.left;
    if (left?.getButtonDown(InputComponent.Y_Button)) {
      this.active = !this.active;
      this.applyState();
      this.globals.transparencyModeUsed = true;
    }
  }

  private applyState(): void {
    this.queries.ghostables.entities.forEach((entity) => {
      const object = entity.object3D;
      if (object == null) {
        return;
      }
      object.traverse((child) => {
        if (child instanceof LineSegments) {
          // Tanks carry a dedicated edge outline (see tank.scene-asset.ts)
          // that only reads once the fill goes see-through; pipe/valve
          // meshes have no such child, so this branch simply never matches
          // for them.
          const material = child.material as LineBasicMaterial;
          material.opacity = this.active ? 1 : 0;
          return;
        }
        if (child instanceof Mesh) {
          const material = child.material as MeshStandardMaterial;
          material.transparent = this.active;
          material.opacity = this.active ? GHOST_OPACITY : 1;
          material.depthWrite = !this.active;
          // Some meshes (the valve in particular) don't pick up a live
          // .transparent/.opacity change without this — verified in the
          // emulator: without needsUpdate the values mutate correctly in
          // memory but the render stays fully opaque.
          material.needsUpdate = true;
        }
      });
    });
  }
}
