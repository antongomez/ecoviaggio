from pydantic import BaseModel


class Node(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    type: str


class Edge(BaseModel):
    origin: str
    destination: str
    distance: float
    co2: float
    type: str


class PassengerOrigin(BaseModel):
    name: str
    latitude: float
    longitude: float


class RoutePetition(BaseModel):
    origins: list[PassengerOrigin]
    destination_latitude: float
    destination_longitude: float
