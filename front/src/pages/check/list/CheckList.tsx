import { Box, Fab, IconButton, Tab, Tabs, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";

import styles from "./CheckList.module.css";
import React, { useState } from "react";
import { useGetChecksQuery } from "../../../app/services/check.service";
import PaginatedList from "../../../components/PaginatedList";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { toggleSideMenu } from "../../../features/side-menu/sideMenuSlice";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CheckList = () => {
  const [tab, setTab] = useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const tabStatusMap = new Map([
    [0, "PENDING"],
    [1, "APPROVED"],
    [2, "REJECTED"],
  ]);

  const { data: checks, isFetching } = useGetChecksQuery({
    page: 1,
    status: tabStatusMap.get(tab) ?? "PENDING",
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
          CHECKS
        </Typography>
      </div>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={(_event: React.SyntheticEvent, newValue: number) =>
            setTab(newValue)
          }
          aria-label="check status"
          variant="fullWidth"
        >
          <Tab label="Pending" {...a11yProps(0)} />
          <Tab label="Approved" {...a11yProps(1)} />
          <Tab label="Rejected" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {!isFetching && (
        <PaginatedList
          items={
            checks?.data?.map((check) => ({
              ...check,
              date: check.created_at,
            })) ?? []
          }
        />
      )}

      <Box display="flex" justifyContent="flex-end">
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate("/checks/deposit")}
        >
          <AddIcon />
        </Fab>
      </Box>
    </>
  );
};

export default CheckList;
