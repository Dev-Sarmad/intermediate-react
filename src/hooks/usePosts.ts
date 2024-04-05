import { useQuery } from "@tanstack/react-query";
import axios from "axios";
interface Post {
  id: number;
  body: string;
  userId: number;
}
interface PostQuery {
  page: number;
  pageSize: number;
}
const usePosts = (query: PostQuery) => {
  const fetchPosts = () =>
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
        // passing the config object to fetch the specific results
        params: {
          //index of starting postion
          _start: (query.page - 1) * query.pageSize,
          _limit: query.pageSize,
        },
      })
      .then((response) => response.data);
  return useQuery<Post[], Error>({
    // so any time the query changes the react query will fetch the post
    queryKey: ["posts", query],
    queryFn: fetchPosts,
    // time to consider the data fresh
    staleTime: 1 * 60 * 1000, //1minute
  });
};
export default usePosts;
