import axios from "axios";

export const BASE_URL = process.env.BASE_URL;

export const ACCESS_TOKEN = "__Access_Token__";

export async function signInUser(email: string, password?: string) {
  try {
    const res = await axios.post(`${BASE_URL}/user/signin`, {
      email,
      password,
    });

    console.log(res);

    const accessToken = res.data.accessToken;
    // localStorage.setItem(ACCESS_TOKEN, accessToken);
    return res.data.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function signUpUser(
  email: string,
  provider: string,
  password?: string
) {
  try {
    const res = await axios.post(`${BASE_URL}/user/signup`, {
      email,
      provider,
      password,
    });
    const accessToken = res.data.accessToken;
    // localStorage.setItem(ACCESS_TOKEN, accessToken);
    return res.data.user;
  } catch (error) {
    throw error;
  }
}

export async function checkUserExistance(email: string) {
  try {
    const res = await axios.get(`${BASE_URL}/user?email=${email}`);

    if (res.data.existingUser) return true;
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
