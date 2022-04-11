/**
 * @description 按钮组件
 * @author 阿怪
 * @date 2021/8/10 4:59 下午
 * @version v1.0.1
 *
 * 公司的业务千篇一律，复杂的代码好几百行。
 * v1.0.1 新增slot文本形式
 */
import { h, defineComponent, useSlots } from 'vue';
import { props } from "./api";
import type { OptionType } from "./index";

export default defineComponent({
  name: 'WButton',
  props,
  render(ctx: OptionType['ctx']) {
    let { disabled, type, text } = ctx;
    const slots = useSlots();
    if (slots.default) {
      text = slots.default();
    }
    return h('button', {
      class: ['w-button w-cursor-pointer', { 'w-button-disabled': disabled }, `w-button-${type}`],
      disabled: disabled
    }, text);
  }
})
