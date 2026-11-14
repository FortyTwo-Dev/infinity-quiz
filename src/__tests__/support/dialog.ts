/**
 * jsdom does not implement the `<dialog>` modality: `showModal` and `close`
 * are missing, so a component using them throws in tests.
 *
 * This is a harness concern, not a production one: the platform provides both
 * methods, so the component calls them without a fallback. Import this module
 * from a spec that mounts a dialog.
 */
export function installDialogSupport(): void {
  if (typeof HTMLDialogElement === 'undefined') return

  const proto = HTMLDialogElement.prototype

  if (!Object.getOwnPropertyDescriptor(proto, 'open')) {
    Object.defineProperty(proto, 'open', {
      configurable: true,
      get(this: HTMLDialogElement) {
        return this.hasAttribute('open')
      },
    })
  }

  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '')
    }
    proto.show = proto.showModal
  }

  if (typeof proto.close !== 'function') {
    proto.close = function close(this: HTMLDialogElement) {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  }
}
