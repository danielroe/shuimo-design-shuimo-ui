/**
 * @Description 奇遇弹窗
 * @Author: 南歌子
 * @Date 2021/4/1 16:29
 * @version V1.0.0
 *
 * Hello, humor
 */

import { h, defineComponent, Teleport } from 'vue';
import { CLOSE_EVENT, CONFIRM_EVENT } from "../../dependents/_utils/constants";
import DialogHandler from "../../dependents/_composables/DialogHandler";

export default defineComponent({
  name: 'WAdventureDialog',
  props: {
    mask: { type: Object, default: { show: true, clickClose: false } },
    visible: { type: Boolean, default: false },
    confirmText: { type: String, default: '我知道了' }
  },
  emits: [CLOSE_EVENT, CONFIRM_EVENT],
  setup(props, context) {
    const { pes, maskClass, resetSize, maskClick, closeDialog, confirmDialog } = DialogHandler(props, context);
    return { pes, maskClass, resetSize, maskClick, closeDialog, confirmDialog };
  },
  computed: {
    baseStyle() {
      const baseH = 235, baseW = 384, basePaddingTop = 100, basePaddingSide = 50, basePaddingLeft = 100;
      const { pes } = this;
      return {
        'padding-top': `${basePaddingTop * pes}px`,
        'padding-left': `${basePaddingLeft * pes}px`,
        'padding-right': `${basePaddingSide * pes}px`,
        'height': `${baseH * pes}px`,
        'width': `${baseW * pes}px`,
      }
    },
    closeBtnBaseStyle() {
      const top = 20, left = 490;
      const { pes } = this;
      return {
        'top': `${top * pes}px`,
        'left': `${left * pes - 23}px`,
      }
    },
    girlBaseStyle() {
      const left = 0, baseH = 350, baseW = 263, bottom = 15;
      const { pes } = this;
      return {
        'bottom': `${bottom * pes}px`,
        'left': `${left * pes}px`,
        'height': `${baseH * pes}px`,
        'width': `${baseW * pes}px`,
      }
    }
  },
  render() {
    const classes = this.maskClass;
    const { visible, mask, confirmText } = this;
    const { maskClick, closeDialog, confirmDialog } = this;
    if (!visible) {
      return null;
    }
    const { resetSize } = this;
    this.$nextTick(() => {
      resetSize(235, 384);
    });
    return (
      <Teleport to="body">
        <div class={classes} onClick={mask.clickClose ? maskClick : undefined}>
          <div class="w-adventure-dialog" style={this.baseStyle}>
            <div class="dialog-girl" style={this.girlBaseStyle}/>
            <div class="dialog-close-btn" style={this.closeBtnBaseStyle} onClick={closeDialog}/>
            {this.$slots.default!()}
            <div class="dialog-confirm-btn" onClick={confirmDialog}>{confirmText}</div>
          </div>
        </div>
      </Teleport>
    )
  }
});
