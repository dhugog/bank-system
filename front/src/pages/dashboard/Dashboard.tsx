import { Container, Drawer, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import {
  useGetTransactionsQuery,
  useGetTransactionsSummaryQuery,
} from "../../app/services/transaction.service";

import styles from "./Dashboard.module.css";
import PaginatedList from "../../components/PaginatedList";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppPagination } from "../../app/hooks";
import { toggleSideMenu } from "../../features/side-menu/sideMenuSlice";
import { useMemo, useState } from "react";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsPerPage] = useState(15);

  const {
    data: transactions,
    isFetching,
    hasNextPage,
  } = useAppPagination(
    useGetTransactionsQuery,
    transactionsPage,
    transactionsPerPage
  );

  const { data: summary, isFetching: isFetchingSummary } =
    useGetTransactionsSummaryQuery();

  return (
    <>
      <div className={styles.header}>
        <IconButton
          disableRipple={true}
          onClick={() => dispatch(toggleSideMenu())}
          style={{ position: "absolute", top: 0, bottom: 0 }}
        >
          <MenuIcon htmlColor="white" />
        </IconButton>

        <Typography variant="h6" align="center">
          BNB Bank
        </Typography>
      </div>

      <div className={styles.subHeader}>
        <Typography variant="body2" fontWeight="bold">
          Current balance
        </Typography>

        <Typography variant="h6">
          {isFetchingSummary
            ? "Loading..."
            : ((summary?.balance ?? 0) / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
        </Typography>
      </div>

      <div className={styles.incomes}>
        <div>
          <Typography variant="body2" color="primary" fontWeight="bold">
            Incomes
          </Typography>

          <Typography variant="h6" color="primary">
            {isFetchingSummary
              ? "Loading..."
              : ((summary?.income ?? 0) / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
          </Typography>
        </div>

        <IconButton
          disableRipple={true}
          onClick={() => navigate("/checks/deposit")}
        >
          <AddIcon color="primary" />
        </IconButton>
      </div>

      <div className={styles.expenses}>
        <div>
          <Typography variant="body2" color="primary" fontWeight="bold">
            Expenses
          </Typography>

          <Typography variant="h6" color="primary">
            {isFetchingSummary
              ? "Loading..."
              : ((summary?.expense ?? 0) / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
          </Typography>
        </div>

        <IconButton
          disableRipple={true}
          onClick={() => navigate("/purchases/add")}
        >
          <AddIcon color="primary" />
        </IconButton>
      </div>

      <Typography variant="body2" color="primary" mt={2} ml={2}>
        TRANSACTIONS
      </Typography>

      {isFetching && (
        <Typography color="primary" fontWeight="bold" p={2}>
          Loading...
        </Typography>
      )}

      {!isFetching && transactions?.length && (
        <PaginatedList
          onNext={() => setTransactionsPage(transactionsPage + 1)}
          hasMore={hasNextPage}
          items={
            transactions?.map((transaction) => ({
              ...transaction,
              date: transaction.created_at,
            })) ?? []
          }
        />
      )}
    </>
  );
};

export default Dashboard;
