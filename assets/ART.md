# Original game artwork

Generated with the built-in image_gen tool on 2026-10-03. Final project assets:

- `fighters.png`: transparent monk/orc atlas, consumed as animation poses by `art.js`.
- `monastery.png`: chapter 1 and title screen environment.
- `forest.png`, `mine.png`, `fortress.png`, `volcano.png`: chapters 2–5.

These are rendered 2D images, not 3D game models. Source images remain unmodified; the renderer selects and clips atlas regions at runtime. All assets are served locally. The original generated outputs are preserved in the Codex generated_images folder.

## Character prompt

Use case: stylized-concept. Asset: ONE production-ready transparent 2D fighting game character sprite atlas, a precise 4-column by 2-row grid, square image. Each of the 8 equal cells has one complete full-body figure centered, feet on the same baseline at 92 percent of cell height, nothing cropped, generous transparent margins. NO text, NO grid lines, NO shadows on ground, NO background. Detailed semi-realistic cinematic dark fantasy 3D rendered anatomy, fabric folds, weathered leather and metal, dramatic rim lighting, physically plausible faces. All figures face RIGHT, side/three-quarter view appropriate for a side-scrolling beat em up. TOP ROW same bald athletic adult Shaolin monk, orange saffron robes, brown wraps, long wooden bo staff: cell 1 combat idle staff vertical, cell 2 running stride, cell 3 long horizontal staff strike to right, cell 4 airborne kick with staff. BOTTOM ROW same muscular green-skinned menacing orc warrior with tusks, iron shoulder armor, leather belt, heavy battle axe: cell 1 idle axe lowered, cell 2 running stride, cell 3 axe raised overhead telegraph, cell 4 aggressive axe swing right. Consistent identities, scale and camera within each row. Real alpha transparency, clean silhouettes. Painterly AAA fantasy character asset quality. Avoid pixel art, cartoon blocks, flat vector, UI, scenery.

## Monastery prompt

Use case: stylized-concept. Asset: high resolution WIDE PANORAMIC environment background for a premium realistic 2.5D side-scrolling fighting game. Landscape 3:1 ultra-wide composition. NO people or creatures, no text, no UI. An ancient mountain Shaolin monastery courtyard at blue hour, worn richly textured wet stone flagstones filling the entire lower 38 percent as an open flat walkable fighting arena, moss in cracks, fallen leaves, puddles reflecting soft amber lantern light. Upper 62 percent: beautifully detailed ancient Chinese wood and stone temple buildings with elegant tiled sweeping roofs, pine trees, distant misty mountains. Large temple near left third, ruined gate toward right, atmospheric clouds and shafts of moonlight. Camera horizontal, low three-quarter side view, not aerial or top-down, no obstructions anywhere in foreground playing area. Physically plausible materials, natural weathering, atmospheric depth, cinematic volumetric lighting, moody desaturated teal and warm gold palette. Detailed hand-painted realism with AAA fantasy game environment quality. Avoid pixel art, blocky geometric shapes, flat vector, cartoon, flat colors. Composition must be usable as a real playable battle arena, not a poster.

## Chapters 2–5 prompt template

Use case: stylized-concept. Asset: high resolution WIDE PANORAMIC environment background for a premium realistic 2.5D side-scrolling fantasy fighting game. Landscape 3:1 ultra-wide composition. NO people or creatures, no text, no UI. [SCENE] Camera horizontal, low three-quarter side view, not aerial or top-down. No foreground obstructions. Physically plausible materials and rich realistic textures, natural weathering, cinematic volumetric lighting, atmospheric depth, detailed hand-painted realism with AAA fantasy game environment quality. Keep a clear playable arena across the entire bottom portion. Avoid pixel art, geometric block shapes, flat vector, cartoon, flat colors.

SCENE per asset:

- Forest: A deep ancient bamboo forest at blue hour, immense gnarled trees, layered green bamboo, mossy ruined shrine, moonlit mist and fireflies. Open flat earthen path with worn stone slabs fills lower 38 percent. The forest fills upper 62 percent.
- Mine: An immense abandoned iron mine, realistic craggy rock ceiling and walls, heavy weathered timber supports, iron tracks, mining carts far in background, glowing teal crystal veins and warm oil lanterns. Open flat rocky fighting platform fills lower 38 percent, no tracks or obstructions in foreground.
- Fortress: The courtyard of an imposing brutal orc stone fortress at dusk, massive weathered battlements, iron-bound gates, red torn banners, skull motifs embedded in architecture, glowing braziers, distant dark mountains. Open flat worn flagstone fighting arena fills lower 38 percent.
- Volcano: A dramatic volcanic caldera fortress, black basalt cliffs, distant smoking lava cascades and glowing magma fissures, immense ruined obsidian throne gate. Open SAFE solid dark stone fighting platform fills lower 38 percent. Lava only at very bottom edge and distant background, no lava or obstacles in walkable fighting area.

## Unarmed atlas v2
Edited with built-in image_gen from the original fighters atlas. Prompt: remove every baked monk staff and orc axe, reconstruct covered anatomy, preserve eight sprites, original poses, positions, proportions and transparent background; leave empty gripping hands for runtime equipment. Result: fighters-unarmed-v2.png; active same content is served as fighters.png?v=2 for compatibility with the already running static server. Original retained as fighters-armed-v1.png.
