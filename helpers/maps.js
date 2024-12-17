"use client";

import axios from "axios";

export const getAddress = async (latLng) => {
  console.log(latLng);
  try {
    const { lat, lng } = latLng;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCJD7w_-wHs4Pe5rWMf0ubYQFpAt2QF2RA`;
    const { data } = await axios.get(url);

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
