<template>
	<div class="json-node">
		<template v-if="node.type === 'object'">
			<div class="node-row node-row-object" :class="{ 'is-collapsed': collapsed }" :style="{ paddingLeft: depth * 20 + 'px' }">
				<span class="collapse-btn" @click="toggleCollapse">
					<el-icon><CaretRight v-if="collapsed" /><CaretBottom v-else /></el-icon>
				</span>
				<span class="key-label">{{ node.key }}</span>
				<span class="colon">:</span>
				<span class="type-label">object</span>
				<span class="node-badge badge-object">&#123;...&#125;</span>
				<span class="node-count">{{ node.children.length }} 项</span>
				<el-button size="small" text class="node-action-btn always-visible" @click.stop="emit('add-requested', node._id)">
					<el-icon><Plus /></el-icon>
				</el-button>
				<el-button size="small" text class="node-action-btn field-btn" :class="{ 'field-btn-configured': hasConfig(node) }" @click.stop="onOpenFieldDialog?.(node._id)" title="字段配置"><el-icon><Setting /></el-icon></el-button>
				<el-button size="small" text class="node-action-btn copy-btn" @click.stop="copyNodeJson" title="复制 JSON">
					<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
				</el-button>
				<el-button v-if="!isRoot && parentCanDelete" size="small" text class="node-action-btn node-action-delete" @click.stop="deleteSelf">
					<el-icon><Delete /></el-icon>
				</el-button>
				<span v-if="configSummary(node)" class="config-summary">{{ configSummary(node) }}</span>
			</div>
			<div v-show="!collapsed" class="node-children" :style="{ marginLeft: depth * 20 + 18 + 'px' }">
				<JsonNode v-for="child in node.children" :key="child._id" :node="child" :depth="depth + 1" :is-root="false" :parent-type="'object'" :parent-can-delete="true" @delete-node="removeChild(child._id)" @change="emitChange" @add-requested="(id: string) => emit('add-requested', id)" />
			</div>
		</template>

		<template v-else-if="node.type === 'array'">
			<div class="node-row node-row-array" :class="{ 'is-collapsed': collapsed }" :style="{ paddingLeft: depth * 20 + 'px' }">
				<span class="collapse-btn" @click="toggleCollapse">
					<el-icon><CaretRight v-if="collapsed" /><CaretBottom v-else /></el-icon>
				</span>
				<span class="key-label">{{ node.key }}</span>
				<span class="colon">:</span>
				<span class="type-label">array</span>
				<span class="node-badge badge-array">[...]</span>
				<span class="node-count">{{ node.children.length }} 项</span>
				<el-button size="small" text class="node-action-btn always-visible" @click.stop="emit('add-requested', node._id)">
					<el-icon><Plus /></el-icon>
				</el-button>
				<el-button size="small" text class="node-action-btn field-btn" :class="{ 'field-btn-configured': hasConfig(node) }" @click.stop="onOpenFieldDialog?.(node._id)" title="字段配置"><el-icon><Setting /></el-icon></el-button>
				<el-button size="small" text class="node-action-btn copy-btn" @click.stop="copyNodeJson" title="复制 JSON">
					<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
				</el-button>
				<el-button v-if="!isRoot && parentCanDelete" size="small" text class="node-action-btn node-action-delete" @click.stop="deleteSelf">
					<el-icon><Delete /></el-icon>
				</el-button>
				<span v-if="configSummary(node)" class="config-summary">{{ configSummary(node) }}</span>
			</div>
			<div v-show="!collapsed" class="node-children" :style="{ marginLeft: depth * 20 + 18 + 'px' }">
				<JsonNode v-for="child in node.children" :key="child._id" :node="child" :depth="depth + 1" :is-root="false" :parent-type="'array'" :parent-can-delete="true" @delete-node="removeChild(child._id)" @change="emitChange" @add-requested="(id: string) => emit('add-requested', id)" />
			</div>
		</template>

		<template v-else>
			<div class="node-row node-row-primitive" :style="{ paddingLeft: depth * 20 + 'px' }">
				<span class="indent-placeholder" v-if="depth > 0"></span>
				<span class="key-label">{{ node.key }}</span>
				<span class="colon">:</span>
				<span class="type-label">{{ node.type }}</span>
				<el-button size="small" text class="node-action-btn field-btn" :class="{ 'field-btn-configured': hasConfig(node) }" @click.stop="onOpenFieldDialog?.(node._id)" title="字段配置"><el-icon><Setting /></el-icon></el-button>
				<el-button size="small" text class="node-action-btn copy-btn" @click.stop="copyNodeJson" title="复制 JSON">
					<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
				</el-button>
				<el-button v-if="!isRoot && parentCanDelete" size="small" text class="node-action-btn node-action-delete" @click="deleteSelf">
					<el-icon><Delete /></el-icon>
				</el-button>
				<span v-if="configSummary(node)" class="config-summary">{{ configSummary(node) }}</span>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Delete, CaretRight, CaretBottom, Setting } from '@element-plus/icons-vue';

defineOptions({ name: 'JsonNode' });

interface JsonNodeData {
	_id: string; key: string; keyEditable: boolean;
	type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
	primitiveValue: string | number | boolean | null;
	children: JsonNodeData[];
	config?: {
		fieldType?: string;
		label?: string;
		role?: string;
		isForm?: boolean;
		required?: boolean;
		defaultValue?: string | number;
		options?: string[];
		constraint?: Record<string, any>;
	};
}

function hasConfig(node: JsonNodeData): boolean {
	const c = node.config;
	if (!c) return false;
	return !!(c.label || c.fieldType || c.required || c.defaultValue || c.options?.length || c.role || c.isForm === false || (c.constraint && Object.keys(c.constraint).length > 0));
}

function configSummary(node: JsonNodeData): string {
	const c = node.config;
	if (!c) return '';
	const parts: string[] = [];
	if (c.label) parts.push(c.label);
	if (c.required) parts.push('必填');
	if (c.fieldType) {
		const m: Record<string, string> = {
			string: '文本框', textarea: '多行文本', number: '数字',
			switch: '开关', select: '下拉选择', upload: '文件上传'
		};
		parts.push(m[c.fieldType] || c.fieldType);
	}
	if (c.options?.length) parts.push(`${c.options.length}个选项`);
	if (c.defaultValue !== undefined && c.defaultValue !== '' && c.defaultValue !== null) {
		parts.push(`默认=${c.defaultValue}`);
	}
	const con = c.constraint;
	if (con) {
		if (con.minLength || con.maxLength) {
			if (con.minLength && con.maxLength) parts.push(`${con.minLength}-${con.maxLength}字`);
			else if (con.minLength) parts.push(`≥${con.minLength}字`);
			else if (con.maxLength) parts.push(`≤${con.maxLength}字`);
		}
		if (con.min !== undefined || con.max !== undefined) {
			if (con.min !== undefined && con.max !== undefined) parts.push(`${con.min}-${con.max}`);
			else if (con.min !== undefined) parts.push(`≥${con.min}`);
			else if (con.max !== undefined) parts.push(`≤${con.max}`);
		}
		if (con.pattern) parts.push('正则');
		if (con.numberType === 'integer') parts.push('整数');
		if (con.numberType === 'float') parts.push('浮点');
	}
	return parts.join(' · ');
}

const props = defineProps<{
	node: JsonNodeData; depth: number; isRoot?: boolean;
	parentType?: 'object' | 'array' | 'root'; parentCanDelete?: boolean;
}>();

const emit = defineEmits<{
	(e: 'delete-node'): void;
	(e: 'change'): void;
	(e: 'add-requested', parentNodeId: string): void;
}>();
const onOpenFieldDialog = inject<((nodeId: string) => void) | undefined>("onOpenFieldDialog");

const collapsed = ref(false);
function toggleCollapse() { collapsed.value = !collapsed.value; }

function nodeToValue(node: JsonNodeData): any {
	if (node.type === 'object') { const obj: Record<string, any> = {}; for (const c of node.children) obj[c.key] = nodeToValue(c); return obj; }
	if (node.type === 'array') return node.children.map(c => nodeToValue(c));
	if (node.type === 'null') return null;
	if (node.type === 'number') return Number(node.primitiveValue);
	if (node.type === 'boolean') return node.primitiveValue === true || node.primitiveValue === 'true';
	return String(node.primitiveValue);
}

function copyNodeJson() {
	const val = nodeToValue(props.node);
	const json = JSON.stringify(val, null, 2);
	navigator.clipboard.writeText(json).then(() => {
		ElMessage.success('JSON 已复制到剪贴板');
	}).catch(() => {
		// Fallback
		const ta = document.createElement('textarea');
		ta.value = json;
		document.body.appendChild(ta);
		ta.select();
		document.execCommand('copy');
		document.body.removeChild(ta);
		ElMessage.success('JSON 已复制到剪贴板');
	});
}

function removeChild(childId: string) {
	const n = props.node;
	const idx = n.children.findIndex((c) => c._id === childId);
	if (idx === -1) return;
	n.children.splice(idx, 1);
	if (n.type === 'array') {
		n.children.forEach((child, i) => { child.key = String(i); });
	}
	emitChange();
}

function deleteSelf() { emit('delete-node'); }
function emitChange() { emit('change'); }
</script>

<style scoped lang="scss">
.json-node {
	.node-row {
		display: flex; align-items: center; gap: 4px;
		padding: 3px 4px; border-radius: 3px; transition: background 0.15s;
		min-height: 30px; flex-wrap: nowrap;
		&:hover { background: #f5f7fa;
			.node-action-btn:not(.always-visible) { opacity: 1; }
		}
		.collapse-btn {
			display: inline-flex; align-items: center; justify-content: center;
			width: 18px; height: 18px; cursor: pointer; color: #94a3b8;
			flex-shrink: 0; font-size: 12px;
			&:hover { color: #3b82f6; }
		}
		.indent-placeholder { display: inline-block; width: 18px; flex-shrink: 0; }
		.key-label { font-family: 'Consolas', monospace; font-size: 13px; color: #881391; font-weight: 500; white-space: nowrap; min-width: 20px; max-width: 180px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; cursor: default; }
		.colon { color: #94a3b8; font-weight: 600; flex-shrink: 0; margin-right: 2px; }
		.type-label {
			font-family: 'Consolas', monospace; font-size: 11px; color: #64748b;
			background: #f1f5f9; padding: 1px 5px; border-radius: 3px;
			flex-shrink: 0; line-height: 18px;
		}
		.node-badge {
			font-size: 11px; padding: 1px 6px; border-radius: 3px; font-weight: 500; flex-shrink: 0;
			&.badge-object { color: #2563eb; background: #eff6ff; }
			&.badge-array { color: #7c3aed; background: #f5f3ff; }
		}
		.node-count { font-size: 11px; color: #94a3b8; flex-shrink: 0; }
		.config-summary {
			font-size: 11px; color: #64748b; margin-left: auto; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0;
		}
		.field-btn-configured {
			color: #2563eb !important;
		}
		.node-action-btn:not(.always-visible) { opacity: 0; transition: opacity 0.15s; margin-left: 2px; flex-shrink: 0; font-size: 14px; padding: 2px; }
			.node-action-btn.field-btn { opacity: 0.4; }
			.node-row:hover .node-action-btn.field-btn { opacity: 1; }
		.node-action-btn.always-visible { opacity: 1; }
		&:hover .node-action-btn { opacity: 1; }
		.node-action-delete { color: #ef4444; }
	}
	.node-row-object, .node-row-array {
		background: #fafbfc; border: 1px solid transparent;
		&:hover { border-color: #e2e8f0; }
		&.is-collapsed { border-color: transparent; background: transparent; }
	}
	.node-children {
		border-left: 1px solid #e2e8f0;
	}
}
</style>
