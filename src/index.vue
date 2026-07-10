<template>
	<div class="json-editor-split">
		<div class="tree-panel">
			<div class="tree-root">
				<JsonNode
					:node="rootNode" :depth="0" :is-root="true"
					@change="emitChange"
					@add-requested="openAddChildDialog"
				/>
			</div>
		</div>
		<div v-if="selectNodeId" class="config-sidebar">
			<FieldConfigDialog
				:key="selectNodeId"
				:panel="true"
				:visible="true"
				:form-data="fieldDialog.formData"
				:field-type-options="fieldDialog.typeOptions"
				:has-config="fieldDialog.hasConfig"
				@update:visible="clearSelection"
				@save="handleFieldSave"
				@remove="handleFieldRemove"
			/>
		</div>
		<div v-else class="config-sidebar config-sidebar-empty">
			<div class="config-placeholder">
				<p>选择一个字段</p>
				<p class="config-placeholder-hint">点击字段右侧的齿轮按钮进行配置</p>
			</div>
		</div>
		<el-dialog v-model="showPasteDialog" title="粘贴 JSON" width="560px" :close-on-click-modal="false" destroy-on-close>
			<div class="paste-tip">
				<el-alert type="info" :closable="false" show-icon>
					<template #default>
						将 JSON 字符串粘贴到下方文本框，系统将解析并<strong>替换</strong>当前节点的内容。
						（将替换整个根节点）
					</template>
				</el-alert>
			</div>
			<el-input
				v-model="pasteJsonText"
				type="textarea"
				:rows="12"
				placeholder="例如：&#10;{&#10;  &quot;name&quot;: &quot;test&quot;,&#10;  &quot;age&quot;: 18&#10;}"
				:autosize="{ minRows: 8, maxRows: 24 }"
			/>
			<template #footer>
				<el-button @click="showPasteDialog = false; pasteJsonText = ''">取消</el-button>
				<el-button type="primary" @click="handlePasteJson">解析并替换</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, provide } from 'vue';
import { ElMessage } from 'element-plus';
import JsonNode from './JsonNode.vue';
import FieldConfigDialog from './FieldConfigDialog.vue';

defineOptions({ name: 'JsonEditor' });

const props = defineProps<{ modelValue: any }>();
const emit = defineEmits<{
	(e: 'update:modelValue', value: any): void;
	(e: 'change', value: any): void;
}>();

// --- types ---

interface FieldConfig {
	fieldType?: string;
	label?: string;
	description?: string;
	role?: string;
	isForm?: boolean;
	required?: boolean;
	defaultValue?: string | number;
	options?: string[];
	constraint?: {
		minLength?: number; maxLength?: number; pattern?: string;
		min?: number; max?: number; numberType?: string;
		accept?: string; maxSize?: number; maxCount?: number;
		uploadRules?: Array<{ format: string; maxSize?: number; maxCount?: number }>;
		uploadTotalMaxCount?: number;
		uploadTotalMaxSize?: number;
	};
}

interface JsonNodeData {
	_id: string; key: string; keyEditable: boolean;
	type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
	primitiveValue: string | number | boolean | null;
	children: JsonNodeData[];
	config?: FieldConfig;
}

interface FieldFormData {
	nodeKey: string;
	nodeId: string;
	jsonType: string;
	fieldType: string; label: string; description: string; role: string;
	isForm: boolean; required: boolean; defaultValue: string; options: string[];
	constraint: {
		minLength?: number; maxLength?: number; pattern?: string;
		min?: number; max?: number; numberType?: string;
		accept?: string; maxSize?: number; maxCount?: number;
		uploadRules?: Array<{ format: string; maxSize?: number; maxCount?: number }>;
		uploadTotalMaxCount?: number;
		uploadTotalMaxSize?: number;
	};
	_createParentId?: string;
	_isArrayParent?: boolean;
	_childrenCount?: number;
}

// --- helpers ---

let idCounter = 0;
function genId(): string {
	return `jn_${Date.now()}_${++idCounter}_${Math.random().toString(36).slice(2, 6)}`;
}

function getDefaultPrimitive(type: string): string | number | boolean | null {
	switch (type) {
		case 'number': return 0;
		case 'boolean': return false;
		case 'null': return null;
		default: return '';
	}
}

function valueToNode(value: any, key: string, keyEditable: boolean): JsonNodeData {
	const id = genId();
	if (value === null || value === undefined)
		return { _id: id, key, keyEditable, type: 'null', primitiveValue: null, children: [] };

	// Detect embedded config: { type: '<jsonType>', value/attrs: <actualValue>, ...config }
	if (typeof value === 'object' && !Array.isArray(value) && 'type' in value) {
		const jtype = value.type;
		if (typeof jtype === 'string' && ['string','number','boolean','null','object','array'].includes(jtype)) {
			const dataKey = (jtype === 'object' || jtype === 'array') ? 'attrs' : 'value';
			if (dataKey in value) {
				const rawVal = value[dataKey];
				const cfg = {};
				for (const k of Object.keys(value)) {
					if (k !== 'type' && k !== dataKey) cfg[k] = value[k];
				}
				const hasCfg = Object.keys(cfg).length > 0;
				if (jtype === 'object') {
					const children = rawVal ? Object.entries(rawVal).map(([k, v]) => valueToNode(v, k, true)) : [];
					return { _id: id, key, keyEditable, type: 'object', primitiveValue: null, children, config: hasCfg ? cfg : undefined };
				}
				if (jtype === 'array') {
					const children = Array.isArray(rawVal) ? rawVal.map((item, idx) => valueToNode(item, String(idx), false)) : [];
					return { _id: id, key, keyEditable, type: 'array', primitiveValue: null, children, config: hasCfg ? cfg : undefined };
				}
				return {
					_id: id, key, keyEditable,
					type: jtype as 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array',
					primitiveValue: rawVal ?? getDefaultPrimitive(jtype),
					children: [],
					config: hasCfg ? cfg : undefined,
				};
			}
		}
	}

	if (Array.isArray(value))
		return { _id: id, key, keyEditable, type: 'array', primitiveValue: null, children: value.map((item, idx) => valueToNode(item, String(idx), false)) };
	if (typeof value === 'object')
		return { _id: id, key, keyEditable, type: 'object', primitiveValue: null, children: Object.entries(value).map(([k, v]) => valueToNode(v, k, true)) };
	return { _id: id, key, keyEditable, type: typeof value as 'string' | 'number' | 'boolean', primitiveValue: value, children: [] };
}

function nodeToValue(node: JsonNodeData): any {
	let rawValue: any;
	if (node.type === 'object') { const obj: Record<string, any> = {}; for (const c of node.children) obj[c.key] = nodeToValue(c); rawValue = obj; }
	else if (node.type === 'array') rawValue = node.children.map(c => nodeToValue(c));
	else if (node.type === 'null') rawValue = null;
	else if (node.type === 'number') rawValue = Number(node.primitiveValue);
	else if (node.type === 'boolean') rawValue = node.primitiveValue === true || node.primitiveValue === 'true';
	else rawValue = String(node.primitiveValue);

	if (node.config && hasAnyConfig(node)) {
		const dataKey = (node.type === 'object' || node.type === 'array') ? 'attrs' : 'value';
		return { type: node.type, [dataKey]: rawValue, ...node.config };
	}
	return rawValue;
}

function defaultFormType(jsonType: string): string {
	const m: Record<string, string> = { string: 'string', number: 'number', boolean: 'switch' };
	return m[jsonType] || 'string';
}

// --- paste JSON ---

const showPasteDialog = ref(false);
const pasteJsonText = ref('');
const pastingNodeId = ref<string | null>(null);

function openPasteDialog(nodeId: string | null) {
	pastingNodeId.value = nodeId;
	pasteJsonText.value = '';
	showPasteDialog.value = true;
}

function handlePasteJson() {
	const text = pasteJsonText.value.trim();
	if (!text) { ElMessage.warning('请粘贴 JSON 内容'); return; }
	try {
		const parsed = JSON.parse(text);

		if (pastingNodeId.value) {
			const node = findNodeById(pastingNodeId.value);
			if (!node || (node.type !== 'object' && node.type !== 'array')) {
				ElMessage.warning('只能在对象或数组节点上粘贴 JSON');
				return;
			}
			if (Array.isArray(parsed)) {
				node.type = 'array';
				node.children = parsed.map((item, idx) => valueToNode(item, String(idx), false));
			} else if (typeof parsed === 'object' && parsed !== null) {
				node.type = 'object';
				node.children = Object.entries(parsed).map(([k, v]) => valueToNode(v, k, true));
			} else {
				ElMessage.warning('粘贴的内容必须是对象或数组');
				return;
			}
		} else {
			rootNode.value = valueToNode(parsed, '', false);
		}

		showPasteDialog.value = false;
		pasteJsonText.value = '';
		emitChange();
	} catch (e: any) {
		ElMessage.error('JSON 格式错误: ' + (e.message || ''));
	}
}

// --- field config dialog ---

const typeOptionList: { label: string; value: string }[] = [
	{ label: '文本框', value: 'string' },
	{ label: '多行文本', value: 'textarea' },
	{ label: '数字输入', value: 'number' },
	{ label: '开关', value: 'switch' },
	{ label: '下拉选择', value: 'select' },
	{ label: '文件上传', value: 'upload' },
];

const selectNodeId = ref<string | null>(null);

const fieldDialog = ref({
	visible: false,
	formData: null as FieldFormData | null,
	typeOptions: [] as { label: string; value: string }[],
	hasConfig: false,
});

function clearSelection() {
	selectNodeId.value = null;
	fieldDialog.value.visible = false;
	fieldDialog.value.formData = null;
}

/** Extract FieldConfig from form data */
function formToConfig(form: FieldFormData): FieldConfig {
	const cfg: FieldConfig = {};
	if (form.label) cfg.label = form.label;
	if (form.description) cfg.description = form.description;
	if (form.fieldType && form.fieldType !== defaultFormType(form.jsonType)) cfg.fieldType = form.fieldType;
	if (form.role) cfg.role = form.role;
	if (!form.isForm) cfg.isForm = false;
	if (form.required) cfg.required = true;
	if (form.defaultValue) cfg.defaultValue = form.jsonType === 'number' ? Number(form.defaultValue) : form.defaultValue;
	if (form.options?.length > 0) cfg.options = [...form.options];
	const hasC = Object.values(form.constraint).some((v: any) => {
		if (Array.isArray(v)) return v.length > 0;
		return v !== undefined && v !== null && v !== '';
	});
	if (hasC) {
		cfg.constraint = { ...form.constraint };
		if (cfg.constraint.uploadRules) {
			cfg.constraint.uploadRules = cfg.constraint.uploadRules.map(r => ({ ...r }));
		}
	}
	return cfg;
}

/** Check if a node has any meaningful config */
function hasAnyConfig(node: JsonNodeData): boolean {
	const c = node.config;
	if (!c) return false;
	return !!(c.label || c.description || c.fieldType || c.role || c.isForm === false || c.required || c.defaultValue || c.options?.length || (c.constraint && Object.keys(c.constraint).length > 0));
}

/** Open dialog in edit mode for an existing node */
function openFieldDialog(nodeId: string) {
	const node = findNodeById(nodeId);
	if (!node) return;
	const cfg = node.config || {};
	fieldDialog.value = {
		visible: true,
		typeOptions: typeOptionList,
		hasConfig: hasAnyConfig(node),
		formData: {
			nodeId: node._id,
			nodeKey: node.key,
			jsonType: node.type,
			fieldType: cfg.fieldType || defaultFormType(node.type),
			label: cfg.label || '',
			description: cfg.description || '',
			role: cfg.role || '',
			isForm: cfg.isForm ?? true,
			required: cfg.required ?? false,
			defaultValue: String(cfg.defaultValue ?? ''),
			options: cfg.options || [],
			constraint: cfg.constraint ? { ...cfg.constraint } : {},
			_childrenCount: node.children.length,
		},
	};
	selectNodeId.value = nodeId;
}

provide('onOpenFieldDialog', openFieldDialog);

/** Open dialog in create mode for adding a new child to a parent node */
function openAddChildDialog(parentNodeId: string) {
	const parent = findNodeById(parentNodeId);
	if (!parent || (parent.type !== 'object' && parent.type !== 'array')) return;

	const isArray = parent.type === 'array';
	fieldDialog.value = {
		visible: true,
		typeOptions: typeOptionList,
		hasConfig: false,
		formData: {
			nodeId: '',
			nodeKey: '',
			jsonType: 'string',
			fieldType: 'string',
			label: '',
			description: '',
			role: '',
			isForm: true,
			required: false,
			defaultValue: '',
			options: [],
			constraint: {},
			_createParentId: parentNodeId,
			_isArrayParent: isArray,
			_childrenCount: 0,
		},
	};
	selectNodeId.value = parentNodeId;
}

/** Handle save from the config dialog — supports both create and edit modes */
function handleFieldSave(form: FieldFormData) {
	if (form._createParentId) {
		// --- create mode ---
		const parent = findNodeById(form._createParentId);
		if (!parent || (parent.type !== 'object' && parent.type !== 'array')) return;

		const isArray = parent.type === 'array';
		const newNode: JsonNodeData = {
			_id: genId(),
			key: isArray ? (form.nodeKey || String(parent.children.length)) : (form.nodeKey || 'newKey'),
			keyEditable: !isArray,
			type: form.jsonType as JsonNodeData['type'],
			primitiveValue: getDefaultPrimitive(form.jsonType),
			children: (form.jsonType === 'object' || form.jsonType === 'array') ? [] : [],
			config: formToConfig(form),
		};

		parent.children.push(newNode);
		fieldDialog.value.visible = false;
		emitChange();
		clearSelection();
	} else {
		// --- edit mode ---
		const node = findNodeById(form.nodeId);
		if (!node) return;

		node.key = form.nodeKey;
		node.type = form.jsonType as JsonNodeData['type'];
		node.config = formToConfig(form);

		if (node.type === 'object' || node.type === 'array') {
			if (!node.children) node.children = [];
		} else {
			node.children = [];
			if (node.primitiveValue === undefined || node.primitiveValue === null || node.type === 'null') {
				node.primitiveValue = getDefaultPrimitive(node.type);
			}
		}

		fieldDialog.value.visible = false;
		emitChange();
		clearSelection();
	}
}

function handleFieldRemove() {
	const form = fieldDialog.value.formData;
	if (!form) return;
	if (form._createParentId) {
		fieldDialog.value.visible = false;
		clearSelection();
		return;
	}
	const node = findNodeById(form.nodeId);
	if (node) {
		delete node.config;
		fieldDialog.value.visible = false;
		emitChange();
		clearSelection();
	}
}

// --- root node management ---

function createDefaultNode(type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array', key: string, keyEditable: boolean): JsonNodeData {
	const id = genId();
	const base = { _id: id, key, keyEditable, children: [] as JsonNodeData[] };
	switch (type) {
		case 'object': return { ...base, type: 'object', primitiveValue: null };
		case 'array': return { ...base, type: 'array', primitiveValue: null };
		case 'null': return { ...base, type: 'null', primitiveValue: null };
		case 'number': return { ...base, type: 'number', primitiveValue: 0 };
		case 'boolean': return { ...base, type: 'boolean', primitiveValue: false };
		default: return { ...base, type: 'string', primitiveValue: '' };
	}
}

const rootNode = ref<JsonNodeData>(createDefaultNode('object', '', false));
let skipNextWatch = false;
watch(() => props.modelValue, (val) => {
	if (skipNextWatch) { skipNextWatch = false; return; }
	rootNode.value = val === undefined || val === null ? createDefaultNode('object', '', false) : valueToNode(val, '', false);
}, { deep: true, immediate: true });

function emitChange() {
	skipNextWatch = true;
	const json = nodeToValue(rootNode.value);
	emit('update:modelValue', json);
	emit('change', json);
}

function findNodeById(nodeId: string, from?: JsonNodeData): JsonNodeData | null {
	const s = (n: JsonNodeData): JsonNodeData | null => {
		if (n._id === nodeId) return n;
		for (const c of n.children) { const f = s(c); if (f) return f; }
		return null;
	};
	return s(from || rootNode.value);
}

defineExpose({
	getData: () => nodeToValue(rootNode.value),
	setData: (d: any) => { rootNode.value = valueToNode(d, '', false); },
	openPasteDialog: () => openPasteDialog(null),
	getSelectedNodeId: () => selectNodeId.value,
});
</script>

<style scoped lang="scss">
.json-editor-split {
	display: flex;
	height: 100%;
	.tree-panel {
		flex: 1;
		min-width: 0;
		overflow: auto;
		.tree-root {
			padding: 4px 0;
		}
	}
	.config-sidebar {
		width: 320px;
		flex-shrink: 0;
		border-left: 1px solid #e2e8f0;
		overflow: hidden;
	}
	.config-sidebar-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		.config-placeholder {
			text-align: center;
			color: #94a3b8;
			font-size: 13px;
			p { margin: 4px 0; }
			.config-placeholder-hint { font-size: 11px; color: #c0c8d4; }
		}
	}
	.paste-tip { margin-bottom: 12px;
		:deep(.el-alert__description) { font-size: 13px; }
	}
}
</style>
