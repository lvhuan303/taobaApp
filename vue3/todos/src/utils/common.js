export default function debounce(handle, wait, immediate) {
  // 参数类型判断及默认值处理
  if (typeof handle !== 'function') throw new Error('handle must be an function')
  if (typeof wait === 'undefined') wait = 300
  if (typeof wait === 'boolean') {
    immediate = wait
    wait = 300
  }
  if (typeof immediate !== 'boolean') immediate = false

  // 所谓的防抖效果我们想要实现的就是有一个 ”人“ 可以管理 handle 的执行次数
  // 如果我们想要执行最后一次，那就意味着无论我们当前点击了多少次，前面的N-1次都无用
  let timer = null

  return function proxy(...args) {
    let self = this,
      init = immediate && !timer

    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = null
      !immediate ? handle.call(self, ...args) : null
    }, wait)

    // 如果当前传递进来的是 true 就表示我们需要立即执行
    // 如果想要实现只在第一次执行，那么可以添加上 timer 为 null 做为判断
    // 因为只要 timer 为 Null 就意味着没有第二次....点击
    init ? handle.call(self, ...args) : null
  }
}

