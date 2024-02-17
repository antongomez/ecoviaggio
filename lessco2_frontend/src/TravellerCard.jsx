import React from "react";
import { useState } from "react";
import { Col, Form, Row, Container } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useMapEvent } from "react-leaflet/hooks";

export const TravellerCard = () => {
  const [latitud, setLatitud] = useState(undefined);
  const [longitud, setLongitud] = useState(undefined);

  const containerStyle = {
    width: "100 %",
    height: "200px",
  };
  const defaultCenter = {
    lat: 43.3322352,
    lng: -8.4106015,
  };

  function LocationMarker() {
    /* Hook providing the Leaflet Map instance in any descendant of a MapContainer */
    const map = useMapEvent("click", (e) => {
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
    });

    return latitud === undefined || longitud === undefined ? undefined : (
      <Marker position={{ lat: latitud, lng: longitud }}>
        <Popup>Punto de partida</Popup>
      </Marker>
    );
  }

  return (
    <Container fluid>
      <Row className="border rounded-2 shadow bg-white mx-4 my-2 p-3 w-80">
        <Col lg={8}>
          <Row className="mt-2 mb-3">
            <h2>Passenger 1</h2>
          </Row>
          <Row className="">
            <Col lg={6} className="d-flex flex-column justify-content-center">
              <Form.Label htmlFor="inputName">Name</Form.Label>
              <Form.Control
                type="input"
                id="inputName"
                aria-describedby="passwordHelpBlock"
                className="w-75"
              />
            </Col>
            <Col lg={6} className="d-flex flex-column justify-content-center">
              <Form.Label htmlFor="inputName">Nickname</Form.Label>
              <Form.Control
                type="input"
                id="inputName"
                aria-describedby="passwordHelpBlock"
                className="w-75"
              />
            </Col>
          </Row>
        </Col>
        <Col lg={4} className="">
          <MapContainer
            center={defaultCenter}
            zoom={8}
            scrollWheelZoom={true}
            style={containerStyle}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
};
