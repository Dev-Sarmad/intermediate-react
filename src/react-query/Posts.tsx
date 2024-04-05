import { useState } from "react";
import usePosts from "../hooks/usePosts";

function Posts() {
  const [userId, setUserId] = useState<number>();
  // pass the userId to fetch the specific data frim the backend
  const { data, isLoading, error } = usePosts(userId);
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading posts</p>;
  return (
    <>
      <select
        onChange={(e) => setUserId(parseInt(e.target.value))}
        value={userId}
      >
        <option value=""></option>
        <option value="1">User 1</option>
        <option value="2">User 2 </option>
        <option value="3">User #</option>
      </select>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>{post.body}</li>
        ))}
      </ul>
    </>
  );
}

export default Posts;
