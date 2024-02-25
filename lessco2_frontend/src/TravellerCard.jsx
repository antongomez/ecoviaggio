// SPDX-FileCopyrightText: 2024 EcoViaggio
//
// SPDX-License-Identifier: MIT

import React from "react";
import { useState } from "react";
import { Col, Form, Row, Container, Button } from "react-bootstrap";
import { Trash, Check } from "react-bootstrap-icons";
import "leaflet/dist/leaflet.css";
import "./scss/travellercard.scss";
import { Marker, Popup } from "react-leaflet";
import { useMapEvent } from "react-leaflet/hooks";
import { Map } from "./Map";

export const TravellerCard = ({
  id,
  passengerNumber,
  name,
  lat,
  lng,
  onDelete,
  onUpdate,
}) => {
  const [latitud, setLatitud] = useState(lat);
  const [longitud, setLongitud] = useState(lng);
  const [inputname, setInputname] = useState(name);

  let inputnameid = `input-name-${passengerNumber}`;

  const mapOriginStyle = {
    width: "100 %",
    height: "200px",
  };

  const defaultCenter = {
    lat: 43.3322352,
    lng: -8.4106015,
  };

  const mapOriginZoom = 8;

  function LocationMarker() {
    /* Hook providing the Leaflet Map instance in any descendant of a MapContainer */
    const map = useMapEvent("click", (e) => {
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
      onUpdate(id, e.latlng.lat, e.latlng.lng, inputname);
      map.flyTo(e.latlng, map.getZoom(), { duration: 0.5 });
    });

    return latitud === undefined || longitud === undefined ? undefined : (
      <Marker position={{ lat: latitud, lng: longitud }}>
        <Popup>Starting point</Popup>
      </Marker>
    );
  }

  return (
    <Container fluid>
      <Row className="border rounded-2 shadow bg-white mx-4 my-2 p-3">
        <Col lg={8}>
          <Row className="mt-2 mb-3">
            <Col xs="auto">
              <h3>Passenger {passengerNumber}</h3>
            </Col>
            <Col xs="auto" className="d-flex align-items-center">
              <Check
                size={40}
                className="x text-success"
                visibility={
                  latitud == undefined ||
                  longitud == undefined ||
                  inputname == undefined ||
                  inputname == ""
                    ? "hidden"
                    : "visible"
                }
              />
            </Col>
            <Col xs="auto" className="d-flex align-items-center">
              <Button
                variant="transparent"
                className="p-0 border-0"
                onClick={() => onDelete(id)}
              >
                <Trash size={24} className="trash" />
              </Button>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col lg={6} className="d-flex flex-column justify-content-center">
              <Form.Label htmlFor={inputnameid}>Full Name</Form.Label>
              <Form.Control
                type="input"
                defaultValue={name}
                id={inputnameid}
                className="w-100"
                onChange={(e) => {
                  setInputname(e.target.value);
                  onUpdate(id, latitud, longitud, e.target.value);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={4} className="">
          <Map
            center={defaultCenter}
            zoom={mapOriginZoom}
            containerStyle={mapOriginStyle}
          >
            <LocationMarker />
          </Map>
        </Col>
      </Row>
    </Container>
  );
};
