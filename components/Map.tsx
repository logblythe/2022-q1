import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "96vh",
};

interface IProps {
  lat: number;
  lng: number;
  browser: string;
}

const Map = ({ lat, lng, browser }: IProps) => {
  const center = React.useMemo(
    () => ({
      lat,
      lng,
    }),
    [lat, lng]
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={20}>
      <Marker position={center} label={browser}></Marker>
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(Map);
