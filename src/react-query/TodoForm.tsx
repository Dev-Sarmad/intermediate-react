import { useRef } from "react";
import useAddTodos from "../hooks/useAddTodos";

const TodoForm = () => {
  const ref = useRef<HTMLInputElement>(null);
  const addTodo = useAddTodos();

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
