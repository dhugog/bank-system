import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import styles from "./CheckControlDetail.module.css";
import { toggleSideMenu } from "../../../../features/side-menu/sideMenuSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useNavigate, useParams } from "react-router-dom";
import {
  useApproveCheckMutation,
  useGetCheckQuery,
  useRejectCheckMutation,
} from "../../../../app/services/check.service";
import PersonIcon from "@mui/icons-material/Person";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import EmailIcon from "@mui/icons-material/Email";
import NumbersIcon from "@mui/icons-material/Numbers";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { toast } from "react-toastify";

const CheckControlDetail = () => {
  const [image, setImage] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAppSelector((state) => state.auth);

  const { data: check } = useGetCheckQuery(Number(id));

  const [approve] = useApproveCheckMutation();
  const [reject] = useRejectCheckMutation();

  useEffect(() => {
    if (token && !image) {
      fetch("http://localhost/api/checks/1/image", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((response) => {
        response.blob().then((blob) => {
          setImage(URL.createObjectURL(blob));
        });
      });
    }
  }, [token, image]);

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
          CHECK DETAILS
        </Typography>
      </div>

      <List sx={{ width: "100%" }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primaryTypographyProps={{
              fontSize: "small",
              color: "primary.light",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
            primary="Customer"
            secondary={check?.account?.user?.name ?? "-"}
            secondaryTypographyProps={{
              variant: "body1",
              color: "primary",
            }}
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <EmailIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primaryTypographyProps={{
              fontSize: "small",
              color: "primary.light",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
            primary="Customer Email"
            secondary={check?.account?.user?.email ?? "-"}
            secondaryTypographyProps={{
              variant: "body1",
              color: "primary",
            }}
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NumbersIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primaryTypographyProps={{
              fontSize: "small",
              color: "primary.light",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
            primary="Account"
            secondary={check?.account?.number ?? "-"}
            secondaryTypographyProps={{
              variant: "body1",
              color: "primary",
            }}
          />
        </ListItem>

        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AttachMoneyIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primaryTypographyProps={{
              fontSize: "small",
              color: "primary.light",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
            primary="Reported amount"
            secondary={((check?.amount ?? 0) / 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
            secondaryTypographyProps={{
              variant: "body1",
              color: "primary",
            }}
          />
        </ListItem>

        {image && <img src={image} alt="check" style={{ width: "100%" }} />}

        <Box display="flex" justifyContent="space-around" mt={2}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() =>
              reject(Number(id))
                .unwrap()
                .then(() => {
                  toast.success("Check rejected with success!", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });

                  navigate("/admin/checks");
                })
            }
          >
            <ThumbDownIcon fontSize="small" sx={{ mr: 0.5 }} />
            Reject
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ ml: 1 }}
            onClick={() =>
              approve(Number(id))
                .unwrap()
                .then(() => {
                  toast.success("Check approved with success!", {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  });

                  navigate("/admin/checks");
                })
            }
          >
            <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
            Approve
          </Button>
        </Box>
      </List>
    </>
  );
};

export default CheckControlDetail;
