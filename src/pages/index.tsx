import { getTodos, useGetTodosQuery, useAddTodoMutation, util } from "../todosApi";
import { useState } from "react";
import { Todo } from "../todo.model";
import { wrapper } from "../store";

const TodoList = (props: any) => {
  const [newTodo, setNewTodo] = useState<string>(props.newTodo);
  const [start, setStart] = useState<number>(props.start);
  
  const {
    data: todos,
    isLoading,
    isSuccess,
  } = useGetTodosQuery(start);

  const [addTodo] = useAddTodoMutation();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    addTodo({ userId: 1, title: newTodo, completed: false });
    setNewTodo("");
  };

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = todos.map((todo: Todo, key: number) => {
      return (
        <div className="todo" key={key}>
          <label>{todo.id} - {todo.title}</label>
        </div>
      );
    });
  }

  return (
    <main>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <h3>Enter a new todo item here:</h3>
        <div className="new-todo">
          <input
            type="text"
            id="new-todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new todo item"
          />
        </div>
        <button className="submit">Submit</button>
      </form>
      <div className="todo-list">
        {content}
      </div>
      <button
        className="actions"
        disabled={start === 0}
        onClick={() => setStart(start - 10)}
      >
        Previous
      </button>
      <button
        className="actions"
        disabled={todos && todos.length < 10}
        onClick={() => setStart(start + 10)}
      >
        Next
      </button>
    </main>
  );
};

export const getStaticProps = wrapper.getStaticProps(
  store => async () => {
    const start = 0;
    const newTodo = "";
    store.dispatch(getTodos.initiate(0));
    await Promise.all(store.dispatch(util.getRunningQueriesThunk()));
    return {
      props: {
        start, newTodo
      },
      revalidate: 10,
    }
  }
);

export default TodoList;