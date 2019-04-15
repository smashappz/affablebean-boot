import React, { Component } from "react";
import { connect } from "react-redux";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { purchaseOrder } from "../../net/checkout";
import {
  InfoBox,
  PriceBox,
  PriceBoxTd,
  PriceBoxSubTotalTd
} from "./Checkout.styles";
import "./Checkout.css";

export class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: "",
      creditcard: "",
      email: "",
      name1: "",
      phone: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const input = event.target;
    this.setState({
      [input.name]: input.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, cart } = this.props;

    dispatch(
      purchaseOrder({
        cart: cart,
        form: this.state
      })
    );
  }

  render() {
    const { cart, match } = this.props;
    const surcharge = 3;

    return (
      <div>
        <Header cart={cart} url={match.url} />
        <div className="singleColumn">
          <h2>checkout</h2>
          <p>
            In order to purchase the items in your shopping cart, please provide
            us with the following information:
          </p>
          <br />
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className={`col-sm-2 control-label`}>
                name
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="name1"
                  maxLength="45"
                  placeholder="At least 8 chars and no more than 45 chars"
                  size="31"
                  onChange={this.handleChange}
                  value={this.state.name}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email" className={`col-sm-2 control-label`}>
                email
              </label>
              <div className="col-sm-10">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  maxLength="45"
                  placeholder="At least 8 chars and no more than 45 chars"
                  size="31"
                  onChange={this.handleChange}
                  value={this.state.email}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone" className={`col-sm-2 control-label`}>
                phone
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  maxLength="45"
                  placeholder="At least 8 chars and no more than 30 chars"
                  size="31"
                  onChange={this.handleChange}
                  value={this.state.phone}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address" className={`col-sm-2 control-label`}>
                address
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  maxLength="45"
                  placeholder="At least 8 chars and no more than 45 chars"
                  size="31"
                  onChange={this.handleChange}
                  value={this.state.address}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="creditcard" className={`col-sm-2 control-label`}>
                credit card
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="creditcard"
                  maxLength="45"
                  placeholder="At least 16 chars and no more than 19 chars"
                  size="31"
                  onChange={this.handleChange}
                  value={this.state.creditcard}
                />
              </div>
            </div>
            <div className="form-group">
              <div className={`col-sm-offset-2 col-sm-10`}>
                <button type="submit" className={`btn btn-primary`}>
                  submit purchase
                </button>
              </div>
            </div>
          </form>
          <InfoBox>
            <ul>
              <li>Next-day delivery is guaranteed</li>
              <li>
                A &euro; {surcharge.toFixed(2)} delivery surcharge is applied to
                all purchase orders
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
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { cart } = state;

  return {
    cart
  };
};

export default connect(mapStateToProps)(Checkout);
