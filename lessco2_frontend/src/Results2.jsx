import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

import "leaflet-routing-machine";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

export const Results2 = () => {
  const { state } = useLocation();

  const destino = {
    lat: 43.0,
    lng: -8.0,
  };
  const orixe = { lat: 43.1, lng: -8.2 };

  const orixe2 = { lat: 43.5, lng: -8.3 };
  const destino2 = { lat: 43.6, lng: -8.4 };

  const containerStyle = {
    width: "100 %",
    height: "350px",
  };

  const createRouting = (props) => {
    const instance = L.Routing.control({
      waypoints: [
        L.latLng(props.ori.lat, props.ori.lng),
        L.latLng(props.ori.lat - 0.1, props.ori.lng - 0.1),
        L.latLng(props.dest.lat, props.dest.lng),
      ],

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
      <Row>{JSON.stringify(state)}</Row>
      {state.map((travelgroup, index) => (
        <Row className="border rounded-2 shadow bg-white mx-4 my-2 p-3">
          <h2>Group {index + 1}</h2>
          <Row>
            <Col>
              <h3>Traxecto 1 - Coche</h3>
              {travelgroup.step1.map((path_emissions) => (
                <>
                  <p>{path_emissions["emissions"] + "kg/C02"}</p>
                  <p>
                    {path_emissions["path"].map((step, nstep) =>
                      path_emissions["path"].length - 1 !== nstep ? (
                        <span>{step[0] + " -> "}</span>
                      ) : (
                        <span>{step[0]}</span>
                      )
                    )}
                  </p>
                </>
              ))}
            </Col>
            <Col>
              <h3>Traxecto 2 - Coche</h3>
            </Col>
            <Col>
              <h3>Traxecto 3 - Coche</h3>
            </Col>
          </Row>
        </Row>
      ))}
      <Row>
        <Col>
          <MapContainer
            /* Punto medio da ruta */
            center={{
              lat: (orixe.lat + destino.lat) / 2,
              lng: (orixe.lng + destino.lng) / 2,
            }}
            zoom={9}
            scrollWheelZoom={true}
            style={containerStyle}
          >
            <AttributionControl />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Routing ori={orixe} dest={destino} />
            <Routing ori={orixe2} dest={destino2} />
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
};
