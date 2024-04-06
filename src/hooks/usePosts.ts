import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
interface Post {
  id: number;
  body: string;
  userId: number;
}
interface PostQuery {
  pageSize: number;
}
const usePosts = (query: PostQuery) => {
  // change the useQuery to useInfiniteQueryhook
  return useInfiniteQuery<Post[], Error>({
    // so any time the query changes the react query will fetch the post
    queryKey: ["posts", query],
    //pageParam is the property in useInfinite
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
          // passing the config object to fetch the specific results
          params: {
            //index of starting postion
            _start: (pageParam - 1) * query.pageSize,
            _limit: query.pageSize,
          },
        })
        .then((response) => response.data),
    // time to consider the data fresh
    staleTime: 1 * 60 * 1000, //1minute
    getNextPageParam: (lastPage, allPages) => {
      //retuning the next page number and now pass this function to queryFn
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};
export default usePosts;
