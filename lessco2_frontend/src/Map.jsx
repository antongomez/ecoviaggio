// SPDX-FileCopyrightText: 2024 EcoViaggio
//
// SPDX-License-Identifier: MIT

import React from "react";
import "leaflet-routing-machine";
import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import {
  MapContainer,
  TileLayer,
  useMap,
  Polyline,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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

const RoutingMachine = createControlComponent(createRouting);

export const Map = ({
  center,
  zoom,
  containerStyle,
  coordinate_car_routing,
  coordinate_public_cars,
  coordinate_public_planes,
  coordinate_public_trains,
  first_stop,
  last_stop,
  children,
}) => {
  return (
    <MapContainer
      center={center ? center : undefined}
      zoom={zoom ? zoom : undefined}
      scrollWheelZoom={true}
      style={containerStyle}
    >
      <AttributionControl />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <InnerMapComponent
        {...{
          coordinate_car_routing,
          coordinate_public_cars,
          coordinate_public_planes,
          coordinate_public_trains,
          first_stop,
          last_stop,
        }}
      />
      {children}
    </MapContainer>
  );
};

const getCoordinatesFromRoute = (coordinates) => {
  const points = [];
  coordinates.forEach((pair_origin_dest) => {
    pair_origin_dest.forEach((coordinates) => {
      points.push(L.latLng(coordinates));
    });
  });
  return points;
};

const InnerMapComponent = ({
  coordinate_car_routing,
  coordinate_public_cars,
  coordinate_public_planes,
  coordinate_public_trains,
  first_stop,
  last_stop,
}) => {
  // Ajusta los límites del mapa cuando punto1 o punto2 cambian
  if (
    coordinate_car_routing ||
    coordinate_public_trains ||
    coordinate_public_planes ||
    coordinate_public_cars
  ) {
    const public_transport_routes = [
      coordinate_public_cars,
      coordinate_public_planes,
      coordinate_public_trains,
    ];
    // Color to use for each public transport on the map
    const colors = ["red", "blue", "purple"];

    // Get all the points from the routes to adjust the limits of the map
    const points = [];
    if (
      coordinate_car_routing !== undefined &&
      coordinate_car_routing.length > 0
    ) {
      points.push(...getCoordinatesFromRoute(coordinate_car_routing));
    }
    public_transport_routes.forEach((route) => {
      if (route !== undefined && route.length > 0) {
        points.push(...getCoordinatesFromRoute(route));
      }
    });

    if (first_stop) console.log(first_stop);

    // Adjust the map to the points
    const map = useMap();
    const limits = L.latLngBounds(points); // Establish the points that should be visible
    map.fitBounds(limits.pad(0.1)); // Add a padding to the limits (in percentage of the map's size)

    return (
      <>
        {coordinate_car_routing &&
          coordinate_car_routing.map((coordinates_group, k) => {
            return (
              <RoutingMachine coordinates_group={coordinates_group} key={k} />
            );
          })}
        {first_stop && <Marker position={L.latLng(first_stop)} />}
        {last_stop && <Marker position={L.latLng(last_stop)} />}
        {public_transport_routes.map((route, k) => {
          if (route === undefined || route.length === 0) {
            return null;
          }
          return (
            <Polyline
              pathOptions={{ color: colors[k] }}
              positions={route}
              key={k}
            />
          );
        })}
      </>
    );
  }

  return null;
};

function AttributionControl() {
  const map = useMap();

  map.attributionControl.setPrefix(
    '<a href="https://leafletjs.com/" title="A JavaScript library for interactive maps">Leaflet</a>'
  );

  return null;
}
