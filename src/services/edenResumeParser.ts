// import axios from "axios";

// export const parseResumeWithEdenAI = async (file: File) => {
//   try {
//     const formData = new FormData();
//     formData.append("providers", "affinda");
//     formData.append("file", file);

//     const response = await axios.post(
//       "https://api.edenai.run/v2/ocr/resume_parser",
//       formData,
//       {
//         headers: {
//           Authorization:  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
//         },
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     console.error("Resume parsing error:", error?.response?.data || error);
//     throw error;
//   }
// };


import axios from "axios";

export const parseResumeWithEdenAI = async (file: File) => {
  const formData = new FormData();
  formData.append("providers", "affinda");
  formData.append("file", file);

  const options = {
    method: "POST",
    url: "https://api.edenai.run/v2/ocr/resume_parser",
    headers: {
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
      // Important: DO NOT set Content-Type here; browser sets it for FormData
    },
    data: formData,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error("❌ Resume parsing error:", error);
    throw error;
  }
};
