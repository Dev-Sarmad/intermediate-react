import React from "react";
import usePosts from "../hooks/usePosts";

function Posts() {
  const pageSize = 10;
  // pass the query object
  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    usePosts({ pageSize });
  if (error) return <p>{error.message}</p>;
  if (isLoading) return <p>Loading posts</p>;
  return (
    <>
      <ul>
        {/* here the data is not the array of post but it is post[][] */}
        {data.pages.map((page, index) => (
          <React.Fragment key={index}>
            {/* single post data  */}
            {page.map((post) => (
              <li key={post.id}>{post.body}</li>
            ))}
          </React.Fragment>
        ))}
      </ul>

      <button disabled={isFetchingNextPage} onClick={() => fetchNextPage()}>
        {isFetchingNextPage ? "Fetchin the data " : "Load More"}
      </button>
    </>
  );
}

export default Posts;
