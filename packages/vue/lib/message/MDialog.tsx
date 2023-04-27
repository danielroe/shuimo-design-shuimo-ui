/**
 * @description vue version dialog
 * @author 阿怪
 * @date 2023/04/10 11:59
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { defineComponent, ref, watch } from 'vue';
import { props } from '@shuimo-design/core/lib/message/dialog/api';

export default defineComponent({
  name: 'MDialog',
  props,
  emits: ['update:visible'],
  setup: (props, { emit, slots }) => {

    const visible = ref(props.visible);
    const handleClick = () => {
      visible.value = !visible.value;
      emit('update:visible', visible.value);
    };
    const closeDialog = () => {
      visible.value = false;
      emit('update:visible', visible.value);
    };

    watch(() => props.visible, (val) => {
      visible.value = val;
    });

    return () => {
      const getCloseDialog = () => {
        return <div onClick={(e: MouseEvent) => closeDialog()} class="m-dialog-close-btn m-cursor-pointer"/>;
      };
      const getActive = () => {
        return <div class="m-dialog-active" onClick={(e: MouseEvent) => handleClick()}>
          {slots.active?.()}
        </div>;
      };

      const getDialog = () => {
        return <div class={['m-dialog-mask', props.mask.show ? 'm-dialog-mask-bg' : '']}>
          <div class="m-dialog">
            {getCloseDialog()}
            {slots.default?.()}
          </div>
        </div>;
      };

      return <div class="m-dialog-wrapper">
        {getActive()}
        {visible.value ? getDialog() : ''}
      </div>;
    };
  }
});