import React, { Component } from "react";
import { connect } from "react-redux";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Products from "../../components/Products";
import { fetchCategoryIfNeeded } from "../../net/category";
import { Props } from "../../interfaces/props";

export class CategoryProducts extends Component<Props> {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    dispatch(fetchCategoryIfNeeded(params.id));
  }

  componentDidUpdate(prevProps: Props) {
    const { category, dispatch, match } = this.props;
    const { params } = match;
    const id = params.id;

    if (category.categories.length > 0 && Number(id) !== category.category.id) {
      dispatch(fetchCategoryIfNeeded(id));
    }
  }

  render() {
    const { cart, category, dispatch, match } = this.props;

    if (!category.category.hasOwnProperty("id")) {
      return null;
    }

    return (
      <div>
        <Header cart={cart} url={match.url} />
        <Products
          cart={cart}
          categories={category.categories}
          category={category.category}
          dispatch={dispatch}
          products={category.products}
        />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state: Props) => {
  const { cart, category } = state;

  return {
    cart,
    category
  };
};

export default connect(mapStateToProps)(CategoryProducts);
