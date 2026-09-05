# Pining for You

A browser-based choose-your-dialogue dating sim about Mortimer, the grumpy lumberjack next door.

## Play
This repository is designed to run as a static site. Open `index.html`, or enable GitHub Pages for the `main` branch.

## Current features
- You play as **you**: no fixed player name, portrait, body, or gender.
- Four cabin backdrops: outside/inside, day/night.
- Eight transparent Mortimer expression/pose sprites.
- Flirty, Sassy, Bratty, and Soft dialogue chemistry.
- Affection and Trust stats.
- Relationship dynamics that emerge from your overall choices instead of hard-locking you into one route.
- Multiple endings.
- Browser autosave/manual save.

## Structure
- `index.html` — game UI
- `style.css` — visual-novel styling
- `game.js` — story, branching logic, relationship stats, endings, and saving
- `assets/backgrounds/` — cabin scene art
- `assets/sprites/` — Mortimer sprites

All dialogue nodes live inside the `STORY` object in `game.js`, making the story easy to expand.
