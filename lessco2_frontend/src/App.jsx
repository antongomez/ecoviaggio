import Container from "react-bootstrap/esm/Container";
import { Header } from "./Header";
import { TravellerCard } from "./TravellerCard";
import { Row } from "react-bootstrap";

export const App = () => {
  return (
    <>
      <Header />
      <Container fluid className="mt-2 bg-light">
        <Row className="justify-content-center py-5 text-center">
          <h2>Welcome to EcoViaggio</h2>
          <p>Travel responsibly, leave a greener tomorrow</p>
        </Row>
        <TravellerCard />
      </Container>
    </>
  );
};
