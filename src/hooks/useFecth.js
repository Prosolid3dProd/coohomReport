import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const useFetch = ({ url, method = "GET", body = {} }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(body);
  const [skip, setSkip] = useState(1);
  const [update, setUpdate] = useState(null);

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios({
          method,
          url,
          data: { ...params, skip },
          headers: {
            "Content-Type": "application/json",
            Authorization: Cookies.get("token") || null,
          },
        });

        if (!cancelRequest) {
          setData(response.data);
          setLoading(false);
          setUpdate(Math.random());
        }
      } catch (err) {
        if (!cancelRequest) {
          setError("An error occurred. Awkward..");
          setLoading(false);
        }
      }
    };

    if (url && !loading) {
      fetchData();
    }

    return () => {
      cancelRequest = true;
    };
  }, [url, method, params, skip]); // Solo vuelve a ejecutar el efecto si cambian estas dependencias

  const reload = () => {
    setUpdate(Math.random());
  };

  return {
    data,
    loading,
    error,
    reload,
    setParams,
    params,
    setSkip,
    skip,
    update, // ¿Necesitas mantener este estado?
  };
};

export default useFetch;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// const useFetch = ({ url, method = "GET", body = {} }) => {
//   const [data, setData] = useState(null);
//   const [data2, setData2] = useState(null);

//   const [loading, setLoading] = useState(null);
//   const [error, setError] = useState(null);
//   const [refresh, setRefresh] = useState(0);
//   const [params, setParams] = useState(body);
//   const [toexecute, setExecute] = useState(null);
//   const [skip, setSkip] = useState(1);
//   const [update, setUpdate] = useState(0);

//   const [open, setOpen] = useState(true);

//   const isValidHttpUrl = (string) => {
//     let url;
//     try {
//       url = new URL(string);
//     } catch (_) {
//       return false;
//     }

//     if (string.indexOf("undefined") > -1) {
//       return false;
//     }

//     return url.protocol === "http:" || url.protocol === "https:";
//   };

//   const reload = () => {
//     setRefresh(refresh + 1);
//   };

//   useEffect(() => {
//     if (isValidHttpUrl(url) && open && refresh > 0) {
//       setOpen(false);
//       setTimeout(() => setOpen(true), 3000);
//       setLoading("loading...");
//       setData(null);
//       setError(null);
//       setData2(null);
//       axios({
//         method,
//         url,
//         data: { ...params, skip },
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${Cookies.get("token") || null}`,
//         },
//       })
//         .then((res) => {
//           setLoading(false);
//           res.data && setData(res.data);
//           res.data && setData2(res.data);
//           updating();
//           if (res.data) {
//             if (toexecute !== null) {
//               toexecute.function01();
//             }
//           }
//         })
//         .catch((err) => {
//           setLoading(false);
//           setError("An error occurred. Awkward..");
//         });
//     }
//   }, [refresh]);

//   useEffect(() => reload(), [params]);
//   useEffect(() => reload(), [skip]);

//   const updating = () => {
//     let num = Math.floor(Math.random() * (99999999 - 10000000)) + 10000000;
//     setUpdate(num);
//     return num;
//   };

//   return {
//     data,
//     data2,
//     loading,
//     error,
//     reload,
//     setParams,
//     params,
//     update,
//     refresh,
//     setRefresh,
//     setExecute,
//     setSkip,
//     skip,
//   };
// };
// export default useFetch;
