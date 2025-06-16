import { apiSlice } from "./apiSlice"
import { USERS_URL } from "@/constants"
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/register`,
        method: "POST",
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
     updateProfilePicture: builder.mutation({
      query: (formData) => ({
        url: `/api/images/profile/picture`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["User"],
    }),
    deleteProfilePicture: builder.mutation({
      query: () => ({
        url: `/api/images/profile/picture`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getProfilePicture: builder.query({
      query: (userId) => ({
        url: `/api/images/profile/picture/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, userId) => [{ type: "User", id: `picture-${userId}` }],
    }),
    getProfileOfCurrentUser: builder.query({
      query: () => ({
        url:`${USERS_URL}/profile`,
        method: "GET",
        
      }),
      providesTags: ["User"],
      transformResponse: (response) => {
        // Transform the response to match the expected structure
        return {
          data: response,}
          
      }
      },
    ),
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/profile/${userId}`,
        method: "GET",
        
      }),
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    searchUsers: builder.query({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: `${USERS_URL}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getFollowers: builder.query({
      query: ({ fullName, page = 1, limit = 10 }) => ({
        url: `${USERS_URL}/followers?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { fullName }) => [{ type: "User", id: `followers-${fullName}` }],
    }),
    getFollowings: builder.query({
      query: ({ fullName, page = 1, limit = 10 }) => ({
        url: `${USERS_URL}/followings?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (_result, _error, { fullName }) => [{ type: "User", id: `following-${fullName}` }],
    }),

    followUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/follow/${userId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, userId) => [
        "User",
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/unfollow/${userId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, userId) => [
        "User",
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
    
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/block`,
        method: "POST",
        body: { friendId: userId },
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateProfileMutation,
  useGetProfileOfCurrentUserQuery,
  useGetUserProfileQuery,
  useGetAllUsersQuery,
  useSearchUsersQuery,
  useGetFollowersQuery,
  useGetFollowingsQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useBlockUserMutation,
  useUpdateProfilePictureMutation,
  useDeleteProfilePictureMutation,
  useGetProfilePictureQuery
} = userApiSlice
