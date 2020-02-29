import React from "react";
import { Button, Form, Input, Radio, Header } from "semantic-ui-react";

const API_QUOTE_URL = "http://localhost:8080/quote";

enum RequestState {
  OK,
  PROCESSING_REQUEST,
  ERROR
}

//import "./App.css";
const jsonify = (resp: any) => {
  if (resp.ok) {
    return resp.json();
  } else {
    throw "Request Error";
  }
};

interface AppState {
  pickupPostcode: String;
  deliveryPostcode: String;
  vehicleType: String;
  message: String;
  requestState: RequestState;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    pickupPostcode: "",
    deliveryPostcode: "",
    vehicleType: "bicycle",
    message: "",
    requestState: RequestState.OK
  };

  handleChange = (e: any, { value }: { value: String }) => {
    console.log(value);
    this.setState({ vehicleType: value });
  };

  handlePickUpPostcode = (e: any, { value }: { value: String }) => {
    this.setState({ pickupPostcode: value });
  };

  handleDeliveryPotcode = (e: any, { value }: { value: String }) => {
    this.setState({ deliveryPostcode: value });
  };

  getTextColor = (reqState: RequestState) => {
    switch (this.state.requestState) {
      case RequestState.OK: {
        return "green";
      }
      case RequestState.ERROR: {
        return "red";
      }
      case RequestState.PROCESSING_REQUEST: {
        return "black";
      }
    }
  };

  handleSubmit = (
    pickupPostcode: String,
    deliveryPostcode: String,
    vehicle: String
  ) => {
    this.setState({
      message: `Please wait, the price is calculating`,
      requestState: RequestState.PROCESSING_REQUEST
    });

    fetch(API_QUOTE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pickupPostcode: pickupPostcode,
        deliveryPostcode: deliveryPostcode,
        vehicle: vehicle
      })
    })
      .then(jsonify)
      .then(data => {
        return this.setState({
          message: `A delivery from: ${data.pickupPostcode} to: ${data.deliveryPostcode} using a ${data.vehicle} will cost you £${data.price}.`,
          requestState: RequestState.OK
        });
      })
      .catch(err => {
        this.setState({
          requestState: RequestState.ERROR,
          message: "There was an error with the request"
        });
      });
  };

  render() {
    let color = this.getTextColor(this.state.requestState);

    return (
      <>
        <Header>Welcome to EBay</Header>
        <Form>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="PickUp Postcode"
              placeholder="PickUp Postcode"
              onChange={this.handlePickUpPostcode}
            />
            <Form.Field
              control={Input}
              label="Delivery Postcode"
              placeholder="Delivery Postcode"
              onChange={this.handleDeliveryPotcode}
            />
          </Form.Group>
          <Form.Group inline>
            <label>Delivery method</label>
            <Form.Field
              control={Radio}
              label="Bicycle: 10%"
              value="bicycle"
              checked={this.state.vehicleType === "bicycle"}
              onChange={this.handleChange}
            />
            <Form.Field
              control={Radio}
              label="Motorbike: 15%"
              value="motorbike"
              checked={this.state.vehicleType === "motorbike"}
              onChange={this.handleChange}
            />
            <Form.Field
              control={Radio}
              label="Parcel Car: 20%"
              value="parcelCar"
              checked={this.state.vehicleType === "parcelCar"}
              onChange={this.handleChange}
            />
            <Form.Field
              control={Radio}
              label="Small Van: 30%"
              value="smallVan"
              checked={this.state.vehicleType === "smallVan"}
              onChange={this.handleChange}
            />
            <Form.Field
              control={Radio}
              label="Large Van: 40%"
              value="largeVan"
              checked={this.state.vehicleType === "largeVan"}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Field
            control={Button}
            onClick={() => {
              this.handleSubmit(
                this.state.pickupPostcode,
                this.state.deliveryPostcode,
                this.state.vehicleType
              );
            }}
          >
            Submit
          </Form.Field>
        </Form>

        <div style={{ color: color }}>{this.state.message}</div>
      </>
    );
  }
}

export default App;
