import { LngLat } from "maplibre-gl";
import { useEffect, useState } from "react";
import Actions from "./components/Actions";
import CoordinatesInfo from "./components/LocationInfo";
import Map from "./components/ReactMap/Map";
import type { Position } from "geojson";

export default function App(): JSX.Element {
  const [startCoordinates, setStartCoordinates] = useState<LngLat | null>();
  const [endCoordinates, setEndCoordinates] = useState<LngLat | null>();
  const [coordinates, setCoordinates] = useState<Position[]>([]);
  
  const ROUTE_API_URL =
    "https://routing.openstreetmap.de/routed-bike/route/v1/driving/{start_coordinates};{end_coordinates}?overview=false&alternatives=true&steps=true";

  function resetCoordinates() {
    setStartCoordinates(null);
    setEndCoordinates(null);
    setCoordinates([]);
  }

  function swapCoordinates() {
    setStartCoordinates(endCoordinates);
    setEndCoordinates(startCoordinates);
  }

  useEffect(() => {
    async function fetchData(startCoordinates: LngLat, endCoordinates: LngLat) {
      const START_COORDINATES = `${startCoordinates.lng},${startCoordinates.lat}`;
      const END_COORDINATES = `${endCoordinates.lng},${endCoordinates.lat}`;

      const response = await (
        await fetch(
          ROUTE_API_URL
          .replace("{start_coordinates}", START_COORDINATES)
          .replace("{end_coordinates}", END_COORDINATES)
        )
      ).json();

      const coordinates: Position[] = [];
      const steps = response.routes[0].legs[0].steps;
      steps.forEach((step: any) => {
        coordinates.push(step.maneuver.location);
      });
      setCoordinates(coordinates);
    }

    if (startCoordinates && endCoordinates)
      fetchData(startCoordinates, endCoordinates);
  }, [startCoordinates, endCoordinates]);

  return (
    <>
      <Actions
        onClose={() => resetCoordinates()}
        onSwap={() => swapCoordinates()}
        isDisabled={startCoordinates && endCoordinates ? false : true}
      />

      <CoordinatesInfo
        startCoordinates={startCoordinates}
        endCoordinates={endCoordinates}
      />

      <Map
        coordinates={coordinates}
        startCoordinates={startCoordinates}
        endCoordinates={endCoordinates}
        setStartCoordinates={setStartCoordinates}
        setEndCoordinates={setEndCoordinates}
        onClick={(newCoordinates: LngLat) => {
          if (startCoordinates) {
            setEndCoordinates(newCoordinates);
          } else {
            setStartCoordinates(newCoordinates);
          }

          if (startCoordinates && endCoordinates) resetCoordinates();
        }}
        
      />
    </>
  );
}
