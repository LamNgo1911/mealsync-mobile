import { User } from "@/types/user";
import { apiSlice } from "../api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, "id">>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    updateUserPreference: builder.mutation<
      User,
      { id: string; preference: User["userPreference"] }
    >({
      query: ({ id, preference }) => ({
        url: `/users/${id}/preference`,
        method: "PUT",
        body: preference,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUpdateUserPreferenceMutation,
} = userApiSlice;
