import axios from 'axios';

const apiInstance = axios.create({
  baseURL: "http://localhost:8000",
});

export const getApi = async (endpoint: string) => {
  try {
    const res = await apiInstance.get(endpoint);

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const postApi = async (endpoint: string, data: any) => {
  try {
    const res = await apiInstance.post(endpoint, data);

    return res.data;
  } catch (err) {
    throw err;
  }
};

export default apiInstance;

export const sendMessage = async (prompt:string) => {
    try {
        const res = await axios.post(
            `http://localhost:8000/test?prompt=${prompt}`            
        )
        return res.data.choices[0].message.content
    } catch (err) {
        throw err;
    }
};