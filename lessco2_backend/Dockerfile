# SPDX-FileCopyrightText: 2024 EcoViaggio
#
# SPDX-License-Identifier: MIT

FROM python:3.10

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "python", "./main.py" ]
