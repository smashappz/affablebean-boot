import React, { Component } from "react";
import { connect } from "react-redux";
import ContactForm from "../../components/ContactForm";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { fetchSubjectsIfNeeded } from "../../net/subjects";
import { Props } from "../../interfaces/props";

export class Contact extends Component<Props> {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchSubjectsIfNeeded());
  }

  render() {
    const { cart, match, subjects } = this.props;
    const { items } = subjects;

    if (items.length === 0) {
      return null;
    }

    return (
      <div>
        <Header cart={cart} url={match.url} />
        <ContactForm subjects={subjects} />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state: Props) => {
  const { cart, subjects } = state;

  return {
    cart,
    subjects
  };
};

export default connect(mapStateToProps)(Contact);