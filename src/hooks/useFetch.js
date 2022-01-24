import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import axios from "axios";

const useFetch = (url) => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);

  const token = useSelector((state) => state.tokenReducers.token);

  useEffect(() => {
    if (!url) return;
    const fetchData = async () => {
      setStatus("loading");
      try {
        const response = await axios(url, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            authorization: token.payload,
          },
        });

        const data = response.data.data;

        if (data.count > 0) {
          setData(data);
          setStatus("ready");
        } else if (!data.count) {
          setData([]);
          setStatus("empty");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    fetchData();
  }, [url]);

  return { status, data };
};

export default useFetch;
