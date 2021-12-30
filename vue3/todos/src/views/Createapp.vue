<template>
  <div>
    x: {{ x }} <br>
    y: {{ y }}
    <hr>
    <button @click="clickBtn">按钮</button>
    <span>{{count}}</span>
    <hr>
    <button @click="push">按钮</button>
    <span>未完成:{{activeCount}}</span>
    <hr>
    <button @click="wstop">测试</button>
    <p>
      请问一个 yes/no 的问题:
      <input v-model="question"
      >
    </p>
    <p>{{ answer }}</p>
    <hr>
    <button @click="increase">increase</button>
    <button @click="stop">stop</button>
    <br>
    {{ wcount }}
  </div>
</template>

<script>
import {onMounted, onUnmounted, reactive, toRefs, ref, computed, watch, watchEffect} from "vue";
import debounce from '../utils/common'

function useMoursePosition() {
  const position = reactive({
    x: 0,
    y: 0
  })
  const update = e => {
    position.x = e.pageX
    position.y = e.pageY
  }
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  return toRefs(position)
}

function useRefCount() {
  const count = ref(0)
  const clickBtn = () => {
    count.value++
  }
  return {
    count,
    clickBtn
  }
}
const data = [
  { text: '看书', completed: false },
  { text: '敲代码', completed: false },
  { text: '约会', completed: true }
]
function useComputed() {
  const todos = reactive(data)

  const activeCount = computed(() => {
    return todos.filter(item=>!item.completed).length
  })
  // 点击事件
  const push = () => {
    todos.push({ text: '看书', completed: false })
  }

  return {
    activeCount,
    push
  }
}

function useWatch() {
  const question = ref('')
  const answer = ref('')

  const getAnswer = debounce(async () => {
    const response =await fetch('https://www.yesno.wtf/api')
    const data =await response.json()
    answer.value = data.answer
  }, 300,false)

  const wstop = watch(question, (newVal,oldVal) => {
    getAnswer()
  })

  return {
    question,
    answer,
    wstop
  }
}

function useWatchEffect() {
  const wcount = ref(0)
  const increase = () => {
    wcount.value++
  }

  // watchEffect与watch区别，页面加载会执行一次
  const stop = watchEffect(() => {
    console.log(wcount.value)
  })
  return {
    wcount,
    increase,
    stop,
  }
}
export default {
  name: "Createapp.vue",

  setup() {
    const {x, y} = useMoursePosition()
    return {
      x,
      y,
      ...useRefCount(),
      ...useComputed(),
      ...useWatch(),
      ...useWatchEffect()
    }
  }
}
</script>

<style scoped>

</style>
