// import axios from "axios";
// const ApiAxios = axios.create({
//     // baseURL: "http://192.168.29.82:8000/",
//       baseURL: "https://api.maitriai.com/smart_hr",

//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       "ngrok-skip-browser-warning": true,
//     },

//   });    

  
//   export default ApiAxios;
//   // baseURL: "https://api.maiai.com/maitri_assistant",
  import axios from "axios";
  const ApiAxios = axios.create({
        // baseURL: "http://192.168.29.83:8000/",

    baseURL: "https://api.maitriai.com/smart_hr",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": true,
      },
  
    });    
  
    
    export default ApiAxios;
    // baseURL: "https://api.maitriai.com/maitri_assistant",
