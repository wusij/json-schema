declare module 'json-schema-editor' {
  import type { DefineComponent } from 'vue'

  export const JsonEditor: DefineComponent<
    { modelValue?: any },
    { 'update:modelValue': (value: any) => void; change: (value: any) => void },
    any
  >
  export const JsonNode: DefineComponent<any, any, any>
  export const FieldConfigDialog: DefineComponent<any, any, any>
}
