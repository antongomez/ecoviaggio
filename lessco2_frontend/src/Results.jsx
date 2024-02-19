// SPDX-FileCopyrightText: 2024 EcoViaggio
//
// SPDX-License-Identifier: MIT

import React from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import {
  CarFront,
  ArrowRight,
  Person,
  GeoAltFill,
  TrainFront,
  AirplaneEngines,
  FuelPump,
} from "react-bootstrap-icons";

import "leaflet-routing-machine";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import { MapContainer, TileLayer, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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
        return <GroupRoute route={route} index={index} key={index} className="mb-5" />;
      })}
    </Container>
  );
};

const containerStyle = {
  width: "100 %",
  height: "350px",
};

const createRouting = (props) => {
  const instance = L.Routing.control({
    waypoints: props.coordinates_group,

    show: false,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: false,
    showAlternatives: false,
  });

  return instance;
};

const Routing = createControlComponent(createRouting);

function AttributionControl() {
  const map = useMap();

  map.attributionControl.setPrefix(
    '<a href="https://leafletjs.com/" title="A JavaScript library for interactive maps">Leaflet</a>'
  );

  return null;
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

  let center = undefined;

  let coordinates = [];
  step1.map((group) => {
    let coordinates_group = [];
    group["path"].map((step) => {
      if (center === undefined) {
        center = L.latLng(step[1], step[2]);
      }
      coordinates_group.push(L.latLng(step[1], step[2]));
    });
    coordinates.push(coordinates_group);
  });

  let polyline_trains = [];
  let polyline_planes = [];
  let polyline_cars = [];

  let overall_coordinates = [...coordinates];
  if (step2 !== undefined) {
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
    overall_coordinates.push([
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
              return <FriendsPath key = {k} group={group} emissions={step1_emissions} />;
            })}
          </Col>
          <Col lg={4} className="px-0">
            <MapContainer
              center={coordinates[0][0]}
              zoom={8}
              scrollWheelZoom={true}
              style={containerStyle}
            >
              <AttributionControl />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {coordinates.map((coordinates_group, k) => {
                return <Routing coordinates_group={coordinates_group} key={k}/>;
              })}
            </MapContainer>
          </Col>
        </Row>
      </Col>
      <OptionalPath step2={step2} step3={step3} />
      <hr className="my-4" />
      <Col>
        <h3>Full Trip</h3>
        <FuelComsumption travel_step={4} emissions={total_emissions} />
        <Row className="d-flex justify-content-center">
          <Col lg={8}>
            <MapContainer
              center={center}
              zoom={6}
              scrollWheelZoom={true}
              style={containerStyle}
            >
              <AttributionControl />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline
                pathOptions={{ color: "purple" }}
                positions={polyline_trains}
              />
              <Polyline
                pathOptions={{ color: "blue" }}
                positions={polyline_planes}
              />
              <Polyline
                pathOptions={{ color: "red" }}
                positions={polyline_cars}
              />
              {overall_coordinates.map((coordinates_group, k) => {
                return <Routing coordinates_group={coordinates_group} key={k}/>;
              })}
            </MapContainer>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function FuelComsumption({ travel_step, emissions }) {
  let emissions_text = ''
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

  return  <Row className="pt-2">
    <Col xs="auto" className="py-2">
      <FuelPump size={25} />
    </Col>
    <Col xs="auto" className="py-2">
      <p>
        {emissions_text} emissions: {Math.round(emissions * 100) / 100} kg Co2
      </p>
    </Col>
  </Row>
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
    let coordinates_step3 = [
      L.latLng(step3["origin"]["latitude"], step3["origin"]["longitude"]),
      L.latLng(step3["destination"][1], step3["destination"][2]),
    ];

    let polyline_trains = [];
    let polyline_planes = [];
    let polyline_cars = [];

    let center = undefined;

    step2["path"].map((step) => {
      if (center === undefined) {
        center = {
          lat: step["origin_coordinates"]["latitude"],
          lng: step["origin_coordinates"]["longitude"],
        };
      }

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

    return (
      <>
        <hr className="my-4" />
        <Row>
          <Col lg={6} className="py-2">
            <h4>Public transport section:</h4>
            <Row>
              {step2["path"].map((step, k) => {
                return (
                  <Row className="py-1" key={k}>
                    <Col xs="auto">
                      {step["travel_type"] === "TRAIN" ? (
                        <TrainFront size={25} />
                      ) : step["travel_type"] === "CAR" ? (
                        <CarFront size={25} />
                      ) : (
                        <AirplaneEngines size={25} />
                      )}
                    </Col>
                    <Col xs="auto" className="px-1">
                      <GeoAltFill />
                    </Col>
                    <Col xs="auto" className="pe-2 ps-0">
                      <span>{step["origin"]}</span>
                    </Col>
                    <Col xs="auto" className="px-2">
                      <ArrowRight />
                    </Col>
                    <Col xs="auto" className="px-1">
                      <GeoAltFill />
                    </Col>
                    <Col xs="auto" className="pe-2 ps-0">
                      <span>{step["destiny"]}</span>
                    </Col>
                  </Row>
                );
              })}
            </Row>
            <FuelComsumption travel_step={2} emissions={step2["emissions"]} />
          </Col>
          <Col lg={4} className="d-flex flex-column justify-content-center">
            <MapContainer
              center={center}
              zoom={6}
              scrollWheelZoom={true}
              style={containerStyle}
            >
              <AttributionControl />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline
                pathOptions={{ color: "purple" }}
                positions={polyline_trains}
              />
              <Polyline
                pathOptions={{ color: "blue" }}
                positions={polyline_planes}
              />
              <Polyline
                pathOptions={{ color: "red" }}
                positions={polyline_cars}
              />
            </MapContainer>
            ,
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col lg={6} className="py-2">
            <h4>Last car section:</h4>
            <Row>
              <Col xs="auto">
                <CarFront size={25} />
              </Col>
              <Col xs="auto" className="px-1">
                <GeoAltFill />
              </Col>
              <Col xs="auto" className="pe-2 ps-0">
                <span>{step3["origin"]["name"]}</span>
              </Col>
              <Col xs="auto" className="px-2">
                <ArrowRight />
              </Col>
              <Col xs="auto" className="px-1">
                <GeoAltFill />
              </Col>
              <Col xs="auto" className="pe-2 ps-0">
                <span>{step3["destination"][0]}</span>
              </Col>
            </Row>
            <FuelComsumption travel_step={3} emissions={step3["emissions"]} />
          </Col>
          <Col lg={4}>
            <MapContainer
              center={{
                lat: step3["origin"]["latitude"],
                lng: step3["origin"]["longitude"],
              }}
              zoom={8}
              scrollWheelZoom={true}
              style={containerStyle}
            >
              <AttributionControl />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Routing coordinates_group={coordinates_step3} />
            </MapContainer>
          </Col>
        </Row>
      </>
    );
  }
}
