/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createComponent } from '@iwsdk/core';

// Marker only — scopes FeedSystem's [Watch, Pressed] query to the one watch
// entity it creates itself, same role Valve plays for valve entities.
export const Watch = createComponent('Watch', {});
