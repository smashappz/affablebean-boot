import React, { Component } from "react";
import { updateProductInCart } from "../../net/cart";
import { CartTableTd } from "./CartItem.styles";

export class CartItem extends Component {
  constructor(props) {
    super(props);

    const { item } = this.props;
    const { product } = item;

    this.state = {
      id: product.id,
      qty: item.quantity
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ qty: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(updateProductInCart(this.state.id, Number(this.state.qty)));
  }

  render() {
    const { index, item } = this.props;
    const { product } = item;
    const name = product.name;
    const rowCol = index % 2 === 0 ? "white" : "lightBlue";
    const inputStyle = {
      margin: "5px",
      textAlign: "center"
    };

    return (
      <React.Fragment>
        <tr className={`${rowCol}`}>
          <CartTableTd>
            <img src={`/static/img/products/${name}.png`} alt="{name}" />
          </CartTableTd>
          <CartTableTd>{name}</CartTableTd>
          <CartTableTd>
            &euro;
            {item.total}
            <br />
            {product.price}
          </CartTableTd>
          <CartTableTd>
            <form onSubmit={this.handleSubmit}>
              <input
                className="form-control"
                maxLength="2"
                onChange={this.handleChange}
                size="2"
                style={inputStyle}
                type="number"
                value={this.state.qty}
              />
              <button className="`btn btn-primary btn-sm`" type="submit">
                update
              </button>
            </form>
          </CartTableTd>
        </tr>
      </React.Fragment>
    );
  }
}
