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
  RayInteractable,
  UIKit,
  UIKitDocument,
} from '@iwsdk/core';
import { Vector3 } from 'three';
import { Watch } from './watch-component.js';

const FEED_URL = `${import.meta.env.BASE_URL}data/feed.md`;
const FONT_URL = `${import.meta.env.BASE_URL}ui/fonts/dm-sans-regular.ttf`;

// @pmndrs/uikit's TTFLoader bakes its MSDF glyph atlas only from this
// hardcoded ASCII set (node_modules/@pmndrs/uikit/dist/loaders/ttf.js,
// DEFAULT_OPTIONS.charset) — plain ASCII, nothing accented. UIKitML's
// @font-face has no way to override it (not in @drawcall/uikitml's parsed
// schema), so any text routed through a .uikitml file loses á/é/í/ó/ú/ñ no
// matter which font it declares or where that font is hosted — confirmed by
// testing a self-hosted font, not just reasoning about it. This panel is
// built directly against UIKit.Container/Text specifically so this charset
// can be passed through. See docs/desiciones_diseño.md, "Causa real del bug
// de tildes". Fixes this panel only — existing .uikitml panels are still
// stuck without accents.
const BASE_CHARSET =
  ' \tABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?.,;:\'"()-[]{}@#$%&*+=/\\<>';
// Spanish letters plus the em dash — feed.md uses it in source citations
// ("vmos.ar — sitio oficial") and the correction prefix below does too.
// Verified against actual feed.md content (every codepoint the file uses
// outside BASE_CHARSET), not guessed — extend this if a future edit to
// feed.md introduces a character still missing here.
const EXTRA_CHARSET = 'áéíóúñÁÉÍÓÚÑüÜ¿¡—';
const FEED_CHARSET = BASE_CHARSET + EXTRA_CHARSET;
const FEED_FONT_FAMILY = 'feed-body';

type MessageType = 'fuente' | 'acotacion' | 'correccion-propia';

interface FeedMessage {
  type: MessageType;
  source: string;
  body: string;
}

// Provisional — not measured against a capture or headset yet. See
// docs/desiciones_diseño.md, "Ancho, font-size y tope de caracteres".
const PANEL_WIDTH = 90;
const PANEL_HEIGHT = 110;
const PANEL_PADDING = 10;
const HEADER_FONT_SIZE = 7;
const LABEL_FONT_SIZE = 3.5;
const BODY_FONT_SIZE = 5.5;
const BUBBLE_PADDING = 8;
const BUBBLE_GAP = 6;

// The three types read at the same body size on purpose — an acotacion
// qualifies what a fuente asserts, it doesn't weigh less. Distinguished by
// accent color and indent, never by scale. See docs/desiciones_diseño.md,
// "Los tres tipos de mensaje se distinguen por posición y acento".
const TYPE_ACCENT: Record<MessageType, string> = {
  fuente: '#3f6b82',
  acotacion: '#a68a3f',
  'correccion-propia': '#c1502e',
};
const TYPE_INDENT: Record<MessageType, number> = {
  fuente: 0,
  acotacion: 10,
  'correccion-propia': 0,
};
const TYPE_PREFIX: Record<MessageType, string> = {
  fuente: '',
  acotacion: '',
  'correccion-propia': 'CORRECCIÓN — ',
};

const WRIST_OFFSET: [number, number, number] = [0, 0.02, -0.03];
const PANEL_DISTANCE = 2;
const PANEL_HEIGHT_OFFSET = -0.1;
const SCROLL_SPEED = 60; // cm/s of scrollPosition.y at full stick deflection
const SCROLL_DEADZONE = 0.15;

function parseFeed(source: string): FeedMessage[] {
  const headerPattern =
    /^\*\*\[(fuente|acotacion|correccion-propia)\]\*\*\s*(.+)$/;
  const messages: FeedMessage[] = [];
  for (const block of source.split(/\n\s*\n/)) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length === 0) {
      continue;
    }
    const match = headerPattern.exec(lines[0]);
    if (!match) {
      continue;
    }
    const body = lines.slice(1).join(' ');
    if (body.length === 0) {
      continue;
    }
    messages.push({
      type: match[1] as MessageType,
      source: match[2],
      body,
    });
  }
  return messages;
}

function uniformPadding(value: number) {
  return {
    paddingTop: value,
    paddingRight: value,
    paddingBottom: value,
    paddingLeft: value,
  };
}

function uniformBorderWidth(value: number) {
  return {
    borderTopWidth: value,
    borderRightWidth: value,
    borderBottomWidth: value,
    borderLeftWidth: value,
  };
}

function uniformBorderRadius(value: number) {
  return {
    borderTopLeftRadius: value,
    borderTopRightRadius: value,
    borderBottomLeftRadius: value,
    borderBottomRightRadius: value,
  };
}

/**
 * Research-thread panel — a conversational feed of sourced claims,
 * qualifications and self-corrections, read from public/data/feed.md.
 * Raised from a wrist watch (Y_Button/X_Button are already taken by
 * transparency/hints; the watch is a physical RayInteractable, not a
 * spare button). Position/scroll only — no object anchoring yet, and the
 * whole visual design is a placeholder for a UI kit the user is sending
 * separately. See docs/desiciones_diseño.md, "Panel de investigación".
 */
export class FeedSystem extends createSystem({
  watchPressed: { required: [Watch, Pressed] },
}) {
  private document: UIKitDocument | null = null;
  private scrollContainer: UIKit.Container | null = null;
  private visible = false;
  private readonly headWorldPosition = new Vector3();
  private readonly headForward = new Vector3();
  private readonly panelWorldPosition = new Vector3();

  init(): void {
    this.buildWatch();
    this.buildPanel();

    const unsubscribe = this.queries.watchPressed.subscribe('qualify', () => {
      this.setVisible(!this.visible);
    });
    this.cleanupFuncs.push(unsubscribe);
  }

  update(delta: number): void {
    if (this.document != null && this.visible) {
      this.billboard();
      this.applyScrollInput(delta);
    }
  }

  private async buildWatch(): Promise<void> {
    const object = await this.world.assets.instantiate('watch');
    const entity = this.world.createTransformEntity(object);
    entity.addComponent(RayInteractable, {});
    entity.addComponent(Watch, {});
    // setValue()/getVectorView() on a component the entity doesn't already
    // carry is a silent no-op, not an implicit add — confirmed via
    // `ecs query`, the entity had no Follower component at all and sat at
    // the scene origin. addComponent() with the full initial value is the
    // form that actually attaches it. See docs/desiciones_diseño.md.
    entity.addComponent(Follower, {
      target: this.player.gripSpaces.left,
      offsetPosition: WRIST_OFFSET,
      behavior: FollowBehavior.PivotY,
    });
  }

  private async loadFont(): Promise<UIKit.FontFamilies> {
    const loaded = await new UIKit.TTFLoader().loadAsync([
      { url: FONT_URL, charset: FEED_CHARSET },
    ]);
    const weights = Object.values(loaded)[0];
    const fontInfo = Object.values(weights)[0];
    return { [FEED_FONT_FAMILY]: { normal: fontInfo } };
  }

  private async buildPanel(): Promise<void> {
    const [source, fontFamilies] = await Promise.all([
      fetch(FEED_URL).then((response) => response.text()),
      this.loadFont(),
    ]);
    const messages = parseFeed(source);

    const scrollContainer = new UIKit.Container({
      flexDirection: 'column',
      width: '100%',
      height:
        PANEL_HEIGHT - PANEL_PADDING * 2 - HEADER_FONT_SIZE - BUBBLE_GAP,
      overflow: 'scroll',
      gapRow: BUBBLE_GAP,
    });
    for (const message of messages) {
      scrollContainer.add(this.buildBubble(message, fontFamilies));
    }

    const header = new UIKit.Text({
      text: 'Hilo de investigacion',
      fontFamily: FEED_FONT_FAMILY,
      fontFamilies,
      fontSize: HEADER_FONT_SIZE,
      fontWeight: 700,
      color: '#f6fbff',
      marginBottom: BUBBLE_GAP,
    });

    const root = new UIKit.Container({
      flexDirection: 'column',
      width: PANEL_WIDTH,
      height: PANEL_HEIGHT,
      ...uniformPadding(PANEL_PADDING),
      backgroundColor: '#10171a',
      borderColor: '#34464d',
      ...uniformBorderWidth(1),
      ...uniformBorderRadius(10),
    });
    root.add(header, scrollContainer);

    const document = new UIKitDocument(root);
    document.visible = false;
    this.world.createTransformEntity(document);

    this.document = document;
    this.scrollContainer = scrollContainer;
  }

  private buildBubble(
    message: FeedMessage,
    fontFamilies: UIKit.FontFamilies,
  ): UIKit.Container {
    const accent = TYPE_ACCENT[message.type];
    const bubble = new UIKit.Container({
      flexDirection: 'column',
      width: '100%',
      marginLeft: TYPE_INDENT[message.type],
      ...uniformPadding(BUBBLE_PADDING),
      backgroundColor: '#161d21',
      borderColor: accent,
      borderLeftWidth: message.type === 'correccion-propia' ? 4 : 3,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      ...uniformBorderRadius(4),
    });

    const label = new UIKit.Text({
      text: message.source,
      fontFamily: FEED_FONT_FAMILY,
      fontFamilies,
      fontSize: LABEL_FONT_SIZE,
      fontWeight: 700,
      color: accent,
      marginBottom: 3,
    });

    const body = new UIKit.Text({
      text: TYPE_PREFIX[message.type] + message.body,
      fontFamily: FEED_FONT_FAMILY,
      fontFamilies,
      fontSize: BODY_FONT_SIZE,
      color: '#e7edf0',
      lineHeight: 1.3,
    });

    bubble.add(label, body);
    return bubble;
  }

  private setVisible(visible: boolean): void {
    this.visible = visible;
    if (this.document != null) {
      this.document.visible = visible;
    }
    if (visible) {
      this.positionPanel();
    }
  }

  // Fixed at open time, not object-anchored and not continuously following
  // the player — "sin anclaje a objetos todavía" per the feature request.
  private positionPanel(): void {
    if (this.document == null) {
      return;
    }
    this.player.head.getWorldPosition(this.headWorldPosition);
    this.player.head.getWorldDirection(this.headForward);
    this.panelWorldPosition
      .copy(this.headWorldPosition)
      .addScaledVector(this.headForward, PANEL_DISTANCE);
    this.panelWorldPosition.y += PANEL_HEIGHT_OFFSET;
    this.document.position.copy(this.panelWorldPosition);
  }

  // Yaw-only billboard toward the player, same technique as the path
  // status panel in ValveSystem — keeps the panel level while still facing
  // whoever is reading it.
  private billboard(): void {
    if (this.document == null) {
      return;
    }
    this.player.head.getWorldPosition(this.headWorldPosition);
    this.headWorldPosition.y = this.document.position.y;
    this.document.lookAt(this.headWorldPosition);
  }

  private applyScrollInput(delta: number): void {
    if (this.scrollContainer == null) {
      return;
    }
    const stickY =
      this.input.xr.gamepads.right?.getAxesValues(InputComponent.Thumbstick)
        ?.y ?? 0;
    if (Math.abs(stickY) < SCROLL_DEADZONE) {
      return;
    }
    const [x, y] = this.scrollContainer.scrollPosition.value;
    this.scrollContainer.scrollPosition.value = [
      x,
      Math.max(0, y + stickY * SCROLL_SPEED * delta),
    ];
  }
}
