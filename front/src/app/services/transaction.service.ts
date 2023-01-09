import { api } from "../api";

interface ListResponse<T> {
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  data: T[];
}

const transactionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query<
      ListResponse<{
        id: number;
        amount: number;
        description: string;
        created_at: string;
      }>,
      { page?: number; perPage?: number } | void
    >({
      query: ({ page, perPage } = { page: 1, perPage: 15 }) => ({
        url: `/transactions?page=${page ?? 1}&per_page=${perPage ?? 15}`,
        method: "GET",
      }),
      providesTags: ["Transaction"],
    }),
    getTransactionsSummary: build.query<
      {
        balance: number;
        expense: number;
        income: number;
      },
      void
    >({
      query: () => ({
        url: "/transactions/summary",
        method: "GET",
      }),
      providesTags: ["TransactionSummary"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTransactionsQuery, useGetTransactionsSummaryQuery } =
  transactionApi;
