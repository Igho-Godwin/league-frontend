import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

import parse from "html-react-parser";

import useFetch from "../hooks/useFetch";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ListSubheader from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { stripHtml } from "../utils/index";

const Photo = ({ setPageTitle }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchDesc, setSearchDesc] = useState("");
  const [url, setUrl] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("albumId") === null) {
      setUrl(`https://jsonplaceholder.typicode.com/albums/1/photos`);
    } else {
      setUrl(
        `https://jsonplaceholder.typicode.com/albums/${searchParams.get(
          "albumId"
        )}/photos`
      );
    }
  }, [searchParams]);

  const { status, data } = useFetch(url);

  useEffect(() => {
    setPageTitle("Photos");
  }, [data]);

  if (status === "error") {
    return <div>Error occurred</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data</div>;
  }

  const handleSearch = async (event) => {
    event.preventDefault();

    if(searchValue.trim().length === 0){
       alert("search value empty");
       return;
    }

    const intitalPhotos = [...data];

    const filteredPhotos = intitalPhotos.filter(function (photo) {
      photo.title = stripHtml(photo.title);
      let initialTitle = photo.title;

      const titles = initialTitle.split(/(\s+)/).filter(function (title) {
        return title.trim().length > 0;
      }); // convert a title to title array

      const matchingTitles = titles.filter(function (title) {
        return title.match(`${searchValue}`) !== null;
      }); // find matching words in the title

      let hasMatches = false;
      matchingTitles.forEach((title) => {
        const searchPosition = initialTitle.search(title);
        if (searchPosition > -1) {
          initialTitle = initialTitle.replaceAll(title, title.italics());
          hasMatches = true;
        }
      }); // replace matching words in titles with italics

      if (hasMatches) {
        photo.title = initialTitle;
        return photo;
      } // return filtered photos
    });

    setSearchResults(filteredPhotos);
    setSearchDesc(`Search Results For Photo title Like ${searchValue} `);
  };

  const handleChange = ({ currentTarget: input }) => {
    setSearchValue(input.value);
  };

  return (
    <Container sx={{ mt: "50px" }}>
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          component="form"
          onSubmit={handleSearch}
          noValidate
          sx={{ textAlign: "center", mt: 5, mb: 2 }}
        >
          <TextField
            inputProps={{ "data-testid": "search-textfield" }}
            id="outlined-basic"
            label="Search Photo Titles"
            variant="outlined"
            value={searchValue}
            onChange={handleChange}
          />{" "}
          <Button
            data-testid="search-button"
            type="submit"
            variant="outlined"
            style={{ minHeight: "55px" }}
          >
            Search
          </Button>
        </Box>
      </Container>
      <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Box sx={{ textAlign: "center", mt: 5, mb: 2 }}>
          <Link to={"/"}>Go Back To Albums</Link>
        </Box>
      </Container>
      <Container>
        <Box sx={{ textAlign: "center", mt: 5, mb: 2 }}>
          <Box component="h3">{searchDesc}</Box>
        </Box>
      </Container>
      <Container sx={{ display: "flex", justifyContent: "center" }}>
        <Box>
          <ImageList sx={{ width: "100%", height: "auto" }}>
            <ImageListItem key="Subheader" cols={3}>
              <ListSubheader component="div">Photos</ListSubheader>
            </ImageListItem>
            {searchDesc.length > 0
              ? searchResults.map((photo) => (
                  <Box key={photo.id}>
                    <ImageListItem>
                      <img
                        src={photo.thumbnailUrl}
                        srcSet={photo.thumbnailUrl}
                        alt={photo.title}
                        loading="lazy"
                      />
                    </ImageListItem>
                    <Box
                      id={"photo" + photo.id}
                      sx={{ mt: "20px", mb: "20px" }}
                    >
                      {parse(photo.title)}
                    </Box>
                  </Box>
                ))
              : data.map((photo) => (
                  <Box key={photo.id}>
                    <ImageListItem>
                      <img
                        src={photo.thumbnailUrl}
                        srcSet={photo.thumbnailUrl}
                        alt={photo.title}
                        loading="lazy"
                      />
                    </ImageListItem>
                    <Box
                      id={"photo" + photo.id}
                      sx={{ mt: "20px", mb: "20px" }}
                    >
                      {parse(photo.title)}
                    </Box>
                  </Box>
                ))}
          </ImageList>
        </Box>
      </Container>
    </Container>
  );
};

export default Photo;
