import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

const useTodos = () => {
  const fetchTodos = () =>
    axios
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.data);
  return useQuery<Todo[], Error>({
    // First pass the useQuery hook a confiq object which contains the quetKey and the Queryfunction
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
};
export default useTodos;
