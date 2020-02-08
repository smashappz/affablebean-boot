import axios from "axios";
import { getNodePath, getPath, IS_NODE } from "../helpers/utils";
import { addToCart, clearCart, updateCart } from "../redux/cart";

type id = number | string;

export const addProductToCart = (id: id) => (dispatch: Function) => {
  if (IS_NODE) {
    axios({
      method: "post",
      url: getNodePath(`addToCart/${id}`),
      withCredentials: true
    })
      .then(response => {
        const { cart, numberOfItems, subtotal } = response.data;
        dispatch(
          addToCart({
            items: cart,
            numberOfItems,
            subtotal
          })
        );
      })
      .catch(error => console.log(error));

    return;
  }

  axios({
    method: "post",
    url: getPath(`addToCart2?id=${id}`),
    withCredentials: true
  })
    .then(response => {
      const { items, numberOfItems, subtotal } = response.data;
      dispatch(
        addToCart({
          items,
          numberOfItems,
          subtotal
        })
      );
    })
    .catch(error => console.log(error));
};

export const emptyCart = () => (dispatch: Function) => {
  axios({
    method: "get",
    url: IS_NODE
      ? getNodePath("viewCart/true")
      : getPath("viewCart?clear=true"),
    withCredentials: true
  })
    .then(() => dispatch(clearCart({})))
    .catch(error => console.log(error));
};

export const updateProductInCart = (id: id, qty: number) => (
  dispatch: Function
) => {
  if (IS_NODE) {
    axios({
      method: "post",
      url: getNodePath(`updateCart/${id}/qty/${qty}`),
      withCredentials: true
    })
      .then(response => {
        const { cart, numberOfItems, subtotal } = response.data;
        dispatch(
          updateCart({
            cart,
            numberOfItems,
            subtotal
          })
        );
      })
      .catch(error => console.log(error));

    return;
  }

  axios({
    method: "post",
    url: getPath(`updateCart2?id=${id}&qty=${qty}`),
    withCredentials: true
  })
    .then(response =>
      dispatch(
        updateCart({
          cart: response.data
        })
      )
    )
    .catch(error => console.log(error));
};
