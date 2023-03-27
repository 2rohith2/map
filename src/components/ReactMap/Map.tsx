import "maplibre-gl/dist/maplibre-gl.css";
import { LngLat } from "maplibre-gl";
import type { Position } from "geojson";

import {
  GeolocateControl,
  Layer,
  LayerProps,
  Map as ReactMap,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";

type Props = {
  coordinates: Position[];
  onClick: (newCoordinates: LngLat) => void;
  startCoordinates: LngLat | null | undefined;
  setStartCoordinates: (newCoordinates: LngLat) => void;
  endCoordinates: LngLat | null | undefined;
  setEndCoordinates: (newCoordinates: LngLat) => void;
};

export default function Map({
  coordinates,
  onClick,
  startCoordinates,
  setStartCoordinates,
  endCoordinates,
  setEndCoordinates,
}: Props): JSX.Element {
  const MAP_TOKEN =
    "pk.eyJ1Ijoiam9objAwMDciLCJhIjoiY2xmbWFzemIwMGEwZTN5bnJ1aDdpazFvNSJ9.YKwFxIzwf6y_C4D4s2xgtQ";

  const geoJSON: GeoJSON.Feature<GeoJSON.Geometry> = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: coordinates,
    },
    properties: {},
  };

  const layerStyle: LayerProps = {
    id: "route",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "green",
      "line-width": 3,
    },
  };

  return (
    <ReactMap
      initialViewState={{
        longitude: 77.585758,
        latitude: 12.990429,
        zoom: 15,
      }}
      style={{ width: "100%", height: "calc(100vh - 20px)" }}
      onClick={(event) => {
        const { lng, lat } = event.lngLat;
        onClick(new LngLat(lng, lat));
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={MAP_TOKEN}
    >
      <NavigationControl position="top-right" />
      <GeolocateControl />

      {startCoordinates && (
        <Marker
          anchor="center"
          color="red"
          draggable={true}
          latitude={startCoordinates.lat}
          longitude={startCoordinates.lng}
          onDragEnd={(event) => {
            const { lng, lat } = event.lngLat;
            setStartCoordinates(new LngLat(lng, lat));
          }}
        />
      )}

      {endCoordinates && (
        <Marker
          anchor="center"
          color="green"
          draggable={true}
          latitude={endCoordinates.lat}
          longitude={endCoordinates.lng}
          onDragEnd={(event) => {
            const { lng, lat } = event.lngLat;
            setEndCoordinates(new LngLat(lng, lat));
          }}
        />
      )}
      <Source id="coordinates" type="geojson" data={geoJSON}>
        <Layer {...layerStyle} />
      </Source>
    </ReactMap>
  );
}
