import React, { useEffect, useState } from "react";

import { CssBaseline, Grid } from "@material-ui/core";
import { getPlaceData, getWeatherData } from "./api";
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";
import List from "./components/List/List";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState("");
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    if (bounds.ne && bounds.sw) {
      setIsLoading(true);

      getWeatherData(coordinates).then((data) => {
        setWeatherData(data);
      });

      getPlaceData(type, bounds.ne, bounds.sw).then((data) => {
        setFilteredPlaces([]);
        setPlaces(data?.filter((place) => place.name && place.num_reviews));
        setIsLoading(false);
      });
    }
  }, [bounds, type]);

  useEffect(() => {
    const filteredArray = places?.filter((place) => place.rating > rating);
    setFilteredPlaces(filteredArray);
  }, [rating, places]);
  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ Width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces?.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces?.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
