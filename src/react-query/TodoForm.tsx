import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";

const TodoForm = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  //Todo: The data we get from the backend and 2nd Todo is data we are sending to the backend
  const addTodo = useMutation<Todo, Error, Todo>({
    mutationFn: (todo: Todo) =>
      axios
        .post<Todo>("https://jsonplaceholder.typicode.com/todos", todo)
        .then((response) => response.data),
    // as we get the results it will (update the data in the cache) by this.
    onSuccess: (savedTodos) => {
      queryClient.setQueryData<Todo[]>(["todos"], (todos) => [
        savedTodos,
        ...(todos || []),
        // we can also do this by (invalidating cache)
        // queryClient.invalidateQueries({
        //     queryKey:['todos'],
        // })
      ]);
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
