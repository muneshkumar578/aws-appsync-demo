<template>
  <div id="app">
    <h1>Todo App</h1>
    <input type="text" v-model="name" placeholder="Todo name">
    <input type="text" v-model="description" placeholder="Todo description">
    <button v-on:click="createTodo">Create Todo</button>
    <div v-for="item in todos" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { onCreateTodo } from './graphql/subscriptions';

export default {
  name: 'App',
  created() {
    this.getTodos();
    this.subscribe();
  },
  data() {
    return {
      name: '',
      description: '',
      todos: []
    }
  },
  methods: {
    getTodos() {
      this.$apollo.query({
        query: gql(listTodos)
      }).then(({ data }) => {
        this.todos = data.listTodos.items;
      });
      
    },
    
    createTodo() {
      const { name, description } = this;
      if (!name || !description) return;
      const todo = { name, description };
      //this.todos = [...this.todos, todo];
      this.$apollo.mutate({
        mutation: gql(createTodo),
        variables: {input: todo},
      });
      this.name = '';
      this.description = '';
    },

    subscribe() {
      this.$apollo.subscribe({ query: gql(onCreateTodo) })
        .subscribe({
          next: (eventData) => {
            let todo = eventData.data.onCreateTodo;
            alert(`New item added: ${todo.name}`);
            if (this.todos.some(item => item.name === todo.name)) return; // remove duplications
            this.todos = [...this.todos, todo];
          }
        });
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
