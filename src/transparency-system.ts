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
      const body = object.getObjectByName('body') as Mesh | undefined;
      const edges = object.getObjectByName('edges') as LineSegments | undefined;
      if (body != null) {
        const material = body.material as MeshStandardMaterial;
        material.transparent = this.active;
        material.opacity = this.active ? GHOST_OPACITY : 1;
        material.depthWrite = !this.active;
      }
      if (edges != null) {
        const material = edges.material as LineBasicMaterial;
        material.opacity = this.active ? 1 : 0;
      }
    });
  }
}
