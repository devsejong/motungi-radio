---
name: Motungi Radio Web
description: A quiet listening library built around programme art and a two-column station browser.
colors:
  primary: "#334fbe"
  canvas: "#fafaf8"
  surface: "#ffffff"
  ink: "#242524"
  muted: "#676a6d"
  line: "#e3e5e3"
  selected: "#edf0fa"
  dark-canvas: "#171918"
  dark-ink: "#f1f2ee"
  dark-primary: "#a9bcff"
typography:
  body:
    fontFamily: "system-ui, -apple-system, Apple SD Gothic Neo, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: "system-ui, -apple-system, Apple SD Gothic Neo, sans-serif"
    fontSize: "26px"
    fontWeight: 750
    lineHeight: 1.3
    letterSpacing: "-0.035em"
rounded:
  sm: "8px"
  md: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "10px"
    padding: "14px 18px"
---

## Overview
A compact listening workspace, with original programme images as the only expressive media. Familiar app controls and platform typography serve the Operate mode. The title leads, the station follows below it, and a single playback action sits to the right.

## Colors
Warm near-white by day and charcoal by night. Accent blue is reserved for selection, focus, playback state and the desktop-download action. Secondary text meets readable contrast; artwork is never tinted or cropped.

## Typography
One platform sans family is intentional for this working app (Operate guidance). Titles use 26px, brand 19px, section headings 18px, station rows 12–13px. Programme titles wrap to at most two lines; channel rows truncate. No uppercase kickers or small labels above headings.

## Layout
Centered 984px maximum including 32px side padding. Desktop player 360px left, channel browser right, gap 48px. Channels form two columns. Below 840px the player precedes the two-column list. At 320px thumbnails stack above the text within each cell. Download stays beneath the player. Long lists scroll internally.

## Components
A 56px square play/pause action beside the programme title; no previous/next, search or volume controls in this version. Playback starts only after explicit input, at full app volume (system volume remains available). Download CTA spans the player width, names the action and links to the download page. Original artwork stays contained in a neutral 190–210px region. Official-site-only stations form a separately labeled section.

## Do's and Don'ts
Preserve silent startup, original images, keyboard focus and real playback indicators. Never add decorative gradients, nested cards, fake frequencies, illustrative data or autoplay. Reduced-motion users receive a static playback indicator.

Desktop follow-up: at widths from 840px, the app uses a viewport-height shell with symmetric 64px header/footer tracks. The full player and download area are vertically centered in the remaining space; channel browsing alone scrolls. Minimum shell height 640px prevents clipping on short screens. Download benefit copy precedes the CTA.
