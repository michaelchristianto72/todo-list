import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { Todo } from './todo.model'

const todosApi = createApi({
  reducerPath: 'todos',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  tagTypes: ['Todos'],
  endpoints: (build) => ({
    getTodos: build.query<Todo[], any>({
      query: (start) => `todos?_start=${start}&_limit=10`,
      providesTags: ['Todos'],
    }),
    addTodo: build.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: `todos`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Todos'],
    }),
  }),
})


export const { 
  useGetTodosQuery,
  useAddTodoMutation,
  util
} = todosApi;

export const { reducerPath, reducer, middleware } = todosApi;

export const { getTodos } = todosApi.endpoints;