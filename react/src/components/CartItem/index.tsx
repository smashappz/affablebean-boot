import React, { ChangeEvent, useState } from "react";
import { updateProductInCart } from "../../net/cart";
import { CartTableTd } from "./CartItem.styles";
import { CartItem as CartItemState } from "../../interfaces/cart";

type Props = {
  dispatch: Function;
  index: number;
  item: CartItemState;
};

export default function CartItem(props: Props) {
  const { dispatch, index, item } = props;
  const { product } = item;
  const [state, setState] = useState({ qty: item.quantity });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    let qty = Number(input.value);

    if (qty >= 0 && qty <= 10) {
      setState({ ...state, qty });
    } else {
      input.value = qty.toString();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateProductInCart(product.id, Number(state.qty)));
  };

  const name = product.name;
  const rowCol = index % 2 === 0 ? "white" : "lightBlue";

  return (
    <React.Fragment>
      <tr className={`${rowCol}`}>
        <CartTableTd>
          <img src={`/static/img/products/${name}.png`} alt="{name}" />
        </CartTableTd>
        <CartTableTd>{name}</CartTableTd>
        <CartTableTd>
          &euro;
          {item.total.toFixed(2)}
          <br />
          {product.price}
        </CartTableTd>
        <CartTableTd>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control"
              maxLength={2}
              onChange={handleChange}
              size={2}
              style={{ margin: "5px", textAlign: "center" }}
              type="number"
              value={state.qty}
            />
            <button className="btn btn-primary btn-sm" type="submit">
              update
            </button>
          </form>
        </CartTableTd>
      </tr>
    </React.Fragment>
  );
}