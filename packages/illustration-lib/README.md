# `@digdir/illustration-lib`
Package that contains react components for illustrations, that works in light and dark mode.
Must be used with `@digdir/designsystemet-theme`.

## Installation

```bash
npm install @digdir/illustration-lib
```

### Usage

Make sure theme files with `brand1`, `brand2` and `brand3` are imported in your app.
```jsx
import '@digdir/designsystemet-theme/digdir.css';
```

Then you can use the components in your app like this:
```jsx
import { SweatyManHoldsRedBall } from '@digdir/illustration-lib';

<SweatyManHoldsRedBall />
```

Icons are available as React components:

```jsx
import { BevisIcon } from '@digdir/illustration-lib/icons';

<BevisIcon />
```

Or as framework-agnostic SVG strings:

```ts
import { bevis } from '@digdir/illustration-lib/icons/svg';
```

## Development

We use pnpm as package manager. To install dependencies, run the following command in the root of the repo:

```bash
pnpm install
```

Illustrations are auto-generated from svg files in `/svgs`.
Icons are auto-generated from svg files in `/icons`.
To build the components, run the following command:

```bash
pnpm run build
```