import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { api } from "../api";

interface ListResponse<T> {
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  data: T[];
}

const purchaseApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPurchases: build.query<
      ListResponse<{
        id: number;
        amount: number;
        description: string;
        created_at: string;
      }>,
      { page?: number; perPage?: number } | void
    >({
      query: ({ page, perPage } = { page: 1, perPage: 10 }) => ({
        url: `/purchases?page=${page}&per_page=${perPage}`,
        method: "GET",
      }),
      providesTags: ["Purchase"],
    }),
    createPurchase: build.mutation<
      {},
      { amount: number; description: string; date: string }
    >({
      query: (args) => ({
        url: "/purchases",
        method: "POST",
        body: args,
      }),
      invalidatesTags: ["Purchase", "Transaction", "TransactionSummary"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreatePurchaseMutation, useGetPurchasesQuery } = purchaseApi;
