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
import { MapContainer, TileLayer, useMap } from "react-leaflet";
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
        return <GroupRoute route={route} index={index} />;
      })}
    </Container>
  );
};

const containerStyle = {
  width: "100 %",
  height: "350px",
};

const createRouting = (coordinates_group) => {
  const instance = L.Routing.control({
    waypoints: coordinates_group,

    show: false /* Para que non se mostren as indicacions nada mais cargar o mapa*/,
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
    step1_emissions + step2["emissions"] + step3["emissions"];

  let coordinates = [];
  step1.map((group) => {
    let coordinates_group = [];
    group["path"].map((step) => {
      coordinates_group.push(L.latLng(step[1], step[2]));
    });
    coordinates.push(coordinates_group);
  });

  console.log(coordinates);

  return (
    <Row className="mx-4 p-3 border rounded-2 shadow bg-white">
      <Col>
        <h2>Grupo {index + 1}</h2>
        <Row>
          <Col>
            {step1.map((group) => {
              return <FriendsPath group={group} emissions={step1_emissions} />;
            })}
          </Col>
          <Col>
            <MapContainer
              center={{ lat: 42.231356, lng: -8.712447 }}
              zoom={9}
              scrollWheelZoom={true}
              style={containerStyle}
            >
              <AttributionControl />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {coordinates.map((coordinates_group) => {
                return <Routing waypoints={coordinates_group} />;
              })}
            </MapContainer>
          </Col>
        </Row>
      </Col>
      <OptionalPath step2={step2} step3={step3} />
      <hr className="my-4" />
      <Row className="pt-2">
        <Col xs="auto" className="py-2">
          <FuelPump size={25} />
        </Col>
        <Col xs="auto" className="py-2">
          <p>
            Section emissions: {Math.round(total_emissions * 100) / 100} kg
            Co2/km
          </p>
        </Col>
      </Row>
    </Row>
  );
}

function OptionalPath({ step2, step3, total_emissions }) {
  if ("path" in step2 === false) {
    return null;
  } else {
    return (
      <>
        <hr className="mb-4" />
        <Row>
          <Col className="py-2">
            <h4>Public transport section:</h4>
            <Row>
              {step2["path"].map((step, k) => {
                return (
                  <Row className="py-1">
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
            <Row className="pt-2">
              <Col xs="auto" className="py-2">
                <FuelPump size={25} />
              </Col>
              <Col xs="auto" className="py-2">
                <p>
                  Section emissions:{" "}
                  {Math.round(step2["emissions"] * 100) / 100} kg Co2/km
                </p>
              </Col>
            </Row>
          </Col>
          <Col>Mapa</Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="py-2">
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
            <Row className="pt-2">
              <Col xs="auto" className="py-2">
                <FuelPump size={25} />
              </Col>
              <Col xs="auto" className="py-2">
                <p>
                  Section emissions:{" "}
                  {Math.round(step3["emissions"] * 100) / 100} kg Co2/km
                </p>
              </Col>
            </Row>
          </Col>
          <Col>Mapa</Col>
        </Row>
      </>
    );
  }
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
                  <>
                    <Col className="px-1">
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
                  </>
                );
              })}
            </Row>
            <Row className="pt-2">
              <Col xs="auto" className="py-2">
                <FuelPump size={25} />
              </Col>
              <Col xs="auto" className="py-2">
                <p>
                  Section emissions: {Math.round(emissions * 100) / 100} kg
                  Co2/km
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
