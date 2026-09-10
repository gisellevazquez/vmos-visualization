/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createSystem, Pressed, UIKit, UIKitMLAsset } from '@iwsdk/core';
import { Vector3 } from 'three';
import { PathQuery } from './path-query-component.js';
import { Valve } from './valve-component.js';

const STATUS_PANEL_NODE_ID = 'path-status-panel';
const STATUS_TEXT_ELEMENT_ID = 'path-status';
const HANDLE_NODE_NAME = 'handle';
const HANDLE_OPEN_ANGLE = 0;
const HANDLE_CLOSED_ANGLE = Math.PI / 2;
const HANDLE_ROTATE_SPEED = Math.PI * 3; // rad/s — quarter turn in ~0.17 s

export class ValveSystem extends createSystem({
  valves: { required: [Valve] },
  valveConfirmed: { required: [Valve, Pressed] },
  pathQuery: { required: [PathQuery] },
}) {
  private readonly headWorldPosition = new Vector3();
  private readonly panelWorldPosition = new Vector3();

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
    this.snapHandles();
    this.refreshPathStatus();
  }

  update(delta: number): void {
    this.billboardStatusPanel();
    this.updateHandles(delta);
  }

  // The handle's rotation *is* the open/closed state — no color, no light,
  // per "La válvula muestra su posición en el mundo, no con color" in
  // desiciones_diseño.md. Loaded once on scene start with no animation (a
  // freshly opened scene shouldn't show handles spinning into place); every
  // toggle afterward animates through updateHandles().
  private snapHandles(): void {
    for (const entity of this.queries.valves.entities) {
      const handle = entity.object3D?.getObjectByName(HANDLE_NODE_NAME);
      if (handle == null) {
        continue;
      }
      const open = entity.getValue(Valve, 'open') ?? false;
      handle.rotation.y = open ? HANDLE_OPEN_ANGLE : HANDLE_CLOSED_ANGLE;
    }
  }

  private updateHandles(delta: number): void {
    const maxStep = HANDLE_ROTATE_SPEED * delta;
    for (const entity of this.queries.valves.entities) {
      const handle = entity.object3D?.getObjectByName(HANDLE_NODE_NAME);
      if (handle == null) {
        continue;
      }
      const open = entity.getValue(Valve, 'open') ?? false;
      const target = open ? HANDLE_OPEN_ANGLE : HANDLE_CLOSED_ANGLE;
      const current = handle.rotation.y;
      const diff = target - current;
      handle.rotation.y =
        Math.abs(diff) <= maxStep ? target : current + Math.sign(diff) * maxStep;
    }
  }

  // Panel lives at a fixed point above the valve (world space), not on the
  // observer — see "Ubicación del panel de estado" in desiciones_diseño.md.
  // Only its yaw tracks the player's head, so it keeps facing whoever is
  // reading it without tilting the text off-level. ScreenSpace reparents the
  // panel's UIKitDocument to the camera outside XR (2D HUD fallback) and back
  // to its scene node on entering XR — billboarding only makes sense once
  // it's back in world space, so skip it while still under the camera.
  private billboardStatusPanel(): void {
    const panel = this.world.getSceneObject<UIKitMLAsset>(STATUS_PANEL_NODE_ID);
    const document = panel?.document;
    if (document == null || document.parent === this.camera) {
      return;
    }
    this.player.head.getWorldPosition(this.headWorldPosition);
    document.getWorldPosition(this.panelWorldPosition);
    this.headWorldPosition.y = this.panelWorldPosition.y;
    document.lookAt(this.headWorldPosition);
  }

  // Reachability, not a single from/to check — the manifold now branches, so
  // "complete" alone can't distinguish reaching the intended destination from
  // reaching the other one. See refreshPathStatus().
  private reachableFrom(from: string): Set<string> {
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
      for (const neighbor of adjacency.get(node) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return visited;
  }

  // The universe of possible destinations, inferred from the valve graph
  // itself rather than declared separately: a node that's a `to` on some
  // valve but never a `from` on any valve is a branch endpoint. Holds only
  // for a tree-shaped graph (a root with branches that never reconverge) —
  // revisit if the manifold ever grows a loop.
  private destinationNodeIds(): Set<string> {
    const froms = new Set<string>();
    const tos = new Set<string>();
    for (const entity of this.queries.valves.entities) {
      froms.add(entity.getValue(Valve, 'from') ?? '');
      tos.add(entity.getValue(Valve, 'to') ?? '');
    }
    for (const node of froms) {
      tos.delete(node);
    }
    return tos;
  }

  private refreshPathStatus(): void {
    const [queryEntity] = this.queries.pathQuery.entities;
    if (queryEntity == null) {
      return;
    }
    const from = queryEntity.getValue(PathQuery, 'from') ?? '';
    const to = queryEntity.getValue(PathQuery, 'to') ?? '';
    const reachable = this.reachableFrom(from);

    let statusText: string;
    if (reachable.has(to)) {
      statusText = 'camino: completo';
    } else {
      const wrongDestination = [...this.destinationNodeIds()].find(
        (nodeId) => nodeId !== to && reachable.has(nodeId),
      );
      statusText =
        wrongDestination != null
          ? `camino: completo -- ${wrongDestination}`
          : 'camino: incompleto';
    }

    const panel = this.world.getSceneObject<UIKitMLAsset>(STATUS_PANEL_NODE_ID);
    const status = panel?.getElementById<UIKit.Text>(STATUS_TEXT_ELEMENT_ID);
    status?.setProperties({ text: statusText });
  }
}
