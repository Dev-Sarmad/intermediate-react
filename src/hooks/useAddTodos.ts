import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "./useTodos";
import { CACHE_TODOS_KEY } from "../react-query/Constants";
import APIClient from "../Services/api-client";

interface AddTodoContext {
  previousTodos: Todo[];
}
const useAddTodos = () => {
  const apiClient = new APIClient<Todo>("/todos");
  const queryClient = useQueryClient();
  //Todo: The data we get from the backend and 2nd Todo is data we are sending to the backend
  return useMutation<Todo, Error, Todo, AddTodoContext>({
    mutationFn: apiClient.getPost,
    //execute before the mutation function
    onMutate: (newTodo: Todo) => {
      //previous todos before the update of cache
      const previousTodos =
        queryClient.getQueryData<Todo[]>(CACHE_TODOS_KEY) || [];
      queryClient.setQueryData<Todo[]>(CACHE_TODOS_KEY, (todos) => [
        newTodo,
        ...(todos || []),
      ]);
      return { previousTodos };
    },
    onSuccess: (savedTodos, newTodo) => {
      //updating the newtodos to saved todos onsuccess callback
      queryClient.setQueryData<Todo[]>(CACHE_TODOS_KEY, (todos) =>
        todos?.map((todo) => (todo === newTodo ? savedTodos : todo))
      );
    },
    // If the error accure we will update the UI
    // here context is the object which is use to pass the data in-between the callbacks
    //context objects contains the previous todos in cache
    onError: (error, newTodo, context) => {
      if (!context) return;
      queryClient.setQueryData<Todo[]>(CACHE_TODOS_KEY, context.previousTodos);
    },
  });
};
export default useAddTodos;
