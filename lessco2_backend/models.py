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

