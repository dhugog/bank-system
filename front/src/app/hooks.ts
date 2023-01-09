import { QueryDefinition } from "@reduxjs/toolkit/dist/query";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useMemo } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppPagination = (
  query: UseQuery<
    QueryDefinition<
      void | {
        page?: number | undefined;
        perPage?: number | undefined;
      },
      any,
      any,
      any
    >
  >,
  page: number,
  perPage: number
) => {
  const { data: lastPage } = query(
    {
      page: page - 1,
      perPage: perPage,
    },
    { skip: page === 1 }
  );

  const { data: currentPage } = query({
    page: page,
    perPage: perPage,
  });

  const { data: nextPage, isFetching } = query({
    page: page + 1,
    perPage: perPage,
  });

  const data = useMemo(() => {
    const arr = new Array(perPage * (page + 1));

    for (const data of [lastPage, currentPage, nextPage]) {
      if (data) {
        arr.splice(
          data.current_page * data.per_page,
          data.data.length,
          ...data.data
        );
      }
    }

    return arr.filter((item) => item);
  }, [perPage, page, lastPage, currentPage, nextPage]);

  const hasNextPage = useMemo(() => {
    return nextPage?.data.length === perPage;
  }, [nextPage, perPage]);

  return {
    data,
    page,
    perPage,
    isFetching,
    hasNextPage,
  };
};
