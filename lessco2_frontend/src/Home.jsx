// SPDX-FileCopyrightText: 2024 EcoViaggio
//
// SPDX-License-Identifier: MIT

import Container from "react-bootstrap/esm/Container";
import { TravellerCard } from "./TravellerCard";
import { Col, Row, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Check } from "react-bootstrap-icons";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMapEvent } from "react-leaflet/hooks";
import axios from "axios";
import API from "./API";

export const Home = () => {
  const navigate = useNavigate();
  const [containerCount, setContainerCount] = useState(1);
  const [containerId, setContainerId] = useState(1);
  const [travellerCards, setTravellerCards] = useState(
    Array.from({ length: containerCount }, (_, index) => ({
      id: index + 1,
      passengerNumber: index + 1,
      lat: undefined,
      lng: undefined,
      name: undefined,
    }))
  );
  const [latitud, setLatitud] = useState(undefined);
  const [longitud, setLongitud] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  const defaultCenter = {
    lat: 43.3322352,
    lng: -8.4106015,
  };

  const addContainer = () => {
    const newCard = {
      id: containerId + 1,
      passengerNumber: containerCount + 1,
      lat: undefined,
      lng: undefined,
      name: undefined,
    };

    setContainerId(containerId + 1);
    setContainerCount(containerCount + 1);
    setTravellerCards((prevCards) => [...prevCards, newCard]);
  };

  const updateContainer = (id, lat, lng, name) => {
    setTravellerCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, lat: lat, lng: lng, name: name } : card
      )
    );
  };

  const removeContainer = (id) => {
    setTravellerCards((prevCards) =>
      prevCards.filter((card) => card.id !== id)
    );

    setTravellerCards((prevCards) =>
      prevCards.map((card, index) => ({
        ...card,
        passengerNumber: index + 1,
      }))
    );

    setContainerCount(containerCount - 1);
  };

  function AttributionControl() {
    const map = useMap();

    map.attributionControl.setPrefix(
      '<a href="https://leafletjs.com/" title="A JavaScript library for interactive maps">Leaflet</a>'
    );

    return null;
  }

  function LocationMarker() {
    const map = useMapEvent("click", (e) => {
      setLatitud(e.latlng.lat);
      setLongitud(e.latlng.lng);
    });

    return latitud === undefined || longitud === undefined ? undefined : (
      <Marker position={{ lat: latitud, lng: longitud }}>
        <Popup>Punto de destino</Popup>
      </Marker>
    );
  }

  const onClickBuildTrip = () => {
    setLoading(true);
    axios
      .post(API.instance().getHTTPURLForPath("/routes"), {
        origins: travellerCards.map((card) => ({
          name: card.name,
          latitude: card.lat,
          longitude: card.lng,
        })),
        destination_latitude: latitud,
        destination_longitude: longitud,
      })
      .then((response) => response.data)
      .then((data) => {
        setLoading(false);
        navigate("/results", { state: data });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <Container fluid className="py-5 bg-body-tertiary mb-5">
        <Row className="justify-content-center py-5 text-center">
          <h1 className="text-primary fw-bolder">Welcome to EcoViaggio!</h1>
          <p>Travel responsibly, leave a greener tomorrow</p>
        </Row>
        <Row className="mx-4 px-3">
          <Col className="px-0">
            <h2 className="fw-bolder">Passengers</h2>
            <p>
              Introduce the full name of each passenger and its departure
              location on the map
            </p>
          </Col>
        </Row>
        {travellerCards.map((card) => (
          <TravellerCard
            key={card.id}
            id={card.id}
            passengerNumber={card.passengerNumber}
            lat={card.lat}
            lng={card.lng}
            onDelete={removeContainer}
            onUpdate={updateContainer}
          />
        ))}
        <Row className="justify-content-center my-4 mx-5">
          <Col xs="auto">
            <button className="btn btn-primary mx-2" onClick={addContainer}>
              Add Passenger
            </button>
          </Col>
        </Row>
        <Row className="mx-4 px-3">
          <Col>
            <Row>
              <Col xs="auto">
                <h2 className="fw-bolder">Destination</h2>
              </Col>
              <Col xs="auto">
                <Check
                  size={40}
                  className="text-success"
                  visibility={
                    latitud == undefined || longitud == undefined
                      ? "hidden"
                      : "visible"
                  }
                />
              </Col>
            </Row>
            <p>Select the destination of your trip using the map</p>
          </Col>
        </Row>
        <Row className="mx-4 px-3 d-flex justify-content-center">
          <Col lg={8} className="px-0">
            <MapContainer
              center={defaultCenter}
              zoom={8}
              scrollWheelZoom={true}
              style={containerStyle}
            >
              <AttributionControl />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
            </MapContainer>
          </Col>
        </Row>
      </Container>
      <footer className="footer mt-auto py-3 bg-white shadow fixed-bottom">
        <Row className="px-3 d-flex align-items-center">
          <Col xs="auto" className="ms-4">
            <p className="my-0">
              Complete passengers:{" "}
              {
                travellerCards.filter(
                  (card) =>
                    card.lat !== undefined &&
                    card.lng !== undefined &&
                    card.name !== undefined &&
                    card.name.length > 0
                ).length
              }
              /{travellerCards.length}
            </p>
          </Col>
          <Col>
            <p className="my-0">
              Destination:{" "}
              {latitud == undefined || longitud == undefined
                ? "unselected"
                : "selected"}
            </p>
          </Col>
          <Col className="d-flex flex-column align-items-end">
            <button
              disabled={
                loading === true ||
                latitud == undefined ||
                longitud == undefined ||
                travellerCards.filter(
                  (card) =>
                    card.lat !== undefined &&
                    card.lng !== undefined &&
                    card.name !== undefined &&
                    card.name.length > 0
                ).length < travellerCards.length
                  ? true
                  : false
              }
              className="btn btn-primary me-4"
              onClick={onClickBuildTrip}
            >
              {loading === false ? (
                "Build Trip"
              ) : (
                <Spinner animation="border" variant="light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </button>
          </Col>
        </Row>
      </footer>
    </>
  );
};
