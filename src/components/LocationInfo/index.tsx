import { LngLat } from "maplibre-gl";
import "./index.css";

type Props = {
  startCoordinates: LngLat | null | undefined;
  endCoordinates: LngLat | null | undefined;
};

export default function CoordinatesInfo({
  startCoordinates,
  endCoordinates,
}: Props) {
  return (
    <>
      {startCoordinates && endCoordinates && (
        <div className="info">
          Start [{startCoordinates.lat}, {startCoordinates.lng}]
          <br />
          <br />
          End [{endCoordinates.lat}, {endCoordinates.lng}]
        </div>
      )}
    </>
  );
}
