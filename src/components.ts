/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { defineComponents } from '@iwsdk/core';
import { Ghostable } from './ghostable-component.js';
import { PathQuery } from './path-query-component.js';
import { Robot } from './robot-component.js';
import { Valve } from './valve-component.js';

export default defineComponents([Robot, Valve, PathQuery, Ghostable]);
