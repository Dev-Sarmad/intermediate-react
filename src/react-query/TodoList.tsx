import axios from "axios";
import { useQuery } from "@tanstack/react-query";
interface Todo {
  id: number;
  title: string;
  userId: number;
  completed: boolean;
}

function TodoList() {
  const fetchTodos = () =>
    axios
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.data);

  const { data: todos, error } = useQuery<Todo[], Error>({
    // First pass the useQuery hook a confiq object which contains the quetKey and the Queryfunction
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
  if (error) return <p>{error.message}</p>;
  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

export default TodoList;
