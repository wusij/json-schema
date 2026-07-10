# JSON Schema Editor

> A visual JSON tree editor with an embedded field configuration panel. Edit JSON structure interactively and attach form metadata (labels, validation rules, upload constraints, etc.) — all in one UI. Built for **Vue 3 + Element Plus**.

[![npm](https://img.shields.io/npm/v/json-schema-editor)](https://www.npmjs.com/package/json-schema-editor)
[![npm peer dependency version](https://img.shields.io/npm/dependency-version/json-schema-editor/peer/vue)](https://github.com/2910410219/json-schema-editor)

---

## Features

- **🗂 Visual JSON Tree** — Add, delete, rename, collapse/expand nodes in real time
- **⚙️ Field Config Panel** — Select any node and configure its form metadata in a side panel:
  - Field type (text, textarea, number, switch, select, upload)
  - Label & description
  - Required toggle
  - Default value
  - Validation constraints (min/max length, range, regex, integer/float)
  - Select options editor
  - Upload rules (per-format size/count limits)
- **📋 Paste JSON** — Replace any object/array node by pasting raw JSON
- **📎 Copy JSON** — Copy any subtree as formatted JSON to clipboard
- **🔌 Embedded Config** — Config metadata is embedded inside the JSON itself using the `{ type, value/attrs, ...config }` tagged-value convention
- **↔️ v-model** — Two-way binding with your data

---

## Installation

```bash
npm install json-schema-editor element-plus @element-plus/icons-vue
```

> `element-plus` and `@element-plus/icons-vue` are **peer dependencies** — they must be installed in your project.

### Import styles

```ts
// main.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'json-schema-editor/dist/style.css'
```

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { JsonEditor } from 'json-schema-editor'

const myJson = ref({
  name: "张三",
  age: 28,
  tags: ["frontend", "vue"],
  address: {
    city: "北京",
    zip: "100000"
  }
})
</script>

<template>
  <div style="height: 600px">
    <JsonEditor v-model="myJson" @change="onChange" />
  </div>
</template>
```

> **Note:** The editor requires a **fixed height** container. Set the parent element's height (or the editor will collapse).

---

## API

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `any` | `{}` | The JSON data to edit (two-way binding via `v-model`) |

### Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `any` | Emitted when the JSON changes (for `v-model`) |
| `change` | `any` | Same payload as `update:modelValue`, additional convenience event |

### Expose (via `ref`)

| Method | Returns | Description |
|---|---|---|
| `getData()` | `any` | Get the current JSON data |
| `setData(data)` | `void` | Replace the entire tree with new data |
| `openPasteDialog()` | `void` | Open the "Paste JSON" dialog for the root node |
| `getSelectedNodeId()` | `string \| null` | Get the currently selected node ID |

---

## How Embedded Config Works

The editor uses a **tagged-value** convention to embed field configuration inside JSON. When you configure a node via the side panel, the output JSON looks like this:

```json
{
  "username": {
    "type": "string",
    "value": "zhangsan",
    "label": "用户名",
    "required": true,
    "fieldType": "string",
    "constraint": {
      "minLength": 2,
      "maxLength": 20
    }
  },
  "age": {
    "type": "number",
    "value": 28,
    "label": "年龄",
    "fieldType": "number",
    "constraint": {
      "min": 1,
      "max": 150,
      "numberType": "integer"
    }
  },
  "avatar": {
    "type": "array",
    "attrs": ["a.jpg", "b.png"],
    "label": "头像",
    "fieldType": "upload",
    "constraint": {
      "uploadTotalMaxCount": 3,
      "uploadRules": [
        { "format": "jpg", "maxSize": 2, "maxCount": 2 }
      ]
    }
  },
  "settings": {
    "type": "object",
    "attrs": {
      "theme": { "type": "string", "value": "dark", "label": "主题" }
    }
  }
}
```

- **Primitive types** → `{ type, value, ...config }`
- **Object/Array types** → `{ type, attrs, ...config }`

If a node has no configuration, it serializes as plain JSON (no `type`/`value` wrapper), so your data stays clean by default.

---

## Component Structure

```
JsonEditor           ← Main entry (split view: tree + side panel)
├── JsonNode          ← Recursive tree node (object / array / primitive)
└── FieldConfigDialog  ← Config form (inline panel mode or standalone dialog)
```

### Standalone exports

```ts
import { JsonEditor, JsonNode, FieldConfigDialog } from 'json-schema-editor'
```

You can use `FieldConfigDialog` independently in popup mode by passing `:panel="false"`.

---

## Development

```bash
git clone https://github.com/2910410219/json-schema-editor.git
cd json-schema-editor
npm install
npm run dev
```

---

## License

[MIT](./LICENSE)
