import { useState } from "react";
import usePosts from "../hooks/usePosts";

function Posts() {
  const pageSize = 10;
  // state for keeping track of page number
  const [page, setPage] = useState<number>(1);
  // pass the query object
  const { data, isLoading, error } = usePosts({ page, pageSize });
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading posts</p>;
  return (
    <>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>{post.body}</li>
        ))}
      </ul>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </>
  );
}

export default Posts;
