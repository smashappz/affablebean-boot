import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { configureStore } from "redux-starter-kit";
import { Provider } from "react-redux";
import CategoryProducts from ".";
import Home from "../Home";
import reducer from "../../reducers";

jest.mock("../../net/category");
jest.mock("../../net/categories");

let container;

beforeAll(() => {
  container = document.createElement("div");
  document.body.appendChild(container);

  act(() => {
    const store = configureStore({
      reducer
    });

    const home = (
      <Provider store={store}>
        <Router>
          <Route path="/" exact component={Home} />
          <Route path="/category/:id" component={CategoryProducts} />
        </Router>
      </Provider>
    );

    ReactDOM.render(home, container);
  });
});

afterAll(() => {
  document.body.removeChild(container);
  container = null;
});

it("loads all products for dairy category", () => {
  const category = container.querySelector(".categoryImage"); // dairy

  act(() => {
    category.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const categories = container.querySelectorAll("span.categoryText");
  expect(categories.length).toBe(6);
});
