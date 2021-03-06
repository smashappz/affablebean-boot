import {createSlice} from '@reduxjs/toolkit';
import {Categories} from '../interfaces/categories';

export const initialState: Categories = {
  didInvalidate: false,
  isFetching: false,
  items: [],
};

const categories = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    didInvalidate: (state, action) => {
      state.didInvalidate = action.payload;
    },
    isFetching: (state, action) => {
      state.isFetching = action.payload;
    },
    receiveCategories: (state, action) => {
      state.didInvalidate = false;
      state.isFetching = false;
      state.items = action.payload;
    },
  },
});

export const {
  didInvalidate,
  isFetching,
  receiveCategories,
} = categories.actions;

const categoriesReducer = categories.reducer;

export default categoriesReducer;
