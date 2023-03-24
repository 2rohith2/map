import "./index.css";

export default function CoordinatesInfo(props) {
  return (
    <div className="info">
      Start Coordinates: [{props.startCoordinates.lat}, {props.startCoordinates.lng}]
      <br />
      <br />
      End Coordinates: [{props.endCoordinates.lat}, {props.endCoordinates.lng}]
    </div>
  );
}