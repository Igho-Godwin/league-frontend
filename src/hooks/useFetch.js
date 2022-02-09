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
        if (res.data.length > 0) {
          setData(res.data);
          setStatus("ready");
        } else if (!res.data.length) {
          setData([]);
          setStatus("empty");
        }
      })
      .catch((err) => console.log(err));
  }, [url]);

  return { status, data };
};

export default useFetch;
