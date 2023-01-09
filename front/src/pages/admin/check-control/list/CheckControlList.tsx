import { IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import styles from "./CheckControlList.module.css";
import React from "react";
import { toggleSideMenu } from "../../../../features/side-menu/sideMenuSlice";
import { useGetChecksQuery } from "../../../../app/services/check.service";
import { useAppDispatch } from "../../../../app/hooks";
import PaginatedList from "../../../../components/PaginatedList";
import { useNavigate } from "react-router-dom";

const CheckControlList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: checks, isFetching } = useGetChecksQuery({
    page: 1,
    status: "PENDING",
  });

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
          CHECKS CONTROL
        </Typography>
      </div>

      {!isFetching && (
        <PaginatedList
          onSelect={({ id }) => navigate(`/admin/checks/${id}`)}
          items={
            checks?.data?.map((check) => ({
              ...check,
              date: check.created_at,
            })) ?? []
          }
        />
      )}
    </>
  );
};

export default CheckControlList;
