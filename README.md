# Diagram Engine

A lightweight TypeScript and Canvas-based diagram engine for rendering simple shapes with camera controls such as panning and zooming.

## Features

- Renders rectangles on a canvas
- Supports camera-based world-to-screen transformations
- Allows panning with the middle mouse button
- Supports zooming with the mouse wheel
- Includes a simple grid background

## Tech Stack

- TypeScript
- Vite
- HTML5 Canvas

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite in your browser.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build the project for production
- `npm run preview` - preview the production build locally

## Project Structure

- `src/main.ts` - application entry point
- `src/engine/` - engine core modules such as camera, renderer, scene, and coordinates
- `public/` - static assets

## Controls

- Middle mouse button: pan the view
- Mouse wheel: zoom in or out

## License

This project is currently for experimental and learning purposes.
