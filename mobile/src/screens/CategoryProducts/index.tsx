import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {connect, useDispatch} from 'react-redux';
import Header from '../../components/Header';
import Products from '../../components/Products';
import {CategoryProducts as CategoryProductsState} from '../../interfaces/categories';
import {id} from '../../interfaces/id';
import {fetchCategoryIfNeeded} from '../../net/category';

type Props = {
  category: CategoryProductsState;
  id: id;
  setScreen: Function;
};

function CategoryProducts(props: Props) {
  const {category, id, setScreen} = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoryIfNeeded(id));
  }, [dispatch, id]);

  if (
    !category.category.hasOwnProperty('id') &&
    !category.category.hasOwnProperty('_id')
  ) {
    return null;
  }

  return (
    <ScrollView>
      <Header currentScreen="CategoryProducts" setScreen={setScreen} />
      <Products
        categories={category.categories}
        category={category.category}
        products={category.products}
      />
    </ScrollView>
  );
}

const mapStateToProps = (state: Props) => {
  const {category} = state;

  return {
    category,
  };
};

export default connect(mapStateToProps)(CategoryProducts);