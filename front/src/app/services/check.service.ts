import { api } from "../api";

interface ListResponse<T> {
  current_page: number;
  from: number;
  to: number;
  per_page: number;
  data: T[];
}

const checkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getChecks: build.query<
      ListResponse<{
        id: number;
        amount: number;
        description: string;
        created_at: string;
      }>,
      { page?: number; status?: string } | void
    >({
      query: ({ page, status } = { page: 1, status: "PENDING" }) => ({
        url: `/checks?page=${page}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Check"],
    }),
    getCheck: build.query<
      {
        id: number;
        amount: number;
        description: string;
        created_at: string;
        account: any;
      },
      number | void
    >({
      query: (id: number) => ({
        url: `/checks/${id}`,
        method: "GET",
      }),
      providesTags: ["Check"],
    }),
    createCheck: build.mutation<{}, FormData>({
      query: (args) => ({
        url: "/checks",
        method: "POST",
        body: args,
      }),
      invalidatesTags: ["Check"],
    }),
    approveCheck: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/checks/${id}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Check", "Transaction", "TransactionSummary"],
    }),
    rejectCheck: build.mutation<void, number>({
      query: (id: number) => ({
        url: `/checks/${id}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Check", "Transaction", "TransactionSummary"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetChecksQuery,
  useGetCheckQuery,
  useCreateCheckMutation,
  useApproveCheckMutation,
  useRejectCheckMutation,
} = checkApi;
