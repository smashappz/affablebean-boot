import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { validateField } from "../../helpers/utils";
import { Cart } from "../../interfaces/cart";
import { purchaseOrder } from "../../net/checkout";
import { RootState } from "../../redux";
import "./CheckoutForm.css";
import {
  InfoBox,
  PriceBox,
  PriceBoxSubTotalTd,
  PriceBoxTd
} from "./CheckoutForm.styles";

type Props = {
  cart: Cart;
};

function CheckoutForm(props: Props) {
  const { cart } = props;
  const [state, setState] = useState({
    address: "",
    creditCard: "",
    email: "",
    name: "",
    phone: ""
  });
  const dispatch = useDispatch();

  const addressErrorRef = useRef(null);
  const addressInputRef = useRef(null);

  const ccErrorRef = useRef(null);
  const ccInputRef = useRef(null);

  const emailErrorRef = useRef(null);
  const emailInputRef = useRef(null);

  const nameErrorRef = useRef(null);
  const nameInputRef = useRef(null);

  const phoneErrorRef = useRef(null);
  const phoneInputRef = useRef(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    setState({ ...state, [input.name]: input.value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let validForm = true;

    if (!validateField(addressInputRef, addressErrorRef, 8, 256)) {
      validForm = false;
    }

    if (!validateField(ccInputRef, ccErrorRef, 16, 19)) {
      validForm = false;
    }

    if (!validateField(emailInputRef, emailErrorRef, 8, 32)) {
      validForm = false;
    }

    if (!validateField(nameInputRef, nameErrorRef, 3, 64)) {
      validForm = false;
    }

    if (!validateField(phoneInputRef, phoneErrorRef, 8, 32)) {
      validForm = false;
    }

    if (validForm) {
      dispatch(purchaseOrder({ ...state }));
    }
  };

  return (
    <div className="singleColumn">
      <h2>checkout</h2>
      <p data-cy="checkout-intro">
        In order to purchase the items in your shopping cart, please provide us
        with the following information:
      </p>
      <br />
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className={`col-sm-2 control-label`}>
            name
          </label>
          <div className="col-sm-10">
            <input
              data-cy="checkout-name"
              ref={nameInputRef}
              type="text"
              className="form-control"
              name="name"
              maxLength={45}
              placeholder="At least 8 chars and no more than 45 chars"
              size={31}
              onChange={handleChange}
              value={state.name}
            />
          </div>
          <div className="formError" ref={nameErrorRef}>
            Name shoud be at least 8 chars and no more than 45 chars
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email" className={`col-sm-2 control-label`}>
            email
          </label>
          <div className="col-sm-10">
            <input
              data-cy="checkout-email"
              ref={emailInputRef}
              type="email"
              className="form-control"
              name="email"
              maxLength={45}
              placeholder="At least 8 chars and no more than 45 chars"
              size={31}
              onChange={handleChange}
              value={state.email}
            />
          </div>
          <div className="formError" ref={emailErrorRef}>
            Email shoud be at least 8 chars and no more than 45 chars
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="phone" className={`col-sm-2 control-label`}>
            phone
          </label>
          <div className="col-sm-10">
            <input
              data-cy="checkout-phone"
              ref={phoneInputRef}
              type="text"
              className="form-control"
              name="phone"
              maxLength={45}
              placeholder="At least 8 chars and no more than 30 chars"
              size={31}
              onChange={handleChange}
              value={state.phone}
            />
          </div>
          <div className="formError" ref={phoneErrorRef}>
            Phone shoud be at least 8 chars and no more than 30 chars
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="address" className={`col-sm-2 control-label`}>
            address
          </label>
          <div className="col-sm-10">
            <input
              data-cy="checkout-address"
              ref={addressInputRef}
              type="text"
              className="form-control"
              name="address"
              maxLength={45}
              placeholder="At least 8 chars and no more than 45 chars"
              size={31}
              onChange={handleChange}
              value={state.address}
            />
          </div>
          <div className="formError" ref={addressErrorRef}>
            Address shoud be at least 8 chars and no more than 45 chars
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="creditcard" className={`col-sm-2 control-label`}>
            credit card
          </label>
          <div className="col-sm-10">
            <input
              data-cy="checkout-cc"
              ref={ccInputRef}
              type="text"
              className="form-control"
              name="creditCard"
              maxLength={45}
              placeholder="At least 16 chars and no more than 19 chars"
              size={31}
              onChange={handleChange}
              value={state.creditCard}
            />
          </div>
          <div className="formError" ref={ccErrorRef}>
            Credit card number shoud be at least 16 chars and no more than 19
            chars
          </div>
        </div>
        <div className="form-group">
          <div className={`col-sm-offset-2 col-sm-10`}>
            <button
              type="submit"
              className={`btn btn-primary`}
              data-cy="checkout-submit"
            >
              submit purchase
            </button>
          </div>
        </div>
      </form>
      <InfoBox>
        <ul>
          <li>Next-day delivery is guaranteed</li>
          <li>
            A &euro; {surcharge.toFixed(2)} delivery surcharge is applied to all
            purchase orders
          </li>
        </ul>
        <PriceBox>
          <tbody>
            <tr>
              <PriceBoxTd>subtotal:</PriceBoxTd>
              <PriceBoxSubTotalTd className="checkoutPriceColumn">
                &euro; {cart.subtotal.toFixed(2)}
              </PriceBoxSubTotalTd>
            </tr>
            <tr>
              <PriceBoxTd>surcharge:</PriceBoxTd>
              <PriceBoxSubTotalTd className="checkoutPriceColumn">
                &euro; {surcharge.toFixed(2)}
              </PriceBoxSubTotalTd>
            </tr>
            <tr>
              <PriceBoxTd>total:</PriceBoxTd>
              <PriceBoxSubTotalTd className="checkoutPriceColumn">
                &euro; {(cart.subtotal + surcharge).toFixed(2)}
              </PriceBoxSubTotalTd>
            </tr>
          </tbody>
        </PriceBox>
      </InfoBox>
    </div>
  );
}

const surcharge = 3;

const mapStateToProps = (state: RootState) => ({
  cart: state.cart
});

export default connect(mapStateToProps)(CheckoutForm);
