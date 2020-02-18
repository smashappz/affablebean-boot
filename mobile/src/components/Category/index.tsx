import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {getCategoryIcon} from '../../helpers/utils';
import {Category as CategoryState} from '../../interfaces/categories';

type Props = {
  category: CategoryState;
  setCategoryProduct: Function;
};

export default function Category(props: Props) {
  const {category, setCategoryProduct} = props;
  const {id, name} = category;

  return (
    <View style={styles.category}>
      <Text>{name}</Text>
      <TouchableWithoutFeedback onPress={() => setCategoryProduct(id)}>
        <Image source={getCategoryIcon(name)} />
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  category: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});
