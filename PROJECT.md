# Pixel flags

## Product summary

Build a single-page flag guessing game called "Pixel Challenge".

The game shows a flag pixelated into a grid of solid colour blocks, and the player guesses which flag it is.

Pixelation:
- Draw each flag on a canvas and reduce it to blocks, each filled with the average colour of the area it covers, so colours stay in their correct positions.
- Keep each flag's own aspect ratio; the level sets the number of columns and the rows follow from the proportions.
- For flags that are not rectangular (e.g. Nepal), ignore transparent areas when averaging colours, and leave blocks that are mostly transparent empty, so the flag's outline is preserved.
- Levels: 1 = 24 columns, 2 = 12, 3 = 8, 4 = 5, 5 = 3. The player picks a level before starting.
- Load flag images from Wikimedia Commons with crossOrigin="anonymous". Do not draw flags yourself.

Gameplay:
- 10 rounds per game. Each round shows a pixelated flag and four answer options.
- After answering, animate the flag from pixelated to full resolution, then show whether the answer was correct.
- Harder levels give more points. Show a score summary at the end, with an option to play again.

Flags (keep them in a separate JSON file with name, region and image URL, so more can be added later):
Portugal, Kenya, Sri Lanka, Nepal, Bangladesh, Colombia, Iceland, Croatia, Ghana, Mongolia, Cambodia, Uruguay, Lebanon, Ireland, Côte d'Ivoire

Design: clean and calm, the flag is the visual centre with a subtle border, responsive for mobile and desktop. Use a simple layout with a header, so other sections can be added to the navigation later.

## Product capabilities

- No additional product infrastructure detected

## Technical foundation

- Framework: React with Vite and TypeScript
- Styling: plain CSS
- Database: none initially
- This is where the project starts, not a limit: when the product summary or the user asks for another database, hosted service, framework or library, use it.

## Build order for coding agents

- Work frontend-first: make the responsive visual shell and primary journey usable in the running preview before backend or infrastructure work.
- Temporary in-memory fixtures are allowed only to accelerate that first visible pass. Preserve the interface while wiring real behavior, and remove fixtures before finishing when persistence is required.
- Add backend, authentication, and persistence after the visible journey is coherent, then verify the integrated empty, loading, error, and unauthenticated states.

## Mandatory design system

- Keep the canonical authored design tokens in `src/styles/tokens.css` and ensure it remains imported by the application.
- Define and use named CSS custom properties for semantic colors, body and display font families, font weights, the type scale, line heights, letter spacing, spacing, radii, and shadows.
- Build screens and reusable controls from those variables. Avoid repeated raw values and component-local token systems so Arca's design sidebar can discover and edit the visual system.

## Architecture rules for coding agents

- Keep route files focused on routing, loading, and page composition.
- Put reusable interface elements in `src/components`.
- Put product-specific code in `src/features/<feature-name>`.
- Put shared infrastructure in `src/lib`.
- Keep reusable controls in `src/components/ui`.
- Prefer the smallest structure that fits the product; do not create placeholder layers.
- Replace the starter screen as product features are implemented. Do not retain demo components or sample data in the finished product.
- Keep the application responsive and accessible.
