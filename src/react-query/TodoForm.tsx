import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";
interface AddTodoContext {
  previousTodos: Todo[];
}
const TodoForm = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  //Todo: The data we get from the backend and 2nd Todo is data we are sending to the backend
  const addTodo = useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((response) => response.data),
    //execute before the mutation function
    onMutate: (newTodo: Todo) => {
      //previous todos before the update of cache
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        newTodo,
        ...(todos || []),
      ]);
      return { previousTodos };
    },
    onSuccess: (savedTodos, newTodo) => {
      //updating the newtodos to saved todos onsuccess callback
      queryClient.setQueryData<Todo[]>(["todos"], (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodos : todo))
      );
    },
    // If the error accure we will update the UI
    // here context is the object which is use to pass the data in-between the callbacks
    //context objects contains the previous todos in cache
    onError: (error, newTodo, context) => {
      if (!context) return;
      queryClient.setQueryData<Todo[]>(["todos"], context.previousTodos);
    },
  });

  return (
    <>
      {addTodo.error && <p>{addTodo.error.message}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //these values will be passed to the useMutationhooks mutationFn
          if (ref.current && ref.current.value)
            addTodo.mutate({
              id: 0,
              title: ref.current?.value,
              completed: false,
              userId: 1,
            });
          if (ref.current) ref.current.value = "";
        }}
      >
        <div>
          <input ref={ref} type="text" />
        </div>
        <div>
          <button type="submit">
            {addTodo.isLoading ? "Adding todo..." : "Add"}
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
