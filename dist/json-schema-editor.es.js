import { defineComponent as pe, inject as ge, ref as X, resolveComponent as A, openBlock as u, createElementBlock as v, Fragment as z, createElementVNode as c, normalizeStyle as te, normalizeClass as ne, createVNode as l, withCtx as i, createBlock as N, unref as F, toDisplayString as q, withModifiers as K, createCommentVNode as V, withDirectives as fe, renderList as Q, vShow as ce, reactive as Ve, computed as oe, watch as ve, createTextVNode as C, provide as he } from "vue";
import { ElMessage as Z, ElMessageBox as xe } from "element-plus";
import { CaretRight as ye, CaretBottom as be, Plus as ee, Setting as ue, Delete as re } from "@element-plus/icons-vue";
const Ce = { class: "json-node" }, Te = { class: "key-label" }, ke = { class: "node-count" }, je = {
  key: 1,
  class: "config-summary"
}, we = { class: "key-label" }, Ne = { class: "node-count" }, Se = {
  key: 1,
  class: "config-summary"
}, Ue = {
  key: 0,
  class: "indent-placeholder"
}, ze = { class: "key-label" }, $e = { class: "type-label" }, Fe = {
  key: 2,
  class: "config-summary"
}, Ae = /* @__PURE__ */ pe({
  name: "JsonNode",
  __name: "JsonNode",
  props: {
    node: {},
    depth: {},
    isRoot: { type: Boolean },
    parentType: {},
    parentCanDelete: { type: Boolean }
  },
  emits: ["delete-node", "change", "add-requested"],
  setup(r, { emit: Y }) {
    function B(k) {
      var f;
      const s = k.config;
      return s ? !!(s.label || s.fieldType || s.required || s.defaultValue || (f = s.options) != null && f.length || s.role || s.isForm === !1 || s.constraint && Object.keys(s.constraint).length > 0) : !1;
    }
    function _(k) {
      var j;
      const s = k.config;
      if (!s) return "";
      const f = [];
      if (s.label && f.push(s.label), s.required && f.push("必填"), s.fieldType) {
        const w = {
          string: "文本框",
          textarea: "多行文本",
          number: "数字",
          switch: "开关",
          select: "下拉选择",
          upload: "文件上传"
        };
        f.push(w[s.fieldType] || s.fieldType);
      }
      (j = s.options) != null && j.length && f.push(`${s.options.length}个选项`), s.defaultValue !== void 0 && s.defaultValue !== "" && s.defaultValue !== null && f.push(`默认=${s.defaultValue}`);
      const p = s.constraint;
      return p && ((p.minLength || p.maxLength) && (p.minLength && p.maxLength ? f.push(`${p.minLength}-${p.maxLength}字`) : p.minLength ? f.push(`≥${p.minLength}字`) : p.maxLength && f.push(`≤${p.maxLength}字`)), (p.min !== void 0 || p.max !== void 0) && (p.min !== void 0 && p.max !== void 0 ? f.push(`${p.min}-${p.max}`) : p.min !== void 0 ? f.push(`≥${p.min}`) : p.max !== void 0 && f.push(`≤${p.max}`)), p.pattern && f.push("正则"), p.numberType === "integer" && f.push("整数"), p.numberType === "float" && f.push("浮点")), f.join(" · ");
    }
    const e = r, $ = Y, J = ge("onOpenFieldDialog"), R = X(!1);
    function I() {
      R.value = !R.value;
    }
    function E(k) {
      if (k.type === "object") {
        const s = {};
        for (const f of k.children) s[f.key] = E(f);
        return s;
      }
      return k.type === "array" ? k.children.map((s) => E(s)) : k.type === "null" ? null : k.type === "number" ? Number(k.primitiveValue) : k.type === "boolean" ? k.primitiveValue === !0 || k.primitiveValue === "true" : String(k.primitiveValue);
    }
    function H() {
      const k = E(e.node), s = JSON.stringify(k, null, 2);
      navigator.clipboard.writeText(s).then(() => {
        Z.success("JSON 已复制到剪贴板");
      }).catch(() => {
        const f = document.createElement("textarea");
        f.value = s, document.body.appendChild(f), f.select(), document.execCommand("copy"), document.body.removeChild(f), Z.success("JSON 已复制到剪贴板");
      });
    }
    function P(k) {
      const s = e.node, f = s.children.findIndex((p) => p._id === k);
      f !== -1 && (s.children.splice(f, 1), s.type === "array" && s.children.forEach((p, j) => {
        p.key = String(j);
      }), G());
    }
    function L() {
      $("delete-node");
    }
    function G() {
      $("change");
    }
    return (k, s) => {
      const f = A("el-icon"), p = A("el-button"), j = A("JsonNode", !0);
      return u(), v("div", Ce, [
        r.node.type === "object" ? (u(), v(z, { key: 0 }, [
          c("div", {
            class: ne(["node-row node-row-object", { "is-collapsed": R.value }]),
            style: te({ paddingLeft: r.depth * 20 + "px" })
          }, [
            c("span", {
              class: "collapse-btn",
              onClick: I
            }, [
              l(f, null, {
                default: i(() => [
                  R.value ? (u(), N(F(ye), { key: 0 })) : (u(), N(F(be), { key: 1 }))
                ]),
                _: 1
              })
            ]),
            c("span", Te, q(r.node.key), 1),
            s[8] || (s[8] = c("span", { class: "colon" }, ":", -1)),
            s[9] || (s[9] = c("span", { class: "type-label" }, "object", -1)),
            s[10] || (s[10] = c("span", { class: "node-badge badge-object" }, "{...}", -1)),
            c("span", ke, q(r.node.children.length) + " 项", 1),
            l(p, {
              size: "small",
              text: "",
              class: "node-action-btn always-visible",
              onClick: s[0] || (s[0] = K((w) => $("add-requested", r.node._id), ["stop"]))
            }, {
              default: i(() => [
                l(f, null, {
                  default: i(() => [
                    l(F(ee))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            l(p, {
              size: "small",
              text: "",
              class: ne(["node-action-btn field-btn", { "field-btn-configured": B(r.node) }]),
              onClick: s[1] || (s[1] = K((w) => {
                var U;
                return (U = F(J)) == null ? void 0 : U(r.node._id);
              }, ["stop"])),
              title: "字段配置"
            }, {
              default: i(() => [
                l(f, null, {
                  default: i(() => [
                    l(F(ue))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["class"]),
            l(p, {
              size: "small",
              text: "",
              class: "node-action-btn copy-btn",
              onClick: K(H, ["stop"]),
              title: "复制 JSON"
            }, {
              default: i(() => [...s[7] || (s[7] = [
                c("svg", {
                  viewBox: "0 0 24 24",
                  width: "14",
                  height: "14",
                  fill: "currentColor"
                }, [
                  c("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" })
                ], -1)
              ])]),
              _: 1
            }),
            !r.isRoot && r.parentCanDelete ? (u(), N(p, {
              key: 0,
              size: "small",
              text: "",
              class: "node-action-btn node-action-delete",
              onClick: K(L, ["stop"])
            }, {
              default: i(() => [
                l(f, null, {
                  default: i(() => [
                    l(F(re))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })) : V("", !0),
            _(r.node) ? (u(), v("span", je, q(_(r.node)), 1)) : V("", !0)
          ], 6),
          fe(c("div", {
            class: "node-children",
            style: te({ marginLeft: r.depth * 20 + 18 + "px" })
          }, [
            (u(!0), v(z, null, Q(r.node.children, (w) => (u(), N(j, {
              key: w._id,
              node: w,
              depth: r.depth + 1,
              "is-root": !1,
              "parent-type": "object",
              "parent-can-delete": !0,
              onDeleteNode: (U) => P(w._id),
              onChange: G,
              onAddRequested: s[2] || (s[2] = (U) => $("add-requested", U))
            }, null, 8, ["node", "depth", "onDeleteNode"]))), 128))
          ], 4), [
            [ce, !R.value]
          ])
        ], 64)) : r.node.type === "array" ? (u(), v(z, { key: 1 }, [
          c("div", {
            class: ne(["node-row node-row-array", { "is-collapsed": R.value }]),
            style: te({ paddingLeft: r.depth * 20 + "px" })
          }, [
            c("span", {
              class: "collapse-btn",
              onClick: I
            }, [
              l(f, null, {
                default: i(() => [
                  R.value ? (u(), N(F(ye), { key: 0 })) : (u(), N(F(be), { key: 1 }))
                ]),
                _: 1
              })
            ]),
            c("span", we, q(r.node.key), 1),
            s[12] || (s[12] = c("span", { class: "colon" }, ":", -1)),
            s[13] || (s[13] = c("span", { class: "type-label" }, "array", -1)),
            s[14] || (s[14] = c("span", { class: "node-badge badge-array" }, "[...]", -1)),
            c("span", Ne, q(r.node.children.length) + " 项", 1),
            l(p, {
              size: "small",
              text: "",
              class: "node-action-btn always-visible",
              onClick: s[3] || (s[3] = K((w) => $("add-requested", r.node._id), ["stop"]))
            }, {
              default: i(() => [
                l(f, null, {
                  default: i(() => [
                    l(F(ee))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            l(p, {
              size: "small",
              text: "",
              class: ne(["node-action-btn field-btn", { "field-btn-configured": B(r.node) }]),
              onClick: s[4] || (s[4] = K((w) => {
                var U;
                return (U = F(J)) == null ? void 0 : U(r.node._id);
              }, ["stop"])),
              title: "字段配置"
            }, {
              default: i(() => [
                l(f, null, {
                  default: i(() => [
                    l(F(ue))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["class"]),
            l(p, {
              size: "small",
              text: "",
              class: "node-action-btn copy-btn",
              onClick: K(H, ["stop"]),
              title: "复制 JSON"
            }, {
              default: i(() => [...s[11] || (s[11] = [
                c("svg", {
                  viewBox: "0 0 24 24",
                  width: "14",
                  height: "14",
                  fill: "currentColor"
                }, [
                  c("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" })
                ], -1)
              ])]),
              _: 1
            }),
            !r.isRoot && r.parentCanDelete ? (u(), N(p, {
              key: 0,
              size: "small",
              text: "",
              class: "node-action-btn node-action-delete",
              onClick: K(L, ["stop"])
            }, {
              default: i(() => [
                l(f, null, {
                  default: i(() => [
                    l(F(re))
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })) : V("", !0),
            _(r.node) ? (u(), v("span", Se, q(_(r.node)), 1)) : V("", !0)
          ], 6),
          fe(c("div", {
            class: "node-children",
            style: te({ marginLeft: r.depth * 20 + 18 + "px" })
          }, [
            (u(!0), v(z, null, Q(r.node.children, (w) => (u(), N(j, {
              key: w._id,
              node: w,
              depth: r.depth + 1,
              "is-root": !1,
              "parent-type": "array",
              "parent-can-delete": !0,
              onDeleteNode: (U) => P(w._id),
              onChange: G,
              onAddRequested: s[5] || (s[5] = (U) => $("add-requested", U))
            }, null, 8, ["node", "depth", "onDeleteNode"]))), 128))
          ], 4), [
            [ce, !R.value]
          ])
        ], 64)) : (u(), v("div", {
          key: 2,
          class: "node-row node-row-primitive",
          style: te({ paddingLeft: r.depth * 20 + "px" })
        }, [
          r.depth > 0 ? (u(), v("span", Ue)) : V("", !0),
          c("span", ze, q(r.node.key), 1),
          s[16] || (s[16] = c("span", { class: "colon" }, ":", -1)),
          c("span", $e, q(r.node.type), 1),
          l(p, {
            size: "small",
            text: "",
            class: ne(["node-action-btn field-btn", { "field-btn-configured": B(r.node) }]),
            onClick: s[6] || (s[6] = K((w) => {
              var U;
              return (U = F(J)) == null ? void 0 : U(r.node._id);
            }, ["stop"])),
            title: "字段配置"
          }, {
            default: i(() => [
              l(f, null, {
                default: i(() => [
                  l(F(ue))
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["class"]),
          l(p, {
            size: "small",
            text: "",
            class: "node-action-btn copy-btn",
            onClick: K(H, ["stop"]),
            title: "复制 JSON"
          }, {
            default: i(() => [...s[15] || (s[15] = [
              c("svg", {
                viewBox: "0 0 24 24",
                width: "14",
                height: "14",
                fill: "currentColor"
              }, [
                c("path", { d: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" })
              ], -1)
            ])]),
            _: 1
          }),
          !r.isRoot && r.parentCanDelete ? (u(), N(p, {
            key: 1,
            size: "small",
            text: "",
            class: "node-action-btn node-action-delete",
            onClick: L
          }, {
            default: i(() => [
              l(f, null, {
                default: i(() => [
                  l(F(re))
                ]),
                _: 1
              })
            ]),
            _: 1
          })) : V("", !0),
          _(r.node) ? (u(), v("span", Fe, q(_(r.node)), 1)) : V("", !0)
        ], 4))
      ]);
    };
  }
}), me = (r, Y) => {
  const B = r.__vccOpts || r;
  for (const [_, e] of Y)
    B[_] = e;
  return B;
}, Ie = /* @__PURE__ */ me(Ae, [["__scopeId", "data-v-3ee129e7"]]), De = {
  key: 0,
  class: "config-panel"
}, Re = { class: "config-panel-title" }, Oe = { class: "config-panel-body" }, _e = { class: "form-hint" }, Ee = { class: "options-editor" }, Me = { class: "upload-rules" }, Le = { class: "config-panel-actions" }, Je = { class: "form-hint" }, qe = { class: "options-editor" }, Be = { class: "upload-rules" }, Pe = /* @__PURE__ */ pe({
  __name: "FieldConfigDialog",
  props: {
    visible: { type: Boolean },
    formData: {},
    fieldTypeOptions: {},
    hasConfig: { type: Boolean },
    panel: { type: Boolean }
  },
  emits: ["update:visible", "save", "remove"],
  setup(r, { emit: Y }) {
    const B = r, _ = Y, e = Ve({
      nodeKey: "",
      nodeId: "",
      jsonType: "string",
      fieldType: "string",
      label: "",
      description: "",
      role: "",
      isForm: !0,
      required: !1,
      defaultValue: "",
      options: [],
      constraint: {}
    }), $ = X([]), J = X(""), R = oe(() => !!e._createParentId), I = oe(() => e.jsonType !== "object" && e.jsonType !== "array"), E = oe(() => R.value && e._isArrayParent), H = oe(() => !E.value), P = oe(() => R.value ? e._isArrayParent ? "添加元素" : "添加字段 —— " + (e.nodeKey || "新字段") : "字段配置 —— " + e.nodeKey);
    function L() {
      e.nodeKey = "", e.nodeId = "", e.jsonType = "string", e.fieldType = "string", e.label = "", e.description = "", e.role = "", e.isForm = !0, e.required = !1, e.defaultValue = "", e.options = [], e.constraint = {}, e._createParentId = void 0, e._isArrayParent = !1, $.value = [];
    }
    function G(y) {
      var t, D, S;
      if (L(), !!y) {
        if (e.nodeId = y.nodeId, e.nodeKey = y.nodeKey || "", J.value = y.jsonType || "string", e.jsonType = y.jsonType || "string", e.fieldType = y.fieldType, e.label = y.label || "", e.description = y.description || "", e.role = y.role || "", e.isForm = y.isForm ?? !0, e.required = y.required || !1, e.defaultValue = y.defaultValue || "", e.options = y.options ? [...y.options] : [], e.constraint = y.constraint ? { ...y.constraint } : {}, e._createParentId = y._createParentId, e._isArrayParent = y._isArrayParent ?? !1, e._childrenCount = y._childrenCount ?? 0, (D = (t = y.constraint) == null ? void 0 : t.uploadRules) != null && D.length)
          $.value = y.constraint.uploadRules.map((m) => ({ ...m }));
        else if ((S = y.constraint) != null && S.accept) {
          const m = y.constraint.accept.split(",").map((h) => h.trim()).filter(Boolean);
          m.length && ($.value = m.map((h) => {
            var O, M;
            return { format: h, maxSize: (O = y.constraint) == null ? void 0 : O.maxSize, maxCount: (M = y.constraint) == null ? void 0 : M.maxCount };
          }));
        }
      }
    }
    function k() {
      $.value.some((y) => y.format) ? e.constraint.uploadRules = $.value.filter((y) => y.format).map((y) => ({ ...y })) : delete e.constraint.uploadRules;
    }
    function s() {
      $.value.push({ format: "", maxSize: void 0, maxCount: void 0 });
    }
    function f(y) {
      $.value.splice(y, 1);
    }
    async function p(y) {
      const t = e._childrenCount || 0, D = J.value, S = { string: "string", number: "number", boolean: "switch", null: "string", object: "string", array: "string" };
      if (e.fieldType = S[y] || "string", !e._createParentId && t > 0 && D && D !== y)
        try {
          await xe.confirm("更改字段类型将删除该节点下所有子节点数据，是否继续？", "确认操作", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "warning",
            draggable: !0
          }), J.value = y;
        } catch {
          e.jsonType = D;
        }
      else
        J.value = y;
    }
    function j() {
      e.fieldType !== "upload" && (delete e.constraint.accept, delete e.constraint.maxSize, delete e.constraint.maxCount, delete e.constraint.uploadRules, $.value = []), e.fieldType !== "string" && e.fieldType !== "textarea" && (delete e.constraint.minLength, delete e.constraint.maxLength, delete e.constraint.pattern), e.fieldType !== "number" && (delete e.constraint.min, delete e.constraint.max, delete e.constraint.numberType);
    }
    ve(() => B.visible, (y) => {
      y && G(B.formData);
    }, { immediate: !0 });
    function w() {
      k(), _("save", { ...e, constraint: { ...e.constraint } });
    }
    function U() {
      _("remove");
    }
    function le() {
      _("update:visible", !1);
    }
    function ae() {
      L();
    }
    return (y, t) => {
      const D = A("el-divider"), S = A("el-input"), m = A("el-form-item"), h = A("el-option"), O = A("el-select"), M = A("el-switch"), n = A("el-button"), o = A("el-icon"), d = A("el-input-number"), g = A("el-form"), b = A("el-dialog");
      return r.panel ? (u(), v("div", De, [
        c("div", Re, q(P.value), 1),
        c("div", Oe, [
          l(g, {
            ref: "formRef",
            model: e,
            "label-width": "110px",
            size: "small"
          }, {
            default: i(() => [
              l(D, { "content-position": "left" }, {
                default: i(() => [...t[35] || (t[35] = [
                  C("基础信息", -1)
                ])]),
                _: 1
              }),
              H.value ? (u(), N(m, {
                key: 0,
                label: "字段英文名"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.nodeKey,
                    "onUpdate:modelValue": t[0] || (t[0] = (a) => e.nodeKey = a),
                    placeholder: "字段名称（key）",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : V("", !0),
              E.value ? V("", !0) : (u(), N(m, {
                key: 1,
                label: "字段中文名"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.label,
                    "onUpdate:modelValue": t[1] || (t[1] = (a) => e.label = a),
                    placeholder: "表单中显示的字段名称",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })),
              E.value ? V("", !0) : (u(), N(m, {
                key: 2,
                label: "字段描述"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.description,
                    "onUpdate:modelValue": t[2] || (t[2] = (a) => e.description = a),
                    type: "textarea",
                    rows: 2,
                    placeholder: "此字段的用途说明",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })),
              l(m, { label: "字段类型" }, {
                default: i(() => [
                  l(O, {
                    modelValue: e.jsonType,
                    "onUpdate:modelValue": t[3] || (t[3] = (a) => e.jsonType = a),
                    onChange: p
                  }, {
                    default: i(() => [
                      l(h, {
                        label: "字符串",
                        value: "string"
                      }),
                      l(h, {
                        label: "数字",
                        value: "number"
                      }),
                      l(h, {
                        label: "布尔",
                        value: "boolean"
                      }),
                      l(h, {
                        label: "空值",
                        value: "null"
                      }),
                      l(h, {
                        label: "对象",
                        value: "object"
                      }),
                      l(h, {
                        label: "数组",
                        value: "array"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  t[36] || (t[36] = c("div", { class: "form-hint" }, "JSON 数据类型", -1))
                ]),
                _: 1
              }),
              I.value ? (u(), N(m, {
                key: 3,
                label: "默认值"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.defaultValue,
                    "onUpdate:modelValue": t[4] || (t[4] = (a) => e.defaultValue = a),
                    placeholder: "留空则无默认值",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : V("", !0),
              I.value ? (u(), v(z, { key: 4 }, [
                l(D, { "content-position": "left" }, {
                  default: i(() => [...t[37] || (t[37] = [
                    C("表单属性", -1)
                  ])]),
                  _: 1
                }),
                l(m, { label: "表单显示" }, {
                  default: i(() => [
                    l(M, {
                      modelValue: e.isForm,
                      "onUpdate:modelValue": t[5] || (t[5] = (a) => e.isForm = a)
                    }, null, 8, ["modelValue"]),
                    c("span", _e, q(e.isForm ? "在表单中展示" : "隐藏字段"), 1)
                  ]),
                  _: 1
                }),
                e.isForm ? (u(), v(z, { key: 0 }, [
                  l(m, { label: "表单控件" }, {
                    default: i(() => [
                      l(O, {
                        modelValue: e.fieldType,
                        "onUpdate:modelValue": t[6] || (t[6] = (a) => e.fieldType = a),
                        onChange: j
                      }, {
                        default: i(() => [
                          (u(!0), v(z, null, Q(r.fieldTypeOptions, (a) => (u(), N(h, {
                            key: a.value,
                            label: a.label,
                            value: a.value
                          }, null, 8, ["label", "value"]))), 128))
                        ]),
                        _: 1
                      }, 8, ["modelValue"]),
                      t[38] || (t[38] = c("div", { class: "form-hint" }, "此字段在表单中以什么组件展示", -1))
                    ]),
                    _: 1
                  }),
                  l(m, { label: "必填项" }, {
                    default: i(() => [
                      l(M, {
                        modelValue: e.required,
                        "onUpdate:modelValue": t[7] || (t[7] = (a) => e.required = a)
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : V("", !0),
                l(D, { "content-position": "left" }, {
                  default: i(() => [...t[39] || (t[39] = [
                    C("约束规则", -1)
                  ])]),
                  _: 1
                }),
                e.fieldType === "select" ? (u(), N(m, {
                  key: 1,
                  label: "选项列表"
                }, {
                  default: i(() => [
                    c("div", Ee, [
                      (u(!0), v(z, null, Q(e.options, (a, x) => (u(), v("div", {
                        key: x,
                        class: "option-row"
                      }, [
                        l(S, {
                          modelValue: e.options[x],
                          "onUpdate:modelValue": (T) => e.options[x] = T,
                          size: "small",
                          placeholder: "选项值"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        l(n, {
                          size: "small",
                          text: "",
                          type: "danger",
                          onClick: (T) => e.options.splice(x, 1)
                        }, {
                          default: i(() => [...t[40] || (t[40] = [
                            C("×", -1)
                          ])]),
                          _: 1
                        }, 8, ["onClick"])
                      ]))), 128)),
                      l(n, {
                        size: "small",
                        class: "add-option-btn",
                        onClick: t[8] || (t[8] = (a) => e.options.push(""))
                      }, {
                        default: i(() => [
                          l(o, null, {
                            default: i(() => [
                              l(F(ee))
                            ]),
                            _: 1
                          }),
                          t[41] || (t[41] = C(" 添加选项", -1))
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                })) : V("", !0),
                e.fieldType === "string" || e.fieldType === "textarea" ? (u(), v(z, { key: 2 }, [
                  l(m, { label: "最小长度" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.minLength,
                        "onUpdate:modelValue": t[9] || (t[9] = (a) => e.constraint.minLength = a),
                        min: 0,
                        step: 100,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "最大长度" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.maxLength,
                        "onUpdate:modelValue": t[10] || (t[10] = (a) => e.constraint.maxLength = a),
                        min: 0,
                        step: 1e3,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "正则验证" }, {
                    default: i(() => [
                      l(S, {
                        modelValue: e.constraint.pattern,
                        "onUpdate:modelValue": t[11] || (t[11] = (a) => e.constraint.pattern = a),
                        placeholder: "如 ^https?://",
                        clearable: ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : V("", !0),
                e.fieldType === "upload" ? (u(), v(z, { key: 3 }, [
                  l(m, { label: "总数量" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.uploadTotalMaxCount,
                        "onUpdate:modelValue": t[12] || (t[12] = (a) => e.constraint.uploadTotalMaxCount = a),
                        min: 1,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "总容量(MB)" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.uploadTotalMaxSize,
                        "onUpdate:modelValue": t[13] || (t[13] = (a) => e.constraint.uploadTotalMaxSize = a),
                        min: 1,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(D, { "content-position": "left" }, {
                    default: i(() => [...t[42] || (t[42] = [
                      C("按格式限制（可选）", -1)
                    ])]),
                    _: 1
                  }),
                  c("div", Me, [
                    (u(!0), v(z, null, Q($.value, (a, x) => (u(), v("div", {
                      key: x,
                      class: "upload-rule-row"
                    }, [
                      l(S, {
                        modelValue: a.format,
                        "onUpdate:modelValue": (T) => a.format = T,
                        size: "small",
                        placeholder: "格式（如 jpg）",
                        style: { width: "90px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      l(d, {
                        modelValue: a.maxSize,
                        "onUpdate:modelValue": (T) => a.maxSize = T,
                        min: 1,
                        "controls-position": "right",
                        size: "small",
                        placeholder: "大小(MB)",
                        style: { width: "140px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      l(d, {
                        modelValue: a.maxCount,
                        "onUpdate:modelValue": (T) => a.maxCount = T,
                        min: 1,
                        "controls-position": "right",
                        size: "small",
                        placeholder: "数量",
                        style: { width: "110px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      l(n, {
                        size: "small",
                        text: "",
                        type: "danger",
                        onClick: (T) => f(x)
                      }, {
                        default: i(() => [...t[43] || (t[43] = [
                          C("×", -1)
                        ])]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    l(n, {
                      size: "small",
                      class: "add-rule-btn",
                      onClick: s
                    }, {
                      default: i(() => [
                        l(o, null, {
                          default: i(() => [
                            l(F(ee))
                          ]),
                          _: 1
                        }),
                        t[44] || (t[44] = C(" 添加规则", -1))
                      ]),
                      _: 1
                    })
                  ])
                ], 64)) : V("", !0),
                e.fieldType === "number" ? (u(), v(z, { key: 4 }, [
                  l(m, { label: "最小值" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.min,
                        "onUpdate:modelValue": t[14] || (t[14] = (a) => e.constraint.min = a),
                        min: Number.MIN_SAFE_INTEGER,
                        max: Number.MAX_SAFE_INTEGER,
                        "controls-position": "right",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue", "min", "max"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "最大值" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.max,
                        "onUpdate:modelValue": t[15] || (t[15] = (a) => e.constraint.max = a),
                        min: Number.MIN_SAFE_INTEGER,
                        max: Number.MAX_SAFE_INTEGER,
                        "controls-position": "right",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue", "min", "max"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "数值类型" }, {
                    default: i(() => [
                      l(O, {
                        modelValue: e.constraint.numberType,
                        "onUpdate:modelValue": t[16] || (t[16] = (a) => e.constraint.numberType = a),
                        clearable: "",
                        placeholder: "不限"
                      }, {
                        default: i(() => [
                          l(h, {
                            label: "整数",
                            value: "integer"
                          }),
                          l(h, {
                            label: "浮点数",
                            value: "float"
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : V("", !0)
              ], 64)) : V("", !0)
            ]),
            _: 1
          }, 8, ["model"])
        ]),
        c("div", Le, [
          l(n, {
            disabled: !r.hasConfig,
            onClick: U
          }, {
            default: i(() => [...t[45] || (t[45] = [
              C("清除配置", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          l(n, { onClick: le }, {
            default: i(() => [...t[46] || (t[46] = [
              C("关闭", -1)
            ])]),
            _: 1
          }),
          l(n, {
            type: "primary",
            onClick: w
          }, {
            default: i(() => [...t[47] || (t[47] = [
              C("保存", -1)
            ])]),
            _: 1
          })
        ])
      ])) : (u(), N(b, {
        key: 1,
        "model-value": r.visible,
        title: P.value,
        width: "560px",
        "close-on-click-modal": !1,
        "destroy-on-close": "",
        "onUpdate:modelValue": t[34] || (t[34] = (a) => y.$emit("update:visible", a)),
        onClosed: ae
      }, {
        footer: i(() => [
          l(n, {
            disabled: !r.hasConfig,
            onClick: U
          }, {
            default: i(() => [...t[58] || (t[58] = [
              C("清除配置", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          l(n, { onClick: le }, {
            default: i(() => [...t[59] || (t[59] = [
              C("取消", -1)
            ])]),
            _: 1
          }),
          l(n, {
            type: "primary",
            onClick: w
          }, {
            default: i(() => [...t[60] || (t[60] = [
              C("保存", -1)
            ])]),
            _: 1
          })
        ]),
        default: i(() => [
          l(g, {
            ref: "formRef",
            model: e,
            "label-width": "110px",
            size: "small"
          }, {
            default: i(() => [
              l(D, { "content-position": "left" }, {
                default: i(() => [...t[48] || (t[48] = [
                  C("基础信息", -1)
                ])]),
                _: 1
              }),
              H.value ? (u(), N(m, {
                key: 0,
                label: "字段英文名"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.nodeKey,
                    "onUpdate:modelValue": t[17] || (t[17] = (a) => e.nodeKey = a),
                    placeholder: "字段名称（key）",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : V("", !0),
              E.value ? V("", !0) : (u(), N(m, {
                key: 1,
                label: "字段中文名"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.label,
                    "onUpdate:modelValue": t[18] || (t[18] = (a) => e.label = a),
                    placeholder: "表单中显示的字段名称",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })),
              E.value ? V("", !0) : (u(), N(m, {
                key: 2,
                label: "字段描述"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.description,
                    "onUpdate:modelValue": t[19] || (t[19] = (a) => e.description = a),
                    type: "textarea",
                    rows: 2,
                    placeholder: "此字段的用途说明",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })),
              l(m, { label: "字段类型" }, {
                default: i(() => [
                  l(O, {
                    modelValue: e.jsonType,
                    "onUpdate:modelValue": t[20] || (t[20] = (a) => e.jsonType = a),
                    onChange: p
                  }, {
                    default: i(() => [
                      l(h, {
                        label: "字符串",
                        value: "string"
                      }),
                      l(h, {
                        label: "数字",
                        value: "number"
                      }),
                      l(h, {
                        label: "布尔",
                        value: "boolean"
                      }),
                      l(h, {
                        label: "空值",
                        value: "null"
                      }),
                      l(h, {
                        label: "对象",
                        value: "object"
                      }),
                      l(h, {
                        label: "数组",
                        value: "array"
                      })
                    ]),
                    _: 1
                  }, 8, ["modelValue"]),
                  t[49] || (t[49] = c("div", { class: "form-hint" }, "JSON 数据类型", -1))
                ]),
                _: 1
              }),
              I.value ? (u(), N(m, {
                key: 3,
                label: "默认值"
              }, {
                default: i(() => [
                  l(S, {
                    modelValue: e.defaultValue,
                    "onUpdate:modelValue": t[21] || (t[21] = (a) => e.defaultValue = a),
                    placeholder: "留空则无默认值",
                    clearable: ""
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })) : V("", !0),
              I.value ? (u(), v(z, { key: 4 }, [
                l(D, { "content-position": "left" }, {
                  default: i(() => [...t[50] || (t[50] = [
                    C("表单属性", -1)
                  ])]),
                  _: 1
                }),
                l(m, { label: "表单显示" }, {
                  default: i(() => [
                    l(M, {
                      modelValue: e.isForm,
                      "onUpdate:modelValue": t[22] || (t[22] = (a) => e.isForm = a)
                    }, null, 8, ["modelValue"]),
                    c("span", Je, q(e.isForm ? "在表单中展示" : "隐藏字段"), 1)
                  ]),
                  _: 1
                }),
                e.isForm ? (u(), v(z, { key: 0 }, [
                  l(m, { label: "表单控件" }, {
                    default: i(() => [
                      l(O, {
                        modelValue: e.fieldType,
                        "onUpdate:modelValue": t[23] || (t[23] = (a) => e.fieldType = a),
                        onChange: j
                      }, {
                        default: i(() => [
                          (u(!0), v(z, null, Q(r.fieldTypeOptions, (a) => (u(), N(h, {
                            key: a.value,
                            label: a.label,
                            value: a.value
                          }, null, 8, ["label", "value"]))), 128))
                        ]),
                        _: 1
                      }, 8, ["modelValue"]),
                      t[51] || (t[51] = c("div", { class: "form-hint" }, "此字段在表单中以什么组件展示", -1))
                    ]),
                    _: 1
                  }),
                  l(m, { label: "必填项" }, {
                    default: i(() => [
                      l(M, {
                        modelValue: e.required,
                        "onUpdate:modelValue": t[24] || (t[24] = (a) => e.required = a)
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : V("", !0),
                l(D, { "content-position": "left" }, {
                  default: i(() => [...t[52] || (t[52] = [
                    C("约束规则", -1)
                  ])]),
                  _: 1
                }),
                e.fieldType === "select" ? (u(), N(m, {
                  key: 1,
                  label: "选项列表"
                }, {
                  default: i(() => [
                    c("div", qe, [
                      (u(!0), v(z, null, Q(e.options, (a, x) => (u(), v("div", {
                        key: x,
                        class: "option-row"
                      }, [
                        l(S, {
                          modelValue: e.options[x],
                          "onUpdate:modelValue": (T) => e.options[x] = T,
                          size: "small",
                          placeholder: "选项值"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        l(n, {
                          size: "small",
                          text: "",
                          type: "danger",
                          onClick: (T) => e.options.splice(x, 1)
                        }, {
                          default: i(() => [...t[53] || (t[53] = [
                            C("×", -1)
                          ])]),
                          _: 1
                        }, 8, ["onClick"])
                      ]))), 128)),
                      l(n, {
                        size: "small",
                        class: "add-option-btn",
                        onClick: t[25] || (t[25] = (a) => e.options.push(""))
                      }, {
                        default: i(() => [
                          l(o, null, {
                            default: i(() => [
                              l(F(ee))
                            ]),
                            _: 1
                          }),
                          t[54] || (t[54] = C(" 添加选项", -1))
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                })) : V("", !0),
                e.fieldType === "string" || e.fieldType === "textarea" ? (u(), v(z, { key: 2 }, [
                  l(m, { label: "最小长度" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.minLength,
                        "onUpdate:modelValue": t[26] || (t[26] = (a) => e.constraint.minLength = a),
                        min: 0,
                        step: 100,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "最大长度" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.maxLength,
                        "onUpdate:modelValue": t[27] || (t[27] = (a) => e.constraint.maxLength = a),
                        min: 0,
                        step: 1e3,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "正则验证" }, {
                    default: i(() => [
                      l(S, {
                        modelValue: e.constraint.pattern,
                        "onUpdate:modelValue": t[28] || (t[28] = (a) => e.constraint.pattern = a),
                        placeholder: "如 ^https?://",
                        clearable: ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : V("", !0),
                e.fieldType === "upload" ? (u(), v(z, { key: 3 }, [
                  l(m, { label: "总数量" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.uploadTotalMaxCount,
                        "onUpdate:modelValue": t[29] || (t[29] = (a) => e.constraint.uploadTotalMaxCount = a),
                        min: 1,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "总容量(MB)" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.uploadTotalMaxSize,
                        "onUpdate:modelValue": t[30] || (t[30] = (a) => e.constraint.uploadTotalMaxSize = a),
                        min: 1,
                        "controls-position": "right",
                        placeholder: "不限",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  l(D, { "content-position": "left" }, {
                    default: i(() => [...t[55] || (t[55] = [
                      C("按格式限制（可选）", -1)
                    ])]),
                    _: 1
                  }),
                  c("div", Be, [
                    (u(!0), v(z, null, Q($.value, (a, x) => (u(), v("div", {
                      key: x,
                      class: "upload-rule-row"
                    }, [
                      l(S, {
                        modelValue: a.format,
                        "onUpdate:modelValue": (T) => a.format = T,
                        size: "small",
                        placeholder: "格式（如 jpg）",
                        style: { width: "90px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      l(d, {
                        modelValue: a.maxSize,
                        "onUpdate:modelValue": (T) => a.maxSize = T,
                        min: 1,
                        "controls-position": "right",
                        size: "small",
                        placeholder: "大小(MB)",
                        style: { width: "140px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      l(d, {
                        modelValue: a.maxCount,
                        "onUpdate:modelValue": (T) => a.maxCount = T,
                        min: 1,
                        "controls-position": "right",
                        size: "small",
                        placeholder: "数量",
                        style: { width: "110px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      l(n, {
                        size: "small",
                        text: "",
                        type: "danger",
                        onClick: (T) => f(x)
                      }, {
                        default: i(() => [...t[56] || (t[56] = [
                          C("×", -1)
                        ])]),
                        _: 1
                      }, 8, ["onClick"])
                    ]))), 128)),
                    l(n, {
                      size: "small",
                      class: "add-rule-btn",
                      onClick: s
                    }, {
                      default: i(() => [
                        l(o, null, {
                          default: i(() => [
                            l(F(ee))
                          ]),
                          _: 1
                        }),
                        t[57] || (t[57] = C(" 添加规则", -1))
                      ]),
                      _: 1
                    })
                  ])
                ], 64)) : V("", !0),
                e.fieldType === "number" ? (u(), v(z, { key: 4 }, [
                  l(m, { label: "最小值" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.min,
                        "onUpdate:modelValue": t[31] || (t[31] = (a) => e.constraint.min = a),
                        min: Number.MIN_SAFE_INTEGER,
                        max: Number.MAX_SAFE_INTEGER,
                        "controls-position": "right",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue", "min", "max"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "最大值" }, {
                    default: i(() => [
                      l(d, {
                        modelValue: e.constraint.max,
                        "onUpdate:modelValue": t[32] || (t[32] = (a) => e.constraint.max = a),
                        min: Number.MIN_SAFE_INTEGER,
                        max: Number.MAX_SAFE_INTEGER,
                        "controls-position": "right",
                        style: { width: "100%" }
                      }, null, 8, ["modelValue", "min", "max"])
                    ]),
                    _: 1
                  }),
                  l(m, { label: "数值类型" }, {
                    default: i(() => [
                      l(O, {
                        modelValue: e.constraint.numberType,
                        "onUpdate:modelValue": t[33] || (t[33] = (a) => e.constraint.numberType = a),
                        clearable: "",
                        placeholder: "不限"
                      }, {
                        default: i(() => [
                          l(h, {
                            label: "整数",
                            value: "integer"
                          }),
                          l(h, {
                            label: "浮点数",
                            value: "float"
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ], 64)) : V("", !0)
              ], 64)) : V("", !0)
            ]),
            _: 1
          }, 8, ["model"])
        ]),
        _: 1
      }, 8, ["model-value", "title"]));
    };
  }
}), Ke = /* @__PURE__ */ me(Pe, [["__scopeId", "data-v-86a3bb92"]]), He = { class: "json-editor-split" }, Ge = { class: "tree-panel" }, Xe = { class: "tree-root" }, We = {
  key: 0,
  class: "config-sidebar"
}, Qe = {
  key: 1,
  class: "config-sidebar config-sidebar-empty"
}, Ye = { class: "paste-tip" }, Ze = /* @__PURE__ */ pe({
  name: "JsonEditor",
  __name: "index",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "change"],
  setup(r, { expose: Y, emit: B }) {
    const _ = r, e = B;
    let $ = 0;
    function J() {
      return `jn_${Date.now()}_${++$}_${Math.random().toString(36).slice(2, 6)}`;
    }
    function R(n) {
      switch (n) {
        case "number":
          return 0;
        case "boolean":
          return !1;
        case "null":
          return null;
        default:
          return "";
      }
    }
    function I(n, o, d) {
      const g = J();
      if (n == null)
        return { _id: g, key: o, keyEditable: d, type: "null", primitiveValue: null, children: [] };
      if (typeof n == "object" && !Array.isArray(n) && "type" in n) {
        const b = n.type;
        if (typeof b == "string" && ["string", "number", "boolean", "null", "object", "array"].includes(b)) {
          const a = b === "object" || b === "array" ? "attrs" : "value";
          if (a in n) {
            const x = n[a], T = {};
            for (const W of Object.keys(n))
              W !== "type" && W !== a && (T[W] = n[W]);
            const ie = Object.keys(T).length > 0;
            if (b === "object") {
              const W = x ? Object.entries(x).map(([se, de]) => I(de, se, !0)) : [];
              return { _id: g, key: o, keyEditable: d, type: "object", primitiveValue: null, children: W, config: ie ? T : void 0 };
            }
            if (b === "array") {
              const W = Array.isArray(x) ? x.map((se, de) => I(se, String(de), !1)) : [];
              return { _id: g, key: o, keyEditable: d, type: "array", primitiveValue: null, children: W, config: ie ? T : void 0 };
            }
            return {
              _id: g,
              key: o,
              keyEditable: d,
              type: b,
              primitiveValue: x ?? R(b),
              children: [],
              config: ie ? T : void 0
            };
          }
        }
      }
      return Array.isArray(n) ? { _id: g, key: o, keyEditable: d, type: "array", primitiveValue: null, children: n.map((b, a) => I(b, String(a), !1)) } : typeof n == "object" ? { _id: g, key: o, keyEditable: d, type: "object", primitiveValue: null, children: Object.entries(n).map(([b, a]) => I(a, b, !0)) } : { _id: g, key: o, keyEditable: d, type: typeof n, primitiveValue: n, children: [] };
    }
    function E(n) {
      let o;
      if (n.type === "object") {
        const d = {};
        for (const g of n.children) d[g.key] = E(g);
        o = d;
      } else n.type === "array" ? o = n.children.map((d) => E(d)) : n.type === "null" ? o = null : n.type === "number" ? o = Number(n.primitiveValue) : n.type === "boolean" ? o = n.primitiveValue === !0 || n.primitiveValue === "true" : o = String(n.primitiveValue);
      if (n.config && le(n)) {
        const d = n.type === "object" || n.type === "array" ? "attrs" : "value";
        return { type: n.type, [d]: o, ...n.config };
      }
      return o;
    }
    function H(n) {
      return { string: "string", number: "number", boolean: "switch" }[n] || "string";
    }
    const P = X(!1), L = X(""), G = X(null);
    function k(n) {
      G.value = n, L.value = "", P.value = !0;
    }
    function s() {
      const n = L.value.trim();
      if (!n) {
        Z.warning("请粘贴 JSON 内容");
        return;
      }
      try {
        const o = JSON.parse(n);
        if (G.value) {
          const d = M(G.value);
          if (!d || d.type !== "object" && d.type !== "array") {
            Z.warning("只能在对象或数组节点上粘贴 JSON");
            return;
          }
          if (Array.isArray(o))
            d.type = "array", d.children = o.map((g, b) => I(g, String(b), !1));
          else if (typeof o == "object" && o !== null)
            d.type = "object", d.children = Object.entries(o).map(([g, b]) => I(b, g, !0));
          else {
            Z.warning("粘贴的内容必须是对象或数组");
            return;
          }
        } else
          m.value = I(o, "", !1);
        P.value = !1, L.value = "", O();
      } catch (o) {
        Z.error("JSON 格式错误: " + (o.message || ""));
      }
    }
    const f = [
      { label: "文本框", value: "string" },
      { label: "多行文本", value: "textarea" },
      { label: "数字输入", value: "number" },
      { label: "开关", value: "switch" },
      { label: "下拉选择", value: "select" },
      { label: "文件上传", value: "upload" }
    ], p = X(null), j = X({
      visible: !1,
      formData: null,
      typeOptions: [],
      hasConfig: !1
    });
    function w() {
      p.value = null, j.value.visible = !1, j.value.formData = null;
    }
    function U(n) {
      var g;
      const o = {};
      return n.label && (o.label = n.label), n.description && (o.description = n.description), n.fieldType && n.fieldType !== H(n.jsonType) && (o.fieldType = n.fieldType), n.role && (o.role = n.role), n.isForm || (o.isForm = !1), n.required && (o.required = !0), n.defaultValue && (o.defaultValue = n.jsonType === "number" ? Number(n.defaultValue) : n.defaultValue), ((g = n.options) == null ? void 0 : g.length) > 0 && (o.options = [...n.options]), Object.values(n.constraint).some((b) => Array.isArray(b) ? b.length > 0 : b != null && b !== "") && (o.constraint = { ...n.constraint }, o.constraint.uploadRules && (o.constraint.uploadRules = o.constraint.uploadRules.map((b) => ({ ...b })))), o;
    }
    function le(n) {
      var d;
      const o = n.config;
      return o ? !!(o.label || o.description || o.fieldType || o.role || o.isForm === !1 || o.required || o.defaultValue || (d = o.options) != null && d.length || o.constraint && Object.keys(o.constraint).length > 0) : !1;
    }
    function ae(n) {
      const o = M(n);
      if (!o) return;
      const d = o.config || {};
      j.value = {
        visible: !0,
        typeOptions: f,
        hasConfig: le(o),
        formData: {
          nodeId: o._id,
          nodeKey: o.key,
          jsonType: o.type,
          fieldType: d.fieldType || H(o.type),
          label: d.label || "",
          description: d.description || "",
          role: d.role || "",
          isForm: d.isForm ?? !0,
          required: d.required ?? !1,
          defaultValue: String(d.defaultValue ?? ""),
          options: d.options || [],
          constraint: d.constraint ? { ...d.constraint } : {},
          _childrenCount: o.children.length
        }
      }, p.value = n;
    }
    he("onOpenFieldDialog", ae);
    function y(n) {
      const o = M(n);
      if (!o || o.type !== "object" && o.type !== "array") return;
      const d = o.type === "array";
      j.value = {
        visible: !0,
        typeOptions: f,
        hasConfig: !1,
        formData: {
          nodeId: "",
          nodeKey: "",
          jsonType: "string",
          fieldType: "string",
          label: "",
          description: "",
          role: "",
          isForm: !0,
          required: !1,
          defaultValue: "",
          options: [],
          constraint: {},
          _createParentId: n,
          _isArrayParent: d,
          _childrenCount: 0
        }
      }, p.value = n;
    }
    function t(n) {
      if (n._createParentId) {
        const o = M(n._createParentId);
        if (!o || o.type !== "object" && o.type !== "array") return;
        const d = o.type === "array", g = {
          _id: J(),
          key: d ? n.nodeKey || String(o.children.length) : n.nodeKey || "newKey",
          keyEditable: !d,
          type: n.jsonType,
          primitiveValue: R(n.jsonType),
          children: n.jsonType === "object" || n.jsonType === "array" ? [] : [],
          config: U(n)
        };
        o.children.push(g), j.value.visible = !1, O(), w();
      } else {
        const o = M(n.nodeId);
        if (!o) return;
        o.key = n.nodeKey, o.type = n.jsonType, o.config = U(n), o.type === "object" || o.type === "array" ? o.children || (o.children = []) : (o.children = [], (o.primitiveValue === void 0 || o.primitiveValue === null || o.type === "null") && (o.primitiveValue = R(o.type))), j.value.visible = !1, O(), w();
      }
    }
    function D() {
      const n = j.value.formData;
      if (!n) return;
      if (n._createParentId) {
        j.value.visible = !1, w();
        return;
      }
      const o = M(n.nodeId);
      o && (delete o.config, j.value.visible = !1, O(), w());
    }
    function S(n, o, d) {
      const b = { _id: J(), key: o, keyEditable: d, children: [] };
      switch (n) {
        case "object":
          return { ...b, type: "object", primitiveValue: null };
        case "array":
          return { ...b, type: "array", primitiveValue: null };
        case "null":
          return { ...b, type: "null", primitiveValue: null };
        case "number":
          return { ...b, type: "number", primitiveValue: 0 };
        case "boolean":
          return { ...b, type: "boolean", primitiveValue: !1 };
        default:
          return { ...b, type: "string", primitiveValue: "" };
      }
    }
    const m = X(S("object", "", !1));
    let h = !1;
    ve(() => _.modelValue, (n) => {
      if (h) {
        h = !1;
        return;
      }
      m.value = n == null ? S("object", "", !1) : I(n, "", !1);
    }, { deep: !0, immediate: !0 });
    function O() {
      h = !0;
      const n = E(m.value);
      e("update:modelValue", n), e("change", n);
    }
    function M(n, o) {
      const d = (g) => {
        if (g._id === n) return g;
        for (const b of g.children) {
          const a = d(b);
          if (a) return a;
        }
        return null;
      };
      return d(m.value);
    }
    return Y({
      getData: () => E(m.value),
      setData: (n) => {
        m.value = I(n, "", !1);
      },
      openPasteDialog: () => k(null),
      getSelectedNodeId: () => p.value
    }), (n, o) => {
      const d = A("el-alert"), g = A("el-input"), b = A("el-button"), a = A("el-dialog");
      return u(), v("div", He, [
        c("div", Ge, [
          c("div", Xe, [
            l(Ie, {
              node: m.value,
              depth: 0,
              "is-root": !0,
              onChange: O,
              onAddRequested: y
            }, null, 8, ["node"])
          ])
        ]),
        p.value ? (u(), v("div", We, [
          (u(), N(Ke, {
            key: p.value,
            panel: !0,
            visible: !0,
            "form-data": j.value.formData,
            "field-type-options": j.value.typeOptions,
            "has-config": j.value.hasConfig,
            "onUpdate:visible": w,
            onSave: t,
            onRemove: D
          }, null, 8, ["form-data", "field-type-options", "has-config"]))
        ])) : (u(), v("div", Qe, [...o[3] || (o[3] = [
          c("div", { class: "config-placeholder" }, [
            c("p", null, "选择一个字段"),
            c("p", { class: "config-placeholder-hint" }, "点击字段右侧的齿轮按钮进行配置")
          ], -1)
        ])])),
        l(a, {
          modelValue: P.value,
          "onUpdate:modelValue": o[2] || (o[2] = (x) => P.value = x),
          title: "粘贴 JSON",
          width: "560px",
          "close-on-click-modal": !1,
          "destroy-on-close": ""
        }, {
          footer: i(() => [
            l(b, {
              onClick: o[1] || (o[1] = (x) => {
                P.value = !1, L.value = "";
              })
            }, {
              default: i(() => [...o[5] || (o[5] = [
                C("取消", -1)
              ])]),
              _: 1
            }),
            l(b, {
              type: "primary",
              onClick: s
            }, {
              default: i(() => [...o[6] || (o[6] = [
                C("解析并替换", -1)
              ])]),
              _: 1
            })
          ]),
          default: i(() => [
            c("div", Ye, [
              l(d, {
                type: "info",
                closable: !1,
                "show-icon": ""
              }, {
                default: i(() => [...o[4] || (o[4] = [
                  C(" 将 JSON 字符串粘贴到下方文本框，系统将解析并", -1),
                  c("strong", null, "替换", -1),
                  C("当前节点的内容。 （将替换整个根节点） ", -1)
                ])]),
                _: 1
              })
            ]),
            l(g, {
              modelValue: L.value,
              "onUpdate:modelValue": o[0] || (o[0] = (x) => L.value = x),
              type: "textarea",
              rows: 12,
              placeholder: `例如：
{
  "name": "test",
  "age": 18
}`,
              autosize: { minRows: 8, maxRows: 24 }
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]);
    };
  }
}), nl = /* @__PURE__ */ me(Ze, [["__scopeId", "data-v-da0a9b9d"]]);
export {
  Ke as FieldConfigDialog,
  nl as JsonEditor,
  Ie as JsonNode,
  nl as default
};
