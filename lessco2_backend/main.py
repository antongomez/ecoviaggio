from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from load_public_transport_graph import load_default_public_transport_graph
from rutas import obtain_all_routes
from models import RoutePetition


app = FastAPI()

with open("allowed_origins.txt") as f:
    origins = f.read().splitlines()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

emissions_graph, node_data, edge_data = load_default_public_transport_graph()

app.EMISSIONS_GRAPH = emissions_graph
app.NODE_DATA = node_data
app.EDGE_DATA = edge_data

@app.get("/hello")
def hello() -> None:
    return {"message": "Hello, world!"}

@app.post("/routes")
def get_route(petition: RoutePetition) -> None:
    travellers = [(t.name, t.latitude, t.longitude) for t in petition.origins]
    destination = ("Destination", petition.destination_latitude, petition.destination_longitude)
    routes = obtain_all_routes(travellers, destination, app.EMISSIONS_GRAPH, app.NODE_DATA, app.EDGE_DATA)
    return routes

    


