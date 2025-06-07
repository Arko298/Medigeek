import { apiSlice } from "./apiSlice"
import { JOBS_URL } from "@/constants"

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `${JOBS_URL}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.jobs.map(({ _id }: { _id: string }) => ({
                type: "Job" as const,
                id: _id,
              })),
              { type: "Job", id: "LIST" },
            ]
          : [{ type: "Job", id: "LIST" }],
    }),
    getJobById: builder.query({
      query: (id) => ({
        url: `${JOBS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),
    createJob: builder.mutation({
      query: (data) => ({
        url: `${JOBS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),
    toggleLikeJob: builder.mutation({
      query: (id) => ({
        url: `${JOBS_URL}/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Job", id }],
    }),
    addJobComment: builder.mutation({
      query: ({ id, text }) => ({
        url: `${JOBS_URL}/${id}/comment`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Job", id }],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `${JOBS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Job", id: "LIST" }],
    }),
    updateJob: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${JOBS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Job", id },
        { type: "Job", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useToggleLikeJobMutation,
  useAddJobCommentMutation,
  useDeleteJobMutation,
  useUpdateJobMutation,
} = jobApiSlice
