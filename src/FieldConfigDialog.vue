<template>
	<!-- panel mode: embedded sidebar -->
	<template v-if="panel">
		<div class="config-panel">
			<div class="config-panel-title">{{ dialogTitle }}</div>
			<div class="config-panel-body">
				<el-form ref="formRef" :model="form" label-width="110px" size="small">
					<el-divider content-position="left">基础信息</el-divider>
					<el-form-item v-if="showKeyField" label="字段英文名">
						<el-input v-model="form.nodeKey" placeholder="字段名称（key）" clearable />
					</el-form-item>
					<el-form-item v-if="!isArrayElement" label="字段中文名">
						<el-input v-model="form.label" placeholder="表单中显示的字段名称" clearable />
					</el-form-item>
					<el-form-item v-if="!isArrayElement" label="字段描述">
						<el-input v-model="form.description" type="textarea" :rows="2" placeholder="此字段的用途说明" clearable />
					</el-form-item>
					<el-form-item label="字段类型">
						<el-select v-model="form.jsonType" @change="onJsonTypeChange">
							<el-option label="字符串" value="string" />
							<el-option label="数字" value="number" />
							<el-option label="布尔" value="boolean" />
							<el-option label="对象" value="object" />
							<el-option label="数组" value="array" />
						</el-select>
						<div class="form-hint">JSON 数据类型</div>
					</el-form-item>
					<el-form-item v-if="jsonTypeIsScalar" label="默认值">
						<template v-if="form.jsonType === 'boolean'">
							<el-select v-model="form.defaultValue" placeholder="选择默认值" clearable>
								<el-option label="true" value="true" />
								<el-option label="false" value="false" />
							</el-select>
						</template>
						<el-input v-else v-model="form.defaultValue" placeholder="留空则无默认值" clearable />
					</el-form-item>
					<template v-if="jsonTypeIsScalar">
						<el-divider content-position="left">表单属性</el-divider>
						<el-form-item label="表单显示">
							<el-switch v-model="form.isForm" />
							<span class="form-hint">{{ form.isForm ? '在表单中展示' : '隐藏字段' }}</span>
						</el-form-item>
							<el-form-item label="表单控件">
								<el-select v-model="form.fieldType" @change="onTypeChange">
									<el-option v-for="opt in fieldTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
								</el-select>
								<div class="form-hint">此字段在表单中以什么组件展示</div>
							</el-form-item>
							<el-form-item label="必填项">
								<el-switch v-model="form.required" />
							</el-form-item>
						<el-divider content-position="left">约束规则</el-divider>
						<el-form-item v-if="form.fieldType === 'select'" label="选项列表">
							<div class="options-editor">
								<div v-for="(opt, idx) in form.options" :key="idx" class="option-row">
									<el-input v-model="form.options[idx]" size="small" placeholder="选项值" />
									<el-button size="small" text type="danger" @click="form.options.splice(idx, 1)">×</el-button>
								</div>
								<el-button size="small" class="add-option-btn" @click="form.options.push('')"><el-icon><Plus /></el-icon> 添加选项</el-button>
							</div>
						</el-form-item>
						<template v-if="form.fieldType === 'string' || form.fieldType === 'textarea'">
							<el-form-item label="最小长度"><el-input-number v-model="form.constraint.minLength" :min="0" :step="100" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
							<el-form-item label="最大长度"><el-input-number v-model="form.constraint.maxLength" :min="0" :step="1000" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
							<el-form-item label="正则验证"><el-input v-model="form.constraint.pattern" placeholder="如 ^https?://" clearable /></el-form-item>
						</template>
						<template v-if="form.fieldType === 'upload'">
							<el-form-item label="总数量"><el-input-number v-model="form.constraint.uploadTotalMaxCount" :min="1" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
							<el-form-item label="总容量(MB)"><el-input-number v-model="form.constraint.uploadTotalMaxSize" :min="1" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
							<el-divider content-position="left">按格式限制（可选）</el-divider>
							<div class="upload-rules">
								<div v-for="(rule, idx) in uploadRules" :key="idx" class="upload-rule-row">
									<el-input v-model="rule.format" size="small" placeholder="格式（如 jpg）" style="width:90px" />
									<el-input-number v-model="rule.maxSize" :min="1" controls-position="right" size="small" placeholder="大小(MB)" style="width:140px" />
									<el-input-number v-model="rule.maxCount" :min="1" controls-position="right" size="small" placeholder="数量" style="width:110px" />
									<el-button size="small" text type="danger" @click="removeUploadRule(idx)">×</el-button>
								</div>
								<el-button size="small" class="add-rule-btn" @click="addUploadRule"><el-icon><Plus /></el-icon> 添加规则</el-button>
							</div>
						</template>
						<template v-if="form.fieldType === 'number'">
							<el-form-item label="最小值"><el-input-number v-model="form.constraint.min" :min="Number.MIN_SAFE_INTEGER" :max="Number.MAX_SAFE_INTEGER" controls-position="right" style="width:100%" /></el-form-item>
							<el-form-item label="最大值"><el-input-number v-model="form.constraint.max" :min="Number.MIN_SAFE_INTEGER" :max="Number.MAX_SAFE_INTEGER" controls-position="right" style="width:100%" /></el-form-item>
							<el-form-item label="数值类型"><el-select v-model="form.constraint.numberType" clearable placeholder="不限"><el-option label="整数" value="integer" /><el-option label="浮点数" value="float" /></el-select></el-form-item>
						</template>
					</template>
				</el-form>
			</div>
			<div class="config-panel-actions">
				<el-button :disabled="!hasConfig" @click="handleRemove">清除配置</el-button>
				<el-button @click="handleCancel">关闭</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</div>
		</div>
	</template>
	<!-- dialog mode: popup overlay -->
	<template v-else>
		<el-dialog
			:model-value="visible"
			:title="dialogTitle"
			width="560px"
			:close-on-click-modal="false"
			destroy-on-close
			@update:model-value="$emit('update:visible', $event)"
			@closed="handleClosed"
		>
			<el-form ref="formRef" :model="form" label-width="110px" size="small">
				<el-divider content-position="left">基础信息</el-divider>
				<el-form-item v-if="showKeyField" label="字段英文名">
					<el-input v-model="form.nodeKey" placeholder="字段名称（key）" clearable />
				</el-form-item>
				<el-form-item v-if="!isArrayElement" label="字段中文名">
					<el-input v-model="form.label" placeholder="表单中显示的字段名称" clearable />
				</el-form-item>
				<el-form-item v-if="!isArrayElement" label="字段描述">
					<el-input v-model="form.description" type="textarea" :rows="2" placeholder="此字段的用途说明" clearable />
				</el-form-item>
				<el-form-item label="字段类型">
					<el-select v-model="form.jsonType" @change="onJsonTypeChange">
						<el-option label="字符串" value="string" />
						<el-option label="数字" value="number" />
						<el-option label="布尔" value="boolean" />
						<el-option label="对象" value="object" />
						<el-option label="数组" value="array" />
					</el-select>
					<div class="form-hint">JSON 数据类型</div>
				</el-form-item>
				<el-form-item v-if="jsonTypeIsScalar" label="默认值">
						<template v-if="form.jsonType === 'boolean'">
							<el-select v-model="form.defaultValue" placeholder="选择默认值" clearable>
								<el-option label="true" value="true" />
								<el-option label="false" value="false" />
							</el-select>
						</template>
						<el-input v-else v-model="form.defaultValue" placeholder="留空则无默认值" clearable />
				</el-form-item>
				<template v-if="jsonTypeIsScalar">
					<el-divider content-position="left">表单属性</el-divider>
					<el-form-item label="表单显示">
						<el-switch v-model="form.isForm" />
						<span class="form-hint">{{ form.isForm ? '在表单中展示' : '隐藏字段' }}</span>
					</el-form-item>
						<el-form-item label="表单控件">
							<el-select v-model="form.fieldType" @change="onTypeChange">
								<el-option v-for="opt in fieldTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
							</el-select>
							<div class="form-hint">此字段在表单中以什么组件展示</div>
						</el-form-item>
						<el-form-item label="必填项">
							<el-switch v-model="form.required" />
						</el-form-item>
					<el-divider content-position="left">约束规则</el-divider>
					<el-form-item v-if="form.fieldType === 'select'" label="选项列表">
						<div class="options-editor">
							<div v-for="(opt, idx) in form.options" :key="idx" class="option-row">
								<el-input v-model="form.options[idx]" size="small" placeholder="选项值" />
								<el-button size="small" text type="danger" @click="form.options.splice(idx, 1)">×</el-button>
							</div>
							<el-button size="small" class="add-option-btn" @click="form.options.push('')"><el-icon><Plus /></el-icon> 添加选项</el-button>
						</div>
					</el-form-item>
					<template v-if="form.fieldType === 'string' || form.fieldType === 'textarea'">
						<el-form-item label="最小长度"><el-input-number v-model="form.constraint.minLength" :min="0" :step="100" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
						<el-form-item label="最大长度"><el-input-number v-model="form.constraint.maxLength" :min="0" :step="1000" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
						<el-form-item label="正则验证"><el-input v-model="form.constraint.pattern" placeholder="如 ^https?://" clearable /></el-form-item>
					</template>
					<template v-if="form.fieldType === 'upload'">
						<el-form-item label="总数量"><el-input-number v-model="form.constraint.uploadTotalMaxCount" :min="1" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
						<el-form-item label="总容量(MB)"><el-input-number v-model="form.constraint.uploadTotalMaxSize" :min="1" controls-position="right" placeholder="不限" style="width:100%" /></el-form-item>
						<el-divider content-position="left">按格式限制（可选）</el-divider>
						<div class="upload-rules">
							<div v-for="(rule, idx) in uploadRules" :key="idx" class="upload-rule-row">
								<el-input v-model="rule.format" size="small" placeholder="格式（如 jpg）" style="width:90px" />
								<el-input-number v-model="rule.maxSize" :min="1" controls-position="right" size="small" placeholder="大小(MB)" style="width:140px" />
								<el-input-number v-model="rule.maxCount" :min="1" controls-position="right" size="small" placeholder="数量" style="width:110px" />
								<el-button size="small" text type="danger" @click="removeUploadRule(idx)">×</el-button>
							</div>
							<el-button size="small" class="add-rule-btn" @click="addUploadRule"><el-icon><Plus /></el-icon> 添加规则</el-button>
						</div>
					</template>
					<template v-if="form.fieldType === 'number'">
						<el-form-item label="最小值"><el-input-number v-model="form.constraint.min" :min="Number.MIN_SAFE_INTEGER" :max="Number.MAX_SAFE_INTEGER" controls-position="right" style="width:100%" /></el-form-item>
						<el-form-item label="最大值"><el-input-number v-model="form.constraint.max" :min="Number.MIN_SAFE_INTEGER" :max="Number.MAX_SAFE_INTEGER" controls-position="right" style="width:100%" /></el-form-item>
						<el-form-item label="数值类型"><el-select v-model="form.constraint.numberType" clearable placeholder="不限"><el-option label="整数" value="integer" /><el-option label="浮点数" value="float" /></el-select></el-form-item>
					</template>
				</template>
			</el-form>
			<template #footer>
				<el-button :disabled="!hasConfig" @click="handleRemove">清除配置</el-button>
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSave">保存</el-button>
			</template>
		</el-dialog>
	</template>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

interface UploadRule { format: string; maxSize?: number; maxCount?: number; }

interface FieldFormData {
	nodeKey: string; nodeId: string; jsonType: string; fieldType: string;
	label: string; description: string; role: string;
	isForm: boolean; required: boolean; defaultValue: string; options: string[];
	constraint: {
		minLength?: number; maxLength?: number; pattern?: string;
		min?: number; max?: number; numberType?: string;
		accept?: string; maxSize?: number; maxCount?: number;
		uploadRules?: UploadRule[]; uploadTotalMaxCount?: number; uploadTotalMaxSize?: number;
	};
	_createParentId?: string; _isArrayParent?: boolean; _childrenCount?: number;
}

const props = defineProps<{
	visible: boolean;
	formData: FieldFormData | null;
	fieldTypeOptions: { label: string; value: string }[];
	hasConfig: boolean;
	panel?: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:visible', v: boolean): void;
	(e: 'save', form: FieldFormData): void;
	(e: 'remove'): void;
}>();

const form = reactive<FieldFormData>({
	nodeKey: '', nodeId: '', jsonType: 'string', fieldType: 'string',
	label: '', description: '', role: '',
	isForm: true, required: false, defaultValue: '', options: [], constraint: {},
});

const uploadRules = ref<UploadRule[]>([]);
const prevJsonType = ref('');

const isCreateMode = computed(() => !!form._createParentId);
const jsonTypeIsScalar = computed(() => form.jsonType !== 'object' && form.jsonType !== 'array');
const isArrayElement = computed(() => isCreateMode.value && form._isArrayParent);
const showKeyField = computed(() => !isArrayElement.value);
const dialogTitle = computed(() => {
	return isCreateMode.value
		? (form._isArrayParent ? '添加元素' : '添加字段 —— ' + (form.nodeKey || '新字段'))
		: '字段配置 —— ' + form.nodeKey;
});

function resetForm() {
	form.nodeKey = ''; form.nodeId = ''; form.jsonType = 'string'; form.fieldType = 'string';
	form.label = ''; form.description = ''; form.role = '';
	form.isForm = true; form.required = false; form.defaultValue = '';
	form.options = []; form.constraint = {};
	// @ts-ignore
	form._createParentId = undefined; form._isArrayParent = false;
	uploadRules.value = [];
}

function loadForm(data: FieldFormData | null) {
	resetForm();
	if (!data) return;
	form.nodeId = data.nodeId; form.nodeKey = data.nodeKey || '';
	prevJsonType.value = data.jsonType || 'string';
	form.jsonType = data.jsonType || 'string'; form.fieldType = data.fieldType;
	form.label = data.label || ''; form.description = data.description || ''; form.role = data.role || '';
	form.isForm = data.isForm ?? true; form.required = data.required || false;
	form.defaultValue = data.defaultValue || '';
	form.options = data.options ? [...data.options] : [];
	form.constraint = data.constraint ? { ...data.constraint } : {};
	// @ts-ignore
	form._createParentId = data._createParentId; form._isArrayParent = data._isArrayParent ?? false;
	// @ts-ignore
	form._childrenCount = data._childrenCount ?? 0;
	if (data.constraint?.uploadRules?.length) {
		uploadRules.value = data.constraint.uploadRules.map((r) => ({ ...r }));
	} else if (data.constraint?.accept) {
		const formats = data.constraint.accept.split(',').map((s) => s.trim()).filter(Boolean);
		if (formats.length) {
			uploadRules.value = formats.map((f) => ({ format: f, maxSize: data.constraint?.maxSize, maxCount: data.constraint?.maxCount }));
		}
	}
}

function syncUploadRulesToConstraint() {
	if (uploadRules.value.some((r) => r.format)) {
		form.constraint.uploadRules = uploadRules.value.filter((r) => r.format).map((r) => ({ ...r }));
	} else { delete form.constraint.uploadRules; }
}

function addUploadRule() { uploadRules.value.push({ format: '', maxSize: undefined, maxCount: undefined }); }
function removeUploadRule(idx: number) { uploadRules.value.splice(idx, 1); }

async function onJsonTypeChange(val: string) {
	const childrenCount = (form as any)._childrenCount || 0;
	const prevType = prevJsonType.value;
	const m: Record<string, string> = { string: 'string', number: 'number', boolean: 'switch', null: 'string', object: 'string', array: 'string' };
	form.fieldType = m[val] || 'string';
	if (!form._createParentId && childrenCount > 0 && prevType && prevType !== val) {
		try {
			await ElMessageBox.confirm('更改字段类型将删除该节点下所有子节点数据，是否继续？', '确认操作', {
				confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning', draggable: true,
			});
			prevJsonType.value = val;
		} catch {
			form.jsonType = prevType;
		}
	} else { prevJsonType.value = val; }
}

function onTypeChange() {
	if (form.fieldType !== 'upload') {
		delete form.constraint.accept; delete form.constraint.maxSize; delete form.constraint.maxCount;
		delete form.constraint.uploadRules; uploadRules.value = [];
	}
	if (form.fieldType !== 'string' && form.fieldType !== 'textarea') {
		delete form.constraint.minLength; delete form.constraint.maxLength; delete form.constraint.pattern;
	}
	if (form.fieldType !== 'number') {
		delete form.constraint.min; delete form.constraint.max; delete form.constraint.numberType;
	}
}

watch(() => props.visible, (val) => { if (val) loadForm(props.formData); }, { immediate: true });

function handleSave() {
	syncUploadRulesToConstraint();
	emit('save', { ...form, constraint: { ...form.constraint } });
}
function handleRemove() { emit('remove'); }
function handleCancel() { emit('update:visible', false); }
function handleClosed() { resetForm(); }
</script>

<style scoped lang="scss">
.config-panel {
	height: 100%; display: flex; flex-direction: column;
	.config-panel-title {
		font-size: 14px; font-weight: 600; color: #333;
		padding: 12px 16px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
	}
	.config-panel-body {
		flex: 1; overflow-y: auto; padding: 12px 16px;
		:deep(.el-divider__text) { font-size: 12px; }
	}
	.config-panel-actions {
		display: flex; gap: 8px; justify-content: flex-end;
		padding: 12px 16px; border-top: 1px solid #e2e8f0; flex-shrink: 0;
	}
}
.form-hint { font-size: 11px; color: #94a3b8; margin-left: 8px; }
.options-editor { width: 100%;
	.option-row { display: flex; gap: 4px; margin-bottom: 4px; }
	.add-option-btn { font-size: 12px; margin-top: 4px; }
}
.upload-rules { width: 100%;
	.upload-rule-row { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
	.add-rule-btn { font-size: 12px; margin-top: 2px; }
}
:deep(.el-form-item) { margin-bottom: 12px; }
</style>
