import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import Rating from "@material-ui/lab/Rating";

import useStyles from "./styles";
import { mapStyles } from "./mapStyles";

const Map = ({
  coordinates,
  setCoordinates,
  setBounds,
  places,
  setChildClicked,
  weatherData,
}) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery("(min-width : 600px)");
  const [defautlCoordinate, setDefautlCoordinate] = useState({});

  useEffect(() => {
    setDefautlCoordinate(coordinates);
  }, []);

  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={defautlCoordinate}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: mapStyles,
        }}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => setChildClicked(child)}
      >
        {places?.map((place, i) => (
          <div
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
            className={classes.markerContainer}
          >
            {!isDesktop ? (
              <LocationOnOutlinedIcon color="primary" fontSize="large" />
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography
                  className={classes.typography}
                  variant="subtitle"
                  gutterBottom
                >
                  {place.name}
                </Typography>
                <img
                  src={
                    place.photo
                      ? place.photo.images.large.url
                      : "https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg"
                  }
                  alt={place.name}
                  className={classes.pointer}
                />
                <Rating size="small" value={Number(place.rating)} readOnly />
              </Paper>
            )}
          </div>
        ))}
        {weatherData?.list?.map((data, i) => (
          <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
            <img
              src={`http://openweathermap.org/img/w/${data.weather[0].icon}.png`}
              alt=""
            />
          </div>
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
