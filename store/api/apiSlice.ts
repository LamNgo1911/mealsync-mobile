import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://192.168.100.29:8081/api/v1",
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState).auth.token;
    console.log("prepareHeaders - Token from Redux:", token ? "EXISTS" : "MISSING");
    console.log("prepareHeaders - Token value:", token);
    console.log("prepareHeaders - Endpoint:", endpoint);

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      console.log("prepareHeaders - Authorization header set");
    } else {
      console.log("prepareHeaders - NO TOKEN, authorization header NOT set");
    }

    // Don't set Content-Type for FormData - let the browser set it with boundary
    // The browser will automatically set Content-Type: multipart/form-data with boundary
    if (!headers.has("Content-Type")) {
      // Only set if not already set (FormData will be handled automatically)
    }

    console.log("prepareHeaders - Final headers:", Object.fromEntries(headers.entries()));
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ["User", "Recipe"],
  endpoints: (builder) => ({}),
});
