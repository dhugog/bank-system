import { api } from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserDetails: build.query<any, void>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserDetailsQuery } = authApi;
