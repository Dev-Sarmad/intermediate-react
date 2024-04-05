import { useQuery } from "@tanstack/react-query";
import axios from "axios";
interface Post {
  id: number;
  body: string;
  userId: number;
}
const usePosts = (userId: number | undefined) => {
  const fetchPosts = () =>
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
        // passing the config object to fetch the specific results
        params: {
          userId,
        },
      })
      .then((response) => response.data);
  return useQuery<Post[], Error>({
    // setting up the queryKey
    queryKey: userId ? ["users", userId, "posts"] : ["posts"],
    queryFn: fetchPosts,
    // time to consider the data fresh
    staleTime: 10 * 60 * 1000, //1minute
  });
};
export default usePosts;
