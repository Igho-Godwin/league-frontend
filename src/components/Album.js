import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import useFetch from "../hooks/useFetch";

const Album = () => {
  const { status, data } = useFetch(
    "https://jsonplaceholder.typicode.com/users/1/albums"
  );

  if (status === "error") {
    return <div>Error occurred</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data</div>;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          width: "100vw",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  overflow: "scroll",
                }}
              >
                {data &&
                  data.map((album) => {
                    return (
                      <div key={album.id}>
                        <Link to={"/photos?albumId=" + album.id}>
                          {album.title}
                        </Link>
                      </div>
                    );
                  })}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Album;
