import axios from "axios";
import { globalData } from "../main";

interface Response {
  message: string;
}

async function sendPrompt(message: string): Promise<Response> {
  const options = {
    method: "POST",
    url: `https://api-hackaton-2024.onrender.com/level/${globalData.modelLevel}`,
    data: {
      prompt: message,
    },

    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("Sending request with options:", options);
  try {
    const response = await axios.request<Response>(options);
    console.log(response.data);
    return response.data; // Return the response from the server
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error for handling it in the calling function
  }
}

export default sendPrompt;
