import React, { useState } from "react";
import "../Css/Subtotal.css";
import CurrencyInput from "react-currency-input-field";
import { useStateValue } from "../StateProvider";
import { getBasketTotal } from "./reducer";
import { Link } from "react-router-dom";

const Subtotal = () => {
  const [{ basket }, dispatch] = useStateValue();

  const handleProceed = () => {
    if (basket.length > 0) {
      dispatch({
        type: "ADD_TO_HISTORY",
        items: basket,
      });
      dispatch({ type: "CLEAR_BASKET" });
    }
  };

  return (
    <div className="subtotal">
      <div className="subtotal__text">
        Subtotal ({basket?.length} items):{' '}
        <strong>
          <CurrencyInput
            value={getBasketTotal(basket)}
            decimalsLimit={2}
            thousandSeparator=","  
            prefix="$"
            readOnly
          />
        </strong>
      </div>
      <small className="subtotal__gift">
        <input type="checkbox" className="checkbox" /> This order contains a gift
      </small>

      {basket.length > 0 ? (
        <Link style={{ textDecoration: "none" }} to="/thanks">
          <button className="proceed" onClick={handleProceed}>
            Proceed to Buy
          </button>
        </Link>
      ) : (
        <button className="proceed" disabled>
          Proceed to Buy
        </button>
      )}
    </div>
  );
};

export default Subtotal;
