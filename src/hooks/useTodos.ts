import { useQuery } from "@tanstack/react-query";
import { CACHE_TODOS_KEY } from "../react-query/Constants";
import APIClient from "../Services/api-client";

export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const useTodos = () => {
  const apiCLient = new APIClient<Todo>("/todos");

  return useQuery<Todo[], Error>({
    // First pass the useQuery hook a confiq object which contains the quetKey and the Queryfunction
    queryKey: CACHE_TODOS_KEY,
    queryFn: apiCLient.getAll,
  });
};
export default useTodos;
