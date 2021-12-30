<template>
    <div>
    <section id="app" class="todoapp">
        <header class="header">
            <h1>todos</h1>
            <input
                    class="new-todo"
                    placeholder="What needs to be done?"
                    autocomplete="off"
                    autofocus
                    v-model="input"
                    @keyup.enter="addTodo"
            >
        </header>
        <section class="main" v-show="count">
            <input id="toggle-all" class="toggle-all" v-model="allDone" type="checkbox">
            <label for="toggle-all">Mark all as complete</label>
            <ul class="todo-list">
                <li v-for="todo in filterTodos"
                    :key="todo"
                    :class="{editing: todo === editingTodo,completed:todo.completed}"
                >
                    <div class="view">
                        <input class="toggle" type="checkbox" v-model="todo.completed">
                        <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
                        <button class="destroy" @click="remove(todo)"></button>
                    </div>
                  <input
                    class="edit"
                    type="text"
                    v-editing-focus="todo === editingTodo"
                    v-model="todo.text"
                    @blur="doneEdit(todo)"
                    @keyup.enter="doneEdit(todo)"
                    @keyup.esc="cancelEdit(todo)"
                  >
                </li>
            </ul>
        </section>
      <footer class="footer" v-if="count">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong> {{ remainingCount > 1 ? 'items' : 'item' }} left
      </span>
            <ul class="filters">
                <li><a href="#/all">All</a></li>
                <li><a href="#/active">Active</a></li>
                <li><a href="#/completed">Completed</a></li>
            </ul>
            <button class="clear-completed" @click="removeCompleted" v-if="count > remainingCount">
                Clear completed
            </button>
        </footer>
    </section>
    <footer class="info">
        <p>Double-click to edit a todo</p>
        <!-- Remove the below line ↓ -->
        <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
        <!-- Change this out with your name and url ↓ -->
        <p>Created by <a href="https://www.lagou.com">教瘦</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
    </div>
</template>

<script>
import '../assets/index.css'
import {ref, computed, onMounted, onUnmounted, watchEffect, watch} from 'vue'
import useLocalStorage from '../utils/useLocalStorage.js'

const storage = useLocalStorage()
// 创建事项
function useAdd(todos) {
  const input = ref('')
  const addTodo = () => {
    const text = input.value && input.value.trim()
    const id = todos.value.length
    todos.value.unshift({
      id,
      text,
      completed: false
    })
    input.value = ''
  }
  return {
    input,
    addTodo
  }
}

// 删除事项
function removeTodo(todos) {
  const remove = (todo) => {
    const index = todos.value.indexOf(todo)
    todos.value.splice(index,1)
  }
  const removeCompleted = () => {
    todos.value = todos.value.filter(item=>!item.completed)
  }

  return {
    remove,
    removeCompleted
  }
}

function useEdit(remove) {
  // 记录之前的值
  let beforeEditingText = ''
  let editingTodo = ref(null)
  const editTodo = todo => {
    beforeEditingText = todo.text
    editingTodo.value = todo
  }
  const doneEdit = todo => {
    if (!editingTodo.value) return
    todo.text && todo.text.trim()
    todo.text || remove(todo)
    editingTodo.value = null
  }
  const cancelEdit = todo => {
    editingTodo.value = null
    todo.text = beforeEditingText
  }
  return {
    editTodo,
    editingTodo,
    doneEdit,
    cancelEdit
  }
}

const useFilter = todos => {
  const allDone = computed({
    get () {
      return !todos.value.filter(todo => !todo.completed).length
    },
    set (value) {
      todos.value.forEach(todo => {
        todo.completed = value
      })
    }
  })

  const filter = {
    all: list => list,
    active: list => list.filter(todo => !todo.completed),
    completed: list => list.filter(todo => todo.completed)
  }

  const type = ref('all')

  // 过滤后的事项
  const filterTodos = computed(() => filter[type.value](todos.value))
  console.log(filterTodos)
  // 进行中的事项
  const remainingCount = computed(() => filter.active(todos.value).length)

  const count = computed(() => todos.value.length)
  console.log(count.value)
  const onHashChange = () => {
    const hash = window.location.hash.replace('#/','')

    if (filter[hash]) {
      type.value = hash
    } else {
      type.value = 'all'
      window.location.hash = ''
    }

  }
  onMounted(() => {
    window.addEventListener('hashchange',onHashChange)
    onHashChange()
  })
  onUnmounted(() => {
    window.removeEventListener('hashchange', onHashChange)
  })

  return {
    allDone,
    count,
    remainingCount,
    filterTodos
  }
}

const useStore = () => {
  const KEY = 'TODOKEYS'

  const todos = ref(storage.getItem(KEY) || [])

  watchEffect(() => {
    storage.setItem(KEY,todos.value)
  })
  return todos
}

export default {
  name: "Home.vue",
  setup () {

    const todos = useStore()
    // const num = '100.2&'
    // console.log(parseFloat(num) == num)
    // const str = "1.2&<2.4"
    // console.log(str.replace(/\.\d+/g, ''))
    const { remove,removeCompleted} = removeTodo(todos)
    return {
      todos,
      remove,
      removeCompleted,
      ...useAdd(todos),
      ...useEdit(remove),
      ...useFilter(todos)
    }
  },
  directives: {
    editingFocus: (el, binding) => {
      binding.value && el.focus()
    }
  }
}
</script>

<style scoped>

</style>
