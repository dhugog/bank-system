import { Box, Fab, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";

import styles from "./PurchaseList.module.css";
import PaginatedList from "../../../components/PaginatedList";
import { useNavigate } from "react-router-dom";
import { useGetPurchasesQuery } from "../../../app/services/purchase.service";
import { useAppDispatch, useAppPagination } from "../../../app/hooks";
import { toggleSideMenu } from "../../../features/side-menu/sideMenuSlice";
import { useState } from "react";

const PurchaseList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [perPage] = useState(15);

  const {
    data: purchases,
    isFetching,
    hasNextPage,
  } = useAppPagination(useGetPurchasesQuery, page, perPage);

  return (
    <>
      <div className={styles.header}>
        <IconButton
          disableRipple={true}
          onClick={() => dispatch(toggleSideMenu())}
          style={{ position: "absolute", top: 0, bottom: 0 }}
        >
          <MenuIcon color="primary" />
        </IconButton>

        <Typography
          variant="body2"
          align="center"
          color="primary"
          fontWeight="bold"
        >
          EXPENSES
        </Typography>
      </div>

      {!isFetching && (
        <PaginatedList
          onNext={() => setPage((page) => page + 1)}
          hasMore={hasNextPage}
          items={
            purchases?.map((purchase) => ({
              ...purchase,
              date: purchase.created_at,
            })) ?? []
          }
        />
      )}

      <Box display="flex" justifyContent="flex-end">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate("/purchases/add")}
        >
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
};

export default PurchaseList;
