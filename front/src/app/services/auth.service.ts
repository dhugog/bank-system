import { api } from "../api";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUserDetails: build.query<any, void>({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetUserDetailsQuery } = authApi;
