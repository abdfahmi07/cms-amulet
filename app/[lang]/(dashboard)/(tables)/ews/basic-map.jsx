"use client";
import { GoogleMapApiKey } from "./constant";
import { useCallback, useEffect, useRef, useState } from "react";
import { Location } from "@/components/svg";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "0.75rem",
};

const mapOption = {
  streetViewControl: false,
  mapTypeControl: false,
  controlSize: 30,
  zoomControl: false,
  gestureHandling: "auto",
};

const BasicMap = ({
  height = 300,
  handleMarkerPosition,
  markerPosition,
  map,
  handleSetMap,
}) => {
  // const [maps, setMaps] = useState(null);
  // const [center, setCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // Default center (San Francisco)
  // const [markerPosition, setMarkerPosition] = useState({
  //   lat: 37.7749,
  //   lng: -122.4194,
  // });
  // const inputRef = useRef();
  const autocompleteRef = useRef(null);
  const [mapCenterPosition, setMapCenterPosition] = useState({});

  // const defaultProps = {
  //     center: {
  //         lat: 10.99835602,
  //         lng: 77.01502627
  //     },
  //     zoom: 11
  // };

  // const handleApiLoaded = ({ map, maps }) => {
  //   setMap(map);
  //   setMaps(maps);

  //   const autocompleteInstance = new maps.places.Autocomplete(inputRef.current);
  //   autocompleteInstance.bindTo("bounds", map); // Bias results to map's viewport
  //   console.log("tesss", autocompleteInstance);

  //   autocompleteInstance.addListener("place_changed", () => {
  //     console.log("tes");
  //     const place = autocompleteInstance.getPlace();
  //     if (place.geometry && place.geometry.location) {
  //       const location = {
  //         lat: place.geometry.location.lat(),
  //         lng: place.geometry.location.lng(),
  //       };
  //       setCenter(location); // Update map center
  //       setMarkerPosition(location); // Add marker at the selected location
  //       map.panTo(location); // Center map to selected location
  //     }
  //   });
  // };

  const onLoad = useCallback(function callback(map) {
    handleSetMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    handleSetMap(null);
  }, []);

  const handleOnLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const handleMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    handleMarkerPosition({ lat: newLat, lng: newLng });
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const coordinatePlace = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMapCenterPosition(coordinatePlace);
      handleMarkerPosition(coordinatePlace);
    } else {
      console.error("No details available for the selected place.");
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latLng = { lat: latitude, lng: longitude };
          setMapCenterPosition(latLng);
          handleMarkerPosition(latLng);
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

  return (
    // <div style={{ height: height, width: "100%", borderRadius: "0.5rem" }}>
    //   <input
    //     ref={inputRef}
    //     type="text"
    //     placeholder="Search for a place"
    //     style={{
    //       //   position: "absolute",
    //       //   top: "10px",
    //       //   left: "50%",
    //       //   transform: "translateX(-50%)",
    //       //   zIndex: 10,
    //       marginBottom: "0.5rem",
    //       outline: "none",
    //       width: "100%",
    //       padding: "10px",
    //       borderRadius: "8px",
    //       border: "1px solid #ccc",
    //     }}
    //   />
    //   <GoogleMapReact
    //     bootstrapURLKeys={{ key: GoogleMapApiKey, libraries: ["places"] }}
    //     defaultZoom={10}
    //     center={center}
    //     onGoogleApiLoaded={handleApiLoaded}
    //     yesIWantToUseGoogleMapApiInternals
    //   >
    //     {markerPosition && (
    //       <Marker lat={markerPosition.lat} lng={markerPosition.lng} />
    //     )}
    //   </GoogleMapReact>
    // </div>
    <LoadScript googleMapsApiKey={GoogleMapApiKey} libraries={["places"]}>
      <Autocomplete
        onLoad={handleOnLoad}
        onPlaceChanged={handlePlaceChanged}
        className="mb-4"
      >
        <input
          type="text"
          placeholder="Search place"
          className="border-[1.5px] border-black/25 outline-none py-2 px-3 rounded-lg text-sm w-full"
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenterPosition}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        streetView={false}
        options={mapOption}
      >
        <Marker
          position={markerPosition}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default BasicMap;
