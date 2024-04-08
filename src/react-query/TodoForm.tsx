import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef } from "react";
import { Todo } from "../hooks/useTodos";

const TodoForm = () => {
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  const addTodo = useMutation({
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
      }}
    >
      <div>
        <input ref={ref} type="text" />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default TodoForm;
