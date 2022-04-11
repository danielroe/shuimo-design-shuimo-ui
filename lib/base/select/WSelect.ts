/**
 * @description 选择框组件
 * @author 阿怪
 * @date 2021/8/27 11:05 上午
 * @version v1.1.2
 *
 * 公司的业务千篇一律，复杂的代码好几百行。
 *
 * v1.0.1 修复moduleValue不更新问题、keyParam默认值改为title 阿怪
 * v1.0.2 keyParam默认值改为value，新增titleParam
 * v1.0.3 修复之前两个版本错误的参数流转问题
 * v1.1.0 代码结构改为使用ts，新增输入框筛选功能
 * v1.1.1 添加slot功能
 * v1.1.2 输入模式添加点击查询功能
 */
import { defineComponent, h, Teleport, Transition, VNode } from 'vue';
import WBorder from "../../other/border/WBorder";
import WInput from "../input/WInput";
import { deepClone, getStyle, notEmpty } from "../../dependents/_utils/tools";
import ShowDomHandler from "./composables/ShowDomHandler";
import SelectEventHandler from "./composables/SelectEventHandler";
import { DOMTokenListToArray } from "../../dependents/_utils/dom";

type WSelectDataType = {
  showValue: string,
}

export default defineComponent({
  name: 'WSelect',
  props: {
    modelValue: { type: null, default: '' },
    options: { type: Array, default: () => [] },
    keyParam: { type: String, default: 'value' }, // 输入框或者文本框中的key
    titleParam: { type: String, default: 'title' }, // 下拉框中显示的key
    canChange: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '请选择...' }
  },
  data() {
    return {
      showValue: '',
    } as WSelectDataType
  },
  setup() {
    const { dropdownStyle, setStyle } = ShowDomHandler();
    const { selectDropdown, mousedownEvent, leaveDropdown, setEvents } = SelectEventHandler(setStyle);
    return {
      dropdownStyle, setStyle,
      mousedownEvent, leaveDropdown, setEvents, selectDropdown
    }
  },
  methods: {
    showSelectDropdown() {
      if (this.disabled) {
        return;
      }
      this.setStyle();
      this.setEvents();
      this.selectDropdown = true;
    },
    canChangeInputEvent() {
      this.$emit('updateOptions');
      this.showSelectDropdown();
    },
    emitValue(option: any) {
      this.$emit('update:modelValue', option[this.keyParam]);
      this.$emit('select', option);
      this.leaveDropdown();

    },
    enterFunc(keyEvent: KeyboardEvent) {
      if (keyEvent.key === 'Enter') {
        const path = keyEvent.composedPath();
        if (path && path.length > 0) {
          const input = path[0] as HTMLInputElement;
          if (input.classList && DOMTokenListToArray(input.classList).includes('w-input-inner')) {
            keyEvent.stopPropagation();
            // 这里没用optionCopy有点愚蠢，但是等以后优化吧
            const option = this.options!.filter((e: any) => e[this.keyParam] === input.value);
            if (option && option.length > 0) {
              this.emitValue(option[0]);
            }
          }
        }
      }
    }
  },
  render: function (ctx: any) {
    const {
      canChange,
      disabled,
      keyParam,
      titleParam,
      modelValue,
      options,
      leaveDropdown,
      emitValue,
      showSelectDropdown,
      canChangeInputEvent,
      dropdownStyle,
      enterFunc
    } = ctx;

    const optionsCopy = deepClone(options);

    //  设置初始值
    const setShowValue = () => {
      const selectedOptionIndex = optionsCopy.findIndex((o: any) => o[keyParam] === modelValue);
      if (selectedOptionIndex > -1) {
        ctx.showValue = optionsCopy[selectedOptionIndex][keyParam];
        optionsCopy[selectedOptionIndex].selected = true;
      }
    }
    setShowValue();

    let showNode = undefined;
    if (canChange && !disabled) {
      showNode = h(WInput, {
        placeholder: ctx.placeholder,
        modelValue: ctx.showValue,
        'onUpdate:modelValue': (newValue: any) => {
          this.$emit('update:modelValue', newValue);
        },
        onInput: canChangeInputEvent,
      });
    } else {
      const wrapInputNode = (showNode: VNode) => h(WBorder, { class: 'w-select-border' }, () => showNode);
      showNode = wrapInputNode(h('div', {
        class: 'w-select-div',
      }, ctx.showValue));
    }

    const optionRenderCreator = (o: any) => {
      if (ctx.$slots && ctx.$slots.default) {
        const defaultSlot: any[] = ctx.$slots.default({ data: o });
        return defaultSlot;
      }
      return h('span', {}, o[titleParam]);
    }

    // 渲染选择框
    let teleportNode
    if (ctx.selectDropdown) {

      const dropdownOptionDom = optionsCopy.map((o: any) => {
        const option = optionRenderCreator(o);
        return h('div', {
          class: ['dropdown-option','w-cursor-pointer', o.selected ? 'selected' : ''],
          onClick: () => {
            emitValue(o);
          }
        }, option)
      })

      const dropdownDom = h('div', {
        style: dropdownStyle,
        class: ['w-select-dropdown', 'w-select-dropdown-size'],
        onResize: leaveDropdown
      }, notEmpty(dropdownOptionDom) ? dropdownOptionDom : h('div', { class: 'w-select-dropdown-empty' }, '暂无数据...'))


      const transition = h(Transition, { name: 'w-opacity' }, {
        default: () => dropdownDom
      });
      teleportNode = h(Teleport, { to: 'body' }, transition);
    }

    let divEvent;
    if (canChange) {
      divEvent = {
        onClick: showSelectDropdown,
        onFocus: showSelectDropdown,
        onkeyup: enterFunc
      }
    } else {
      divEvent = {
        onClick: showSelectDropdown
      }
    }


    const baseNose = h(showNode, {
      class: [
        disabled ? 'w-cursor-disabled' : 'w-cursor-pointer',
        disabled ? 'w-disabled' : ''
      ],
      ...divEvent
    });


    return h('div', { class: 'w-select' }, [baseNose, teleportNode])

  }
})
