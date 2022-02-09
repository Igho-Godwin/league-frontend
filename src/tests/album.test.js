import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";

import testSpecs from "./__fixtures__/testSpecs.json";
import albums from "./__fixtures__/albums.json";

import { BrowserRouter } from "react-router-dom";

import axios from "axios";

import Album from "../components/Album";

const API_URL = "https://jsonplaceholder.typicode.com/users/1/albums";
const LOADING_LABEL = "Loading...";
const NO_DATA_LABEL = "No data";

const renderAlbumList = () =>
  render(
    <BrowserRouter>
      <Album />
    </BrowserRouter>
  );

describe("# Album", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders 'Loading...' while fetching data, and 'No data' on no AlbumList obtained", async () => {
    const mAxiosResponse = { data: [] };
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText } = renderAlbumList();
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText(NO_DATA_LABEL)).toBeInTheDocument();
    });
  });

  it("fetches the whole list of Albums", async () => {
    const mAxiosResponse = albums;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText } = renderAlbumList();
    // to avoid RTL 'act' warning
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(API_URL);
  });

  describe("renders all Albums correctly", () => {
    test.each(testSpecs)("specs: %O", async ({ albumTitles }) => {
      jest.spyOn(axios, "get").mockResolvedValueOnce(albums);
      const { getByText } = renderAlbumList();
      await waitFor(() => getByText(albumTitles[0]));
      albumTitles.forEach((label) =>
        expect(getByText(label)).toBeInTheDocument()
      );
    });
  });
});
