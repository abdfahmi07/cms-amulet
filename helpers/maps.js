import axios from "axios";

export const getAdress = async (latLng) => {
  try {
    const { lat, lng } = latLng;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    const { data } = await axios.get(url);

    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
