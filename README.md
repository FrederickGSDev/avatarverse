# Avatarverse

**Avatarverse** is a library that allows you to generate a wide variety of unique user avatars from text (such as a name or email address), in SVG or image format.

## Installation

```bash
npm install avatarverse
```

## Usage

### 🧩 JavaScript (ESM)

```js
import { generateAvatar } from "avatarverse";

const avatar = generateAvatar({
  name: "John Doe",
  variant: "beam",
  size: 60,
  rounded: true,
});

document.body.appendChild(avatar);
```

### 🌐 Web Component (HTML)

```html
<script src="node_modules/avatarverse/dist/avatarverse-webcomponent.js" type="module"></script>

<avatar-verse
  name="John Doe"
  variant="beam"
  size="80"
  rounded
>
</avatar-verse>
```

Alternatively, you can use:

```js
import "avatarverse/webcomponent";
```

```html
<avatar-verse
  name="John Doe"
  variant="beam"
  size="80"
  rounded
>
</avatar-verse>
```

---

### Props

| Prop      | Type                                                               | Default Value                                             |
| --------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| `name`    | `string`                                                           | `"John Doe"`                                              |
| `colors`  | `array`                                                            | `['#0a0310', '#49007e', '#ff005b', '#ff7d10', '#ffb238']` |
| `variant` | `"beam"`, `"marble"`, `"pixel"`, `"sunset"`, `"ring"`, `"bauhaus"` | `"beam"`                                                  |
| `rounded` | `boolean`                                                          | `false`                                                   |
| `size`    | `number`                                                           | `40`                                                      |
| `title`   | `string`                                                           | same as `name`                                            |
| `format`  | `"svg"` or `"image"`                                               | `"svg"`                                                   |

---

### 🔤 `name`

Text used as a seed to generate the avatar. It can be a name, email, or any other string. Avatars generated with the same `name` will always be identical.

### 🎨 `colors`

Array of hex color values used as the base palette for the avatar shapes. You can customize this to match your brand or interface.

### 🧩 `variant`

Visual style of the avatar. Each variant creates a distinct pattern. Available options are: `beam`, `marble`, `pixel`, `sunset`, `ring`, and `bauhaus`.

### 🔵 `rounded`

If set to `true`, the avatar is rendered with rounded edges (circular). If `false`, it remains square.

### 📏 `size`

Size of the avatar in pixels. This controls both the height and width of the SVG or image container.

### 🏷️ `title`

Alternative text used as the `title` or `alt` attribute (depending on the format). Useful for accessibility.

### 🖼️ `format`

Specifies the output type:

* `"svg"`: Returns an embedded SVG node.
* `"image"`: Returns an `<img>` element with the avatar rendered as a PNG data URI.

---

## API service

Coming soon...

---

## Licensing

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

Some avatar styles ("beam", "marble", "pixel", "sunset", "ring", "bauhaus") are adapted or inspired by
[Boring Avatars](https://github.com/boringdesigners/boring-avatars) by Pablo Stanley,
and are included under the original MIT terms.

Other avatar styles and logic are original creations and are © 2025 **Frederick Guzman Salas**.
