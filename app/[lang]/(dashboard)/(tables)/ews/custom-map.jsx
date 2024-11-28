"use client";
import { useEffect, useRef, useState } from "react";
import { GoogleMapApiKey } from "./constant";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const libraries = ["places"];

const mapOption = {
  streetViewControl: false,
  mapTypeControl: false,
  controlSize: 30,
  zoomControl: false,
  gestureHandling: "auto",
};

const CustomMap = ({ markerPosition, handleMarkerPosition, detailEWS }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({});
  const inputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GoogleMapApiKey,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["geometry", "name"],
          types: ["establishment"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = place.geometry.location;
          const newCenter = { lat: location.lat(), lng: location.lng() };

          setCenter(newCenter);
          handleMarkerPosition(newCenter);
          map.panTo(newCenter);
        }
      });
    }
  }, [isLoaded, map]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = { lat: latitude, lng: longitude };

          if (
            Object.keys(detailEWS).length !== 0 &&
            detailEWS.lat !== "-" &&
            detailEWS.lng !== "-"
          ) {
            const latLngFromDetail = {
              lat: Number(detailEWS.lat),
              lng: Number(detailEWS.lng),
            };
            handleMarkerPosition(latLngFromDetail);
            setCenter(latLngFromDetail);
          } else {
            setCenter(latLng);
            handleMarkerPosition(latLng);
          }
        },
        () => {
          console.error("Error fetching location.");
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    handleMarkerPosition({ lat: newLat, lng: newLng });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "300px" }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search location"
        className="border-[1.5px] border-black/25 outline-none py-2 px-3 rounded-lg text-sm w-full"
      />
      <GoogleMap
        center={center}
        zoom={12}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
          borderRadius: "0.75rem",
          marginTop: "0.5rem",
        }}
        onLoad={(mapInstance) => setMap(mapInstance)}
        options={mapOption}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </div>
  );
};

export default CustomMap;
