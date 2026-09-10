/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { World } from '@iwsdk/core';
import projectOptions from 'virtual:iwsdk-project';
import { ControllerHintSystem } from './controller-hint-system.js';
import { MissionBriefingSystem } from './mission-briefing-system.js';
import { PanelSystem } from './panel.js';
import { RobotSystem } from './robot.js';
import { TransparencySystem } from './transparency-system.js';
import { ValveSystem } from './valve-system.js';

World.create(
  document.getElementById('scene-container') as HTMLDivElement,
  projectOptions,
).then((world) => {
  world.registerSystem(RobotSystem);
  world.registerSystem(PanelSystem);
  world.registerSystem(ValveSystem);
  world.registerSystem(TransparencySystem);
  world.registerSystem(ControllerHintSystem);
  world.registerSystem(MissionBriefingSystem);
});
