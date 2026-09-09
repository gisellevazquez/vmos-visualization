/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createComponent, Types } from '@iwsdk/core';

export const Valve = createComponent('Valve', {
  from: { type: Types.String, default: '' },
  to: { type: Types.String, default: '' },
  open: { type: Types.Boolean, default: false },
});
