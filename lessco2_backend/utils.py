import math

def distancia_semiverseno(coord1, coord2):
    radioTierra = 6371
    lat1 = math.radians(coord1[0])
    lon1 = math.radians(coord1[1])
    lat2 = math.radians(coord2[0])
    lon2 = math.radians(coord2[1])

    sinChi = math.sin((lat2 - lat1) / 2)
    sinLambda = math.sin((lon2 - lon1) / 2)

    raiz = (sinChi * sinChi) + math.cos(lat1) * math.cos(lat2) * (sinLambda * sinLambda)

    return 2 * radioTierra * math.asin(math.sqrt(raiz))