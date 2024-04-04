import useTodos from "../hooks/useTodos";

function TodoList() {
  const { data: todos, error, isLoading } = useTodos();
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>loadingg....</p>;
  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

export default TodoList;
