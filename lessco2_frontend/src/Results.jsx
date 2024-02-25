// SPDX-FileCopyrightText: 2024 EcoViaggio
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import {
  CarFront,
  ArrowRight,
  Person,
  GeoAltFill,
  TrainFront,
  AirplaneEngines,
  FuelPump,
} from "react-bootstrap-icons";

import { Map } from "./Map";

export const Results = () => {
  const { state } = useLocation();

  return (
    <Container fluid className="py-5 bg-body-tertiary mb-5">
      <Row className="py-5">
        <Col className="text-center">
          <h1 className="fw-bolder text-primary">Here is your trip!</h1>
          <p>
            Empower your journey, travel greener with our eco-friendly
            optimization app.
          </p>
        </Col>
      </Row>
      {state.map((route, index) => {
        return (
          <GroupRoute
            route={route}
            index={index}
            key={index}
            className="mb-5"
          />
        );
      })}
    </Container>
  );
};

const containerStyle = {
  width: "100%",
  height: "350px",
};

function getPolylinesCoordinates(step2) {
  let polyline_trains = [];
  let polyline_planes = [];
  let polyline_cars = [];

  step2["path"].map((step) => {
    if (step["travel_type"] === "TRAIN") {
      polyline_trains.push([
        [
          step["origin_coordinates"]["latitude"],
          step["origin_coordinates"]["longitude"],
        ],
        [
          step["destiny_coordinates"]["latitude"],
          step["destiny_coordinates"]["longitude"],
        ],
      ]);
    } else if (step["travel_type"] === "CAR") {
      polyline_cars.push([
        [
          step["origin_coordinates"]["latitude"],
          step["origin_coordinates"]["longitude"],
        ],
        [
          step["destiny_coordinates"]["latitude"],
          step["destiny_coordinates"]["longitude"],
        ],
      ]);
    } else {
      polyline_planes.push([
        [
          step["origin_coordinates"]["latitude"],
          step["origin_coordinates"]["longitude"],
        ],
        [
          step["destiny_coordinates"]["latitude"],
          step["destiny_coordinates"]["longitude"],
        ],
      ]);
    }
  });

  return {
    polyline_trains,
    polyline_planes,
    polyline_cars,
  };
}

function GroupRoute({ route, index }) {
  const step1 = route["step1"];
  const step2 = route["step2"];
  const step3 = route["step3"];

  let step1_emissions = 0;
  step1.map((group) => {
    step1_emissions += group["emissions"];
  });

  const total_emissions =
    step1_emissions +
    (step2 === undefined ? 0 : step2["emissions"] + step3["emissions"]);

  let coordinate_car_routing_origin = [];
  step1.map((group) => {
    let coordinates_group = [];
    group["path"].map((step) => {
      coordinates_group.push(L.latLng(step[1], step[2]));
    });
    coordinate_car_routing_origin.push(coordinates_group);
  });

  let polyline_trains = [];
  let polyline_planes = [];
  let polyline_cars = [];

  let coordinate_car_routing = [...coordinate_car_routing_origin];
  if (step2 !== undefined) {
    // Get the coordinates for the public transport section
    ({ polyline_trains, polyline_planes, polyline_cars } =
      getPolylinesCoordinates(step2));
    // Get the coordinates for the last car section
    coordinate_car_routing.push([
      L.latLng(step3["origin"]["latitude"], step3["origin"]["longitude"]),
      L.latLng(step3["destination"][1], step3["destination"][2]),
    ]);
  }

  return (
    <Row className="mx-4 my-5 p-3 border rounded-2 shadow bg-white">
      <Col>
        <h2>Group {index + 1}</h2>
        <hr className="my-4" />
        <Row>
          <Col lg={6}>
            {step1.map((group, k) => {
              return (
                <FriendsPath
                  key={k}
                  group={group}
                  emissions={step1_emissions}
                />
              );
            })}
          </Col>
          <Col lg={5} className="px-0">
            <Map
              containerStyle={containerStyle}
              coordinate_car_routing={coordinate_car_routing_origin}
            />
          </Col>
        </Row>

        <OptionalPath step2={step2} step3={step3} />
        <hr className="my-4" />
        <Row>
          <Col>
            <h3>Full Trip</h3>
            <FuelComsumption travel_step={4} emissions={total_emissions} />
            <Row className="d-flex justify-content-center">
              <Col lg={8}>
                <Map
                  containerStyle={containerStyle}
                  coordinate_car_routing={coordinate_car_routing}
                  coordinate_public_trains={polyline_trains}
                  coordinate_public_planes={polyline_planes}
                  coordinate_public_cars={polyline_cars}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function TravelSubstep({ origin, destination, travel_type }) {
  let travel_type_icon = <></>;
  switch (travel_type) {
    case "TRAIN":
      travel_type_icon = <TrainFront size={25} />;
      break;
    case "CAR":
      travel_type_icon = <CarFront size={25} />;
      break;
    case "PLANE":
      travel_type_icon = <AirplaneEngines size={25} />;
      break;
  }

  return (
    <Row className="py-1">
      <Col xs="auto">{travel_type_icon}</Col>
      <Col xs="auto" className="px-1">
        <GeoAltFill />
      </Col>
      <Col xs="auto" className="pe-2 ps-0">
        <span>{origin}</span>
      </Col>
      <Col xs="auto" className="px-2">
        <ArrowRight />
      </Col>
      <Col xs="auto" className="px-1">
        <GeoAltFill />
      </Col>
      <Col xs="auto" className="pe-2 ps-0">
        <span>{destination}</span>
      </Col>
    </Row>
  );
}

function FuelComsumption({ travel_step, emissions }) {
  let emissions_text = "";
  switch (travel_step) {
    case 1:
      emissions_text = "First car section";
      break;
    case 2:
      emissions_text = "Public transport section";
      break;
    case 3:
      emissions_text = "Last car section";
      break;
    case 4:
      emissions_text = "Full trip";
      break;
  }

  return (
    <Row className="pt-2">
      <Col xs="auto" className="py-2">
        <FuelPump size={25} />
      </Col>
      <Col xs="auto" className="py-2">
        <p>
          {emissions_text} emissions: {Math.round(emissions * 100) / 100} kg Co2
        </p>
      </Col>
    </Row>
  );
}

function FriendsPath({ group, emissions }) {
  return (
    <Row className="pt-3">
      <h4> First car section: </h4>
      <Col xs="auto">
        <Row>
          <Col className="py-2">
            <Row>
              <Col xs="auto">
                <CarFront size={25} />
              </Col>

              {group["path"].map((friend, index) => {
                return (
                  <React.Fragment key={index}>
                    <Col xs="auto" className="px-1">
                      {index == group["path"].length - 1 ? (
                        <GeoAltFill />
                      ) : (
                        <Person />
                      )}
                    </Col>
                    <Col xs="auto" className="pe-2 ps-0">
                      <span>{friend[0]}</span>
                    </Col>
                    {index == group["path"].length - 1 ? (
                      <></>
                    ) : (
                      <Col xs="auto" className="px-2">
                        <ArrowRight />
                      </Col>
                    )}
                  </React.Fragment>
                );
              })}
            </Row>
            <FuelComsumption travel_step={1} emissions={emissions} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function OptionalPath({ step2, step3 }) {
  if (step2 === undefined) {
    return null;
  } else {
    const coordinates_step3 = [
      [
        L.latLng(step3["origin"]["latitude"], step3["origin"]["longitude"]),
        L.latLng(step3["destination"][1], step3["destination"][2]),
      ],
    ];

    const { polyline_trains, polyline_planes, polyline_cars } =
      getPolylinesCoordinates(step2);

    const first_stop = {
      lat: step2["path"][0]["origin_coordinates"]["latitude"],
      lng: step2["path"][0]["origin_coordinates"]["longitude"],
    };
    const last_stop = {
      lat: step2["path"][step2["path"].length - 1]["destiny_coordinates"][
        "latitude"
      ],
      lng: step2["path"][step2["path"].length - 1]["destiny_coordinates"][
        "longitude"
      ],
    };

    return (
      <>
        <hr className="my-4" />
        <Row>
          <Col lg={6} className="py-2">
            <h4>Public transport section:</h4>
            <Row>
              {step2["path"].map((step, k) => {
                return (
                  <TravelSubstep
                    key={k}
                    origin={step["origin"]}
                    destination={step["destiny"]}
                    travel_type={step["travel_type"]}
                  />
                );
              })}
            </Row>
            <FuelComsumption travel_step={2} emissions={step2["emissions"]} />
          </Col>
          <Col
            lg={5}
            className="d-flex flex-column justify-content-center px-0"
          >
            <Map
              containerStyle={containerStyle}
              coordinate_public_cars={polyline_cars}
              coordinate_public_planes={polyline_planes}
              coordinate_public_trains={polyline_trains}
              first_stop={first_stop}
              last_stop={last_stop}
            />
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col lg={6} className="py-2">
            <h4>Last car section:</h4>
            <TravelSubstep
              origin={step3["origin"]["name"]}
              destination={step3["destination"][0]}
              travel_type="CAR"
            />
            <FuelComsumption travel_step={3} emissions={step3["emissions"]} />
          </Col>
          <Col lg={5} className="px-0">
            <Map
              containerStyle={containerStyle}
              coordinate_car_routing={coordinates_step3}
            />
          </Col>
        </Row>
      </>
    );
  }
}
