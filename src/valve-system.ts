/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSystem, Pressed, UIKit, UIKitMLAsset } from '@iwsdk/core';
import { PathQuery } from './path-query-component.js';
import { Valve } from './valve-component.js';

const STATUS_PANEL_NODE_ID = 'path-status-panel';
const STATUS_TEXT_ELEMENT_ID = 'path-status';

export class ValveSystem extends createSystem({
  valves: { required: [Valve] },
  valveConfirmed: { required: [Valve, Pressed] },
  pathQuery: { required: [PathQuery] },
}) {
  init(): void {
    const unsubscribe = this.queries.valveConfirmed.subscribe(
      'qualify',
      (entity) => {
        const isOpen = entity.getValue(Valve, 'open') ?? false;
        entity.setValue(Valve, 'open', !isOpen);
        this.refreshPathStatus();
      },
    );
    this.cleanupFuncs.push(unsubscribe);
    this.refreshPathStatus();
  }

  private pathExists(from: string, to: string): boolean {
    if (from === to) {
      return true;
    }

    const adjacency = new Map<string, string[]>();
    const addEdge = (a: string, b: string): void => {
      const neighbors = adjacency.get(a);
      if (neighbors) {
        neighbors.push(b);
      } else {
        adjacency.set(a, [b]);
      }
    };
    for (const entity of this.queries.valves.entities) {
      if (!(entity.getValue(Valve, 'open') ?? false)) {
        continue;
      }
      const a = entity.getValue(Valve, 'from') ?? '';
      const b = entity.getValue(Valve, 'to') ?? '';
      addEdge(a, b);
      addEdge(b, a);
    }

    const visited = new Set<string>([from]);
    const queue: string[] = [from];
    while (queue.length > 0) {
      const node = queue.shift() as string;
      if (node === to) {
        return true;
      }
      for (const neighbor of adjacency.get(node) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return false;
  }

  private refreshPathStatus(): void {
    const [queryEntity] = this.queries.pathQuery.entities;
    if (queryEntity == null) {
      return;
    }
    const from = queryEntity.getValue(PathQuery, 'from') ?? '';
    const to = queryEntity.getValue(PathQuery, 'to') ?? '';
    const complete = this.pathExists(from, to);

    const panel = this.world.getSceneObject<UIKitMLAsset>(STATUS_PANEL_NODE_ID);
    const status = panel?.getElementById<UIKit.Text>(STATUS_TEXT_ELEMENT_ID);
    status?.setProperties({
      text: complete ? 'camino: completo' : 'camino: incompleto',
    });
  }
}
