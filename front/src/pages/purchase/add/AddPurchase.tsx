import { Button, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomCurrencyInput from "../../../components/NumberFormatCustom";
import MenuIcon from "@mui/icons-material/Menu";

import styles from "./AddPurchase.module.css";
import { useGetTransactionsSummaryQuery } from "../../../app/services/transaction.service";
import { useNavigate } from "react-router-dom";
import { useCreatePurchaseMutation } from "../../../app/services/purchase.service";
import { useAppDispatch } from "../../../app/hooks";
import { toggleSideMenu } from "../../../features/side-menu/sideMenuSlice";

const AddPurchase: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: summary, isFetching: isFetchingSummary } =
    useGetTransactionsSummaryQuery();

  const [createPurchase] = useCreatePurchaseMutation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createPurchase({ amount: amount * 100, description, date })
      .unwrap()
      .then(() => navigate("/purchases"));
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
          PURCHASE
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

        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="date"
          label="Date"
          name="date"
          autoComplete="date"
          value={date}
          type="date"
          onChange={(event) => setDate(event.target.value)}
        />

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

        <Button
          sx={{ mt: 3, mb: 2 }}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className="submit"
        >
          Add purchase
        </Button>
      </form>
    </>
  );
};

export default AddPurchase;
