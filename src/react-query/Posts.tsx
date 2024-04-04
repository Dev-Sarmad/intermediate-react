import usePosts from "../hooks/usePosts";

function Posts() {
  const { data, isLoading, error } = usePosts();
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading posts</p>;
  return (
    <ul>
      {data?.map((post) => (
        <li key={post.id}>{post.body}</li>
      ))}
    </ul>
  );
}

export default Posts;
