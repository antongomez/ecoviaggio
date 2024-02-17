import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

export const Results2 = () => {
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
              {travelgroup.step2.map((path_emissions) => (
                <></>
              ))}
            </Col>
            <Col>
              <h3>Traxecto 3 - Coche</h3>
              {travelgroup.step3.map((path_emissions) => (
                <></>
              ))}
            </Col>
          </Row>
        </Row>
      ))}
    </Container>
  );
};
