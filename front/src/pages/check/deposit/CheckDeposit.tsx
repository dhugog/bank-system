import { Button, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomCurrencyInput from "../../../components/NumberFormatCustom";
import MenuIcon from "@mui/icons-material/Menu";

import styles from "./CheckDeposit.module.css";
import { useGetTransactionsSummaryQuery } from "../../../app/services/transaction.service";
import FileInput from "../../../components/FileInput";
import { useCreateCheckMutation } from "../../../app/services/check.service";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { toggleSideMenu } from "../../../features/side-menu/sideMenuSlice";
import { toast } from "react-toastify";

const CheckDeposit: React.FC = () => {
  const [amount, setAmount] = useState<number | null>(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: summary, isFetching: isFetchingSummary } =
    useGetTransactionsSummaryQuery();

  const [createCheck] = useCreateCheckMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    if (amount) {
      formData.append("amount", (amount * 100).toString());
    }

    if (description) {
      formData.append("description", description);
    }

    if (image) {
      formData.append("image", image);
    }

    createCheck(formData)
      .unwrap()
      .then(() => {
        toast.success("Check created successfully", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        navigate("/checks");
      });
  };

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
          CHECK DEPOSIT
        </Typography>
      </div>

      <div className={styles.subHeader}>
        <Typography variant="body2" fontWeight="bold" color="primary">
          Current balance
        </Typography>

        <Typography variant="h6" color="primary">
          {isFetchingSummary
            ? "Loading..."
            : ((summary?.balance ?? 0) / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
        </Typography>
      </div>

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="amount"
          label="Amount"
          name="amount"
          autoComplete="amount"
          autoFocus
          value={amount}
          InputProps={{
            inputComponent: CustomCurrencyInput,
          }}
          inputProps={{
            onValueChange: (value: number) => setAmount(value),
            placeholder: "Please enter the check amount",
          }}
        />

        <Typography color="primary" variant="body2" fontWeight="light">
          * The money will be deposited in your account once the check is
          accepted.
        </Typography>

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          autoComplete="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <FileInput
          text="Upload check picture"
          onChange={(image) => setImage(image)}
        />

        <Button
          sx={{ mt: 3, mb: 2 }}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="submit"
        >
          Deposit check
        </Button>
      </form>
    </>
  );
};

export default CheckDeposit;
