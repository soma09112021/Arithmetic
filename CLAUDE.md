# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

幼児向け算数ゲーム - A math learning game for children aged 3-6 featuring addition and subtraction with visual elements (emojis).

## Development Commands

- **Start development server**: `npm start` or `python3 -m http.server 8000`
- **View application**: Open http://localhost:8000 in browser

## Architecture

### Core Files
- `index.html` - Main HTML structure with all game screens
- `styles.css` - Responsive styling optimized for tablets
- `game.js` - Game logic class (MathGame) handling:
  - Question generation based on age difficulty
  - Score and level tracking
  - Local storage persistence
  - Screen navigation

### Game Flow
1. Age selection (3-6 years) → determines difficulty
2. Theme selection (animals/vehicles/fruits/sweets)
3. Game screen with visual math problems using emojis
4. Results screen after 10 questions
5. Data persisted in localStorage

### Key Features
- Age-based difficulty scaling (number ranges and operations)
- Visual representation using emoji themes
- Coin/level progression system
- Responsive design for tablets/mobile