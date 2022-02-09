import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";

import testSpecs from "./__fixtures__/testSpecs.json";
import photos from "./__fixtures__/photos.json";

import { stripHtml } from "../globals/index";

import { BrowserRouter } from "react-router-dom";

import Photo from "../components/Photo";

const API_URL = "https://jsonplaceholder.typicode.com/albums/1/photos";
const LOADING_LABEL = "Loading...";
const NO_DATA_LABEL = "No data";

const renderPhotoList = () =>
  render(
    <BrowserRouter>
      <Photo setPageTitle={jest.fn()} />
    </BrowserRouter>
  );

describe("# Photo", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders 'Loading...' while fetching data, and 'No data' on  photos obtained", async () => {
    const mAxiosResponse = { data: [] };
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText } = renderPhotoList();
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText(NO_DATA_LABEL)).toBeInTheDocument();
    });
  });

  it("fetches the whole list of Photos", async () => {
    const mAxiosResponse = photos;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText } = renderPhotoList();
    // to avoid RTL 'act' warning
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(API_URL);
  });

  describe("renders all photos correctly", () => {
    test.each(testSpecs)("specs: %O", async ({ photoTitles }) => {
      jest.spyOn(axios, "get").mockResolvedValueOnce(photos);
      const { getByText } = renderPhotoList();
      await waitFor(() => getByText(photoTitles[0]));
      photoTitles.forEach((label) =>
        expect(getByText(label)).toBeInTheDocument()
      );
    });
  });

  it("search functionality is working for photos", async () => {
    const mAxiosResponse = photos;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText, getByTestId } = renderPhotoList();

    // to avoid RTL 'act' warning
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });

    fireEvent.change(getByTestId("search-textfield"), {
      target: { value: "officia" },
    });
    fireEvent.click(getByTestId("search-button"));

    const getByTextContent = (text) => {
      // Passing function to `getByText`
      return screen.getByText((content, element) => {
        const hasText = (element) => element.textContent === text;
        const elementHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(
          (child) => !hasText(child)
        );
        return elementHasText && childrenDontHaveText;
      });
    };

    expect(
      getByTextContent("officia porro iure quia iusto qui ipsa ut modi")
    ).toBeInTheDocument();
    expect(
      getByTextContent(
        "officia delectus consequatur vero aut veniam explicabo molestias"
      )
    ).toBeInTheDocument();
  });

  it("check that search results come with appropriate italics", async () => {
    const mAxiosResponse = photos;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText, getByTestId, container } = renderPhotoList();

    // to avoid RTL 'act' warning
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });

    fireEvent.change(getByTestId("search-textfield"), {
      target: { value: "officia" },
    });
    fireEvent.click(getByTestId("search-button"));

    const italics = container.querySelectorAll("i");
    expect(italics.length).toBeGreaterThan(1);
  });

  it("photo search returns nothing for 'offic ia' ", async () => {
    const mAxiosResponse = photos;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText, getByTestId, container } = renderPhotoList();

    // to avoid RTL 'act' warning
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });

    fireEvent.change(getByTestId("search-textfield"), {
      target: { value: "offic ia" },
    });
    fireEvent.click(getByTestId("search-button"));

    const italics = container.querySelectorAll("i");
    expect(italics.length).toBe(0);
  });

  it("the entire search search string where search values are found is in italics", async () => {
    const mAxiosResponse = photos;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText, getByTestId, container } = renderPhotoList();

    // to avoid RTL 'act' warning
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });

    fireEvent.change(getByTestId("search-textfield"), {
      target: { value: "off" },
    });
    fireEvent.click(getByTestId("search-button"));

    const italics = container.querySelectorAll("i");

    expect(stripHtml(italics[0].innerHTML)).toBe("officia"); // since search result is only 2 but it appears twice;
  });

  it("multiple words in a search term can be identified and italiced", async () => {
    const mAxiosResponse = photos;
    jest.spyOn(axios, "get").mockResolvedValueOnce(mAxiosResponse);
    const { getByText, getByTestId, container } = renderPhotoList();

    // to avoid RTL 'act' warning
    await waitFor(() => {
      expect(getByText(LOADING_LABEL)).toBeInTheDocument();
    });

    fireEvent.change(getByTestId("search-textfield"), {
      target: { value: "quidem" },
    });
    fireEvent.click(getByTestId("search-button"));

    const italics = container.querySelectorAll("i");
    expect(italics.length).toBeGreaterThan(1);
  });
});
