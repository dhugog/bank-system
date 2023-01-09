import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost/api",
    prepareHeaders: (headers, { getState }: any) => {
      const token = getState().auth.token;

      headers.set("Accept", "application/json");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        return headers;
      }
    },
  }),
  tagTypes: ["Check", "Purchase", "Transaction", "TransactionSummary"],
  endpoints: () => ({}),
});
