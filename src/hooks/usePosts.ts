import { useQuery } from "@tanstack/react-query";
import axios from "axios";
interface Post {
  id: number;
  body: string;
  userId: number;
}
const usePosts = () => {
  const fetchPosts = () =>
    axios
      .get<Post[]>("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.data);
  return useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};
export default usePosts;
