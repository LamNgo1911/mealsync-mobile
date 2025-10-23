import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: { data: any }) => {
        const { token, ...userData } = response.data;
        return { accessToken: token, user: userData };
      },
    }),
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/users/register",
        method: "POST",
        body: userInfo,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApiSlice;
