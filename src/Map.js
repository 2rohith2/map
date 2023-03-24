import Actions from './components/Actions';
import CoordinatesInfo from './components/LocationInfo';
import React, { useEffect, useState } from 'react';

import Map, {
  GeolocateControl,
  Layer,
  Marker,
  NavigationControl,
  Source
} from 'react-map-gl';

import 'maplibre-gl/dist/maplibre-gl.css';

export default function CoordinatesMap() {
  const [startCoordinates, setStart] = useState(null);
  const [endCoordinates, setEnd] = useState(null);
  const [coordinates, setCoordinates] = useState([]);
  const MAP_TOKEN = 'pk.eyJ1Ijoiam9objAwMDciLCJhIjoiY2xmbWFzemIwMGEwZTN5bnJ1aDdpazFvNSJ9.YKwFxIzwf6y_C4D4s2xgtQ';
  const ROUTE_API = 'https://routing.openstreetmap.de/routed-bike/route/v1/driving/{start_coordinates};{end_coordinates}?overview=false&alternatives=true&steps=true';

  const geoJSON = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
      'type': 'LineString',
      'coordinates': coordinates
    }
  };

  const layerStyle = {
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': 'green',
      'line-width': 3
    }
  };

  function resetCoordinates() {
    setStart(null);
    setEnd(null);
    setCoordinates([]);
  }

  function swapCoordinates() {
    setStart(endCoordinates);
    setEnd(startCoordinates);
  }

  function getMap() {
    return (
      <Map
        initialViewState={{
          longitude: 77.585758,
          latitude: 12.990429,
          zoom: 15,
        }}
        style={{ width: "calc(100vw - 15px)", height: "calc(100vh - 20px)" }}
        onClick={(event) => {
          if (startCoordinates) {
            setEnd(event.lngLat)
          } else {
            setStart(event.lngLat)
          }

          if (startCoordinates && endCoordinates) resetCoordinates();
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAP_TOKEN}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl />
        {startCoordinates &&
          <Marker
            anchor="center"
            color='red'
            draggable={true}
            latitude={startCoordinates.lat}
            longitude={startCoordinates.lng}
            onDragEnd={(event) => setStart(event.lngLat)}
          />
        }
        {endCoordinates &&
          <Marker
            anchor="center"
            color='green'
            draggable={true}
            latitude={endCoordinates.lat}
            longitude={endCoordinates.lng}
            onDragEnd={(event) => setEnd(event.lngLat)}
          />
        }
        <Source id="coordinates" type="geojson" data={geoJSON}>
          <Layer {...layerStyle} />
        </Source>
      </Map>
    )
  }

  useEffect(() => {
    async function fetchData() {
      const START_COORDINATES = `${startCoordinates.lng},${startCoordinates.lat}`;
      const END_COORDINATES = `${endCoordinates.lng},${endCoordinates.lat}`;
      const response = await (
        await fetch(ROUTE_API
          .replace("{start_coordinates}", START_COORDINATES)
          .replace("{end_coordinates}", END_COORDINATES))
      )
        .json();
      const coordinates = [];
      const steps = response.routes[0].legs[0].steps;
      steps.forEach(step => {
        coordinates.push(step.maneuver.location);
      });
      setCoordinates(coordinates);
    }

    if (startCoordinates && endCoordinates) fetchData();
  }, [startCoordinates, endCoordinates]);

  return (
    <>
      <Actions
        onClose={() => resetCoordinates()}
        onSwap={() => swapCoordinates()}
      />

      {startCoordinates && endCoordinates &&
        <CoordinatesInfo
          startCoordinates={startCoordinates}
          endCoordinates={endCoordinates}
        />
      }

      {getMap()}
    </>
  );
}