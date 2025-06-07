import { apiSlice } from "./apiSlice";
import { POST_URL } from "@/constants";
export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${POST_URL}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.posts.map(({ _id }: { _id: string }) => ({
                type: "Post" as const,
                id: _id,
              })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    getPostById: builder.query({
      query: (id) => ({
        url: `${POST_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: `${POST_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    getPostsByUser: builder.query({
      query: ({ userId, page, limit }) => ({
        url: `${POST_URL}/user/${userId}`,
        params: { page, limit },
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.data.posts.map(({ _id }: { _id: string }) => ({
                type: "Post" as const,
                id: _id,
              })),
              { type: "Post", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Post", id: "PARTIAL-LIST" }],
    }),
    toggleLikePost: builder.mutation({
      query: (id) => ({
        url: `${POST_URL}/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
    addComment: builder.mutation({
      query: ({ id, text }) => ({
        url: `${POST_URL}/${id}/comment`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `${POST_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${POST_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useGetPostsByUserQuery,
  useToggleLikePostMutation,
  useAddCommentMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postApiSlice;
