import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleSideMenu } from "../features/side-menu/sideMenuSlice";
import styles from "./SideMenu.module.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PaymentsIcon from "@mui/icons-material/Payments";
import RuleIcon from "@mui/icons-material/Rule";
import { useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery } from "../app/services/auth.service";
import { logout } from "../features/auth/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { api } from "../app/api";

const SideMenu = () => {
  const { open } = useAppSelector((state) => state.sideMenu);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token } = useAppSelector((state) => state.auth);

  const { data: user } = useGetUserDetailsQuery(undefined, {
    skip: !token,
  });

  const permissions = user?.roles
    .flatMap((role: any) => role.permissions)
    .map((permission: any) => permission.slug);

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={() => dispatch(toggleSideMenu())}
    >
      <div className={styles.header}>
        <Typography color="white" variant="h4" textAlign="center" my={2}>
          BNB Bank
        </Typography>
      </div>

      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => dispatch(toggleSideMenu())}
        onKeyDown={() => dispatch(toggleSideMenu())}
      >
        <List>
          <ListItem key={"dashboard"} disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={"expenses"} disablePadding>
            <ListItemButton onClick={() => navigate("/purchases")}>
              <ListItemIcon>
                <TrendingDownIcon />
              </ListItemIcon>
              <ListItemText primary={"Expenses"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={"checks"} disablePadding>
            <ListItemButton onClick={() => navigate("/checks")}>
              <ListItemIcon>
                <PaymentsIcon />
              </ListItemIcon>
              <ListItemText primary={"Checks"} />
            </ListItemButton>
          </ListItem>

          <ListItem key={"logout"} disablePadding>
            <ListItemButton
              onClick={() => {
                dispatch(logout());
                dispatch(api.util.resetApiState());

                navigate("/login");
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItemButton>
          </ListItem>

          {permissions?.includes("check:list-all") && (
            <>
              <Divider />
              <ListItem key={"checks-control"} disablePadding>
                <ListItemButton onClick={() => navigate("/admin/checks")}>
                  <ListItemIcon>
                    <RuleIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Checks control"} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
