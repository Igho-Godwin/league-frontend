import { useEffect, useState } from "react";

import axios from "axios";

const useFetch = (url) => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!url) return;
    setStatus("loading");
    axios
      .get(url)
      .then((res) => {
        setStatus("ready");
        if (res.data.length > 0) {
          setData(res.data);
        } else if (!res.data.length) {
          setData([]);
        }
      })
      .catch((err) => {
        setStatus("error");
      });
  }, [url]);

  return { status, data };
};

export default useFetch;
