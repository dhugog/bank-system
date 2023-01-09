import React from "react";
import CurrencyInput from "react-currency-input-field";

const CustomCurrencyInput = (props: any) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <CurrencyInput
      placeholder="Please enter a number"
      decimalsLimit={2}
      decimalScale={2}
      defaultValue={0}
      intlConfig={{ locale: "en-US", currency: "USD" }}
      {...other}
    />
  );
};

export default CustomCurrencyInput;
