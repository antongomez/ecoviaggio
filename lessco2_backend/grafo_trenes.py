# SPDX-FileCopyrightText: 2024 EcoViaggio
#
# SPDX-License-Identifier: MIT

from models import Node, Edge

from utils import distancia_semiverseno

class TrainsGraph:
    def __init__(self):
        self.node_data = {}
        self.node_data["31412"] = Node(
            id="31412", name="A Coruña", latitude=43.3496932, longitude=-8.4155629, type="TRAIN_STATION"
        )
        self.node_data["60600"] = Node(
            id="60600", name="Albacete - Los Llanos", latitude=38.999384, longitude=-1.84845, type="TRAIN_STATION"
        )
        self.node_data["60911"] = Node(
            id="60911", name="Alicante", latitude=38.34445, longitude=-0.4950527, type="TRAIN_STATION"
        )
        self.node_data["56312"] = Node(
            id="56312", name="Almería", latitude=36.834951, longitude=-2.455519, type="TRAIN_STATION"
        )
        self.node_data["10400"] = Node(
            id="10400", name="Ávila", latitude=40.657255, longitude=-4.683312, type="TRAIN_STATION"
        )
        self.node_data["71801"] = Node(
            id="71801", name="Barcelona - Sants", latitude=41.37922, longitude=2.140624, type="TRAIN_STATION"
        )
        self.node_data["13200"] = Node(
            id="13200",
            name="Bilbao - Abando Indalecio Prieto",
            latitude=43.259609,
            longitude=-2.92915,
            type="TRAIN_STATION",
        )
        self.node_data["11014"] = Node(
            id="11014", name="Burgos - Rosa de Lima", latitude=42.371197, longitude=-3.666308, type="TRAIN_STATION"
        )
        self.node_data["35400"] = Node(
            id="35400", name="Cáceres", latitude=39.461131, longitude=-6.385679, type="TRAIN_STATION"
        )
        self.node_data["51405"] = Node(
            id="51405", name="Cádiz", latitude=36.5290083, longitude=-6.2882055, type="TRAIN_STATION"
        )
        self.node_data["65300"] = Node(
            id="65300", name="Castelló", latitude=39.9882552, longitude=-0.0524126, type="TRAIN_STATION"
        )
        self.node_data["37200"] = Node(
            id="37200", name="Ciudad Real", latitude=38.9853, longitude=-3.913633, type="TRAIN_STATION"
        )
        self.node_data["50500"] = Node(
            id="50500", name="Córdoba", latitude=37.888291, longitude=-4.789453, type="TRAIN_STATION"
        )
        self.node_data["03208"] = Node(
            id="03208", name="Cuenca - Fernando Zobel", latitude=40.035192, longitude=-2.14441, type="TRAIN_STATION"
        )
        self.node_data["79300"] = Node(
            id="79300", name="Girona", latitude=41.979303, longitude=2.817006, type="TRAIN_STATION"
        )
        self.node_data["05000"] = Node(
            id="05000", name="Granada", latitude=37.184038, longitude=-3.609154, type="TRAIN_STATION"
        )
        self.node_data["70200"] = Node(
            id="70200", name="Guadalajara", latitude=40.6441032, longitude=-3.1822298, type="TRAIN_STATION"
        )
        self.node_data["43019"] = Node(
            id="43019", name="Huelva", latitude=37.253079, longitude=-6.950971, type="TRAIN_STATION"
        )
        self.node_data["74200"] = Node(
            id="74200", name="Huesca", latitude=42.133594, longitude=-0.409745, type="TRAIN_STATION"
        )
        self.node_data["03100"] = Node(
            id="03100", name="Jaen", latitude=37.779827, longitude=-3.790798, type="TRAIN_STATION"
        )
        self.node_data["15100"] = Node(
            id="15100", name="León", latitude=42.596048, longitude=-5.582428, type="TRAIN_STATION"
        )
        self.node_data["78400"] = Node(
            id="78400", name="Lleida", latitude=41.620696, longitude=0.632669, type="TRAIN_STATION"
        )
        self.node_data["81100"] = Node(
            id="81100", name="Logroño", latitude=42.457459, longitude=-2.442193, type="TRAIN_STATION"
        )
        self.node_data["17000"] = Node(
            id="17000", name="Madrid - Chamartin", latitude=40.4720993, longitude=-3.6824687, type="TRAIN_STATION"
        )
        self.node_data["54413"] = Node(
            id="54413", name="Málaga - Maria Zambrano", latitude=36.7113388, longitude=-4.4313888, type="TRAIN_STATION"
        )
        self.node_data["37500"] = Node(
            id="37500", name="Mérida", latitude=38.921503, longitude=-6.343794, type="TRAIN_STATION"
        )
        self.node_data["61200"] = Node(
            id="61200", name="Murcia", latitude=37.97465, longitude=-1.1299555, type="TRAIN_STATION"
        )
        self.node_data["22100"] = Node(
            id="22100", name="Ourense", latitude=42.350389, longitude=-7.872777, type="TRAIN_STATION"
        )
        self.node_data["15211"] = Node(
            id="15211", name="Oviedo", latitude=43.366841, longitude=-5.854263, type="TRAIN_STATION"
        )
        self.node_data["14100"] = Node(
            id="14100", name="Palencia", latitude=42.015711, longitude=-4.534135, type="TRAIN_STATION"
        )
        self.node_data["80100"] = Node(
            id="80100", name="Pamplona - Iruña", latitude=42.824877, longitude=-1.661419, type="TRAIN_STATION"
        )
        self.node_data["23004"] = Node(
            id="23004", name="Pontevedra", latitude=42.421969, longitude=-8.635546, type="TRAIN_STATION"
        )
        self.node_data["30100"] = Node(
            id="30100", name="Salamanca", latitude=40.972235, longitude=-5.64899, type="TRAIN_STATION"
        )
        self.node_data["14223"] = Node(
            id="14223", name="Santander", latitude=43.458575, longitude=-3.811223, type="TRAIN_STATION"
        )
        self.node_data["31400"] = Node(
            id="31400", name="Santiago de Compostela", latitude=42.870842, longitude=-8.544697, type="TRAIN_STATION"
        )
        self.node_data["12100"] = Node(
            id="12100", name="Segovia", latitude=40.93403, longitude=-4.11365, type="TRAIN_STATION"
        )
        self.node_data["51003"] = Node(
            id="51003", name="Sevilla - Santa Justa", latitude=37.3921277, longitude=-5.9752694, type="TRAIN_STATION"
        )
        self.node_data["82100"] = Node(
            id="82100", name="Soria", latitude=41.754754, longitude=-2.476537, type="TRAIN_STATION"
        )
        self.node_data["71500"] = Node(
            id="71500", name="Tarragona", latitude=41.111624, longitude=1.253214, type="TRAIN_STATION"
        )
        self.node_data["67200"] = Node(
            id="67200", name="Teruel", latitude=40.341029, longitude=-1.110284, type="TRAIN_STATION"
        )
        self.node_data["92102"] = Node(
            id="92102", name="Toledo", latitude=39.862272, longitude=-4.011244, type="TRAIN_STATION"
        )
        self.node_data["65000"] = Node(
            id="65000",
            name="Valencia - Estacio del Nord",
            latitude=39.4669346,
            longitude=-0.3771842,
            type="TRAIN_STATION",
        )
        self.node_data["10600"] = Node(
            id="10600", name="Valladolid", latitude=41.642167, longitude=-4.726986, type="TRAIN_STATION"
        )
        self.node_data["08223"] = Node(
            id="08223", name="Vigo Urzaiz", latitude=42.234189, longitude=-8.713728, type="TRAIN_STATION"
        )
        self.node_data["30200"] = Node(
            id="30200", name="Zamora", latitude=41.515892, longitude=-5.739675, type="TRAIN_STATION"
        )
        self.node_data["04040"] = Node(
            id="04040", name="Zaragoza - Delicias", latitude=41.658649, longitude=-0.911615, type="TRAIN_STATION"
        )
    
        base_graph = {}

        base_graph["31412"] = {"31400"}  # A Coruña
        base_graph["31400"] = {"23004", "22100"}  # Santiago de Compostela
        base_graph["23004"] = {"08223"}  # Pontevedra
        base_graph["08223"] = {"22100"}  # Vigo
        base_graph["22100"] = {"30200", "15100"}  # Ourense
        base_graph["15100"] = {"15211", "14100"}  # León
        base_graph["30200"] = {"10600", "12100", "30100"}  # Zamora
        base_graph["14100"] = {"14223", "11014", "10600"}  # Palencia
        base_graph["10600"] = {"12100"}  # Valladolid
        base_graph["30100"] = {"10400"}  # Salamanca
        base_graph["10400"] = {"12100", "17000"}  # Avila
        base_graph["11014"] = {"13200", "80100", "81100"}  # Burgos
        base_graph["80100"] = {"04040"}  # Pamplona
        base_graph["81100"] = {"04040"}  # Logroño
        base_graph["12100"] = {"17000"}  # Segovia
        base_graph["17000"] = {"70200", "03208", "92102", "35400", "37200"}  # Madrid
        base_graph["70200"] = {"82100"}  # Soria
        base_graph["04040"] = {"82100", "74200", "78400", "67200"}  # Zaragoza
        base_graph["67200"] = {"65300"}  # Teurel
        base_graph["71500"] = {"78400", "65300", "71801"}
        base_graph["71801"] = {"79300"}  # Barcelona
        base_graph["65000"] = {"65300", "03208"}  # Valencia
        base_graph["60600"] = {"03208", "60911", "61200"}  # Albacete
        base_graph["60911"] = {"61200"}  # Alicante
        base_graph["37500"] = {"35400", "37200", "51003", "43019"}  # Merida
        base_graph["51003"] = {"43019", "50500", "51405", "54413"}  # Sevilla
        base_graph["50500"] = {"37200", "03100", "54413"}  # Cordoba
        base_graph["05000"] = {"54413", "56312"}  # Granada

        # Make symmetric: merge graph with its transposed
        transposed = {}
        for origin in base_graph:
            for destination in base_graph[origin]:
                if destination not in transposed:
                    transposed[destination] = {origin}
                else:
                    transposed[destination].add(origin)

        # Merge
        for origin in transposed:
            if origin in base_graph:
                base_graph[origin] = base_graph[origin].union(transposed[origin])
            else:
                base_graph[origin] = transposed[origin]

                # Add node and edge data
        self.trains_graph = {}

        for origin in base_graph:
            self.trains_graph[origin] = {}
            for destination in base_graph[origin]:
                lat1 = self.node_data[origin].latitude
                lon1 = self.node_data[origin].longitude
                lat2 = self.node_data[destination].latitude
                lon2 = self.node_data[destination].longitude
                self.trains_graph[origin][destination] = Edge(
                    origin=origin, destination=destination, distance=distancia_semiverseno((lat1, lon1), (lat2, lon2)), co2=1, type="TRAIN"
                )
