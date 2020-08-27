import axios, { AxiosResponse } from "axios";
axios.defaults.baseURL = "http://localhost:3000";
import AsyncStorage from "@react-native-community/async-storage";

type KycResponse = {};

type PhotoResponse = {
  filehash: string;
};

type SubmissionResponse = {};

export default class Api {
  static getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("@token");
      if (token !== null) {
        // value previously stored
        return token;
      }
    } catch (e) {
      // error reading value
      console.error(e);
      return "";
    }
  };

  static getEmail = async () => {
    try {
      const email = await AsyncStorage.getItem("@email");
      if (email !== null) {
        // value previously stored
        return email;
      }
    } catch (e) {
      // error reading value
      console.error(e);
      return "emailfailed";
    } finally {
      return "emailfailed";
    }
  };

  static photoId = async (
    photo: string,
    idType: string
  ): Promise<AxiosResponse<PhotoResponse>> => {
    return axios.post(
      "/kyc/photoid",
      {
        photoidImage: photo, //: base64 string,
        id_type: idType,
      },
      {
        headers: {
          Authorization: Api.getToken(),
        },
      }
    );
  };

  static selfie = async (
    photo: string
  ): Promise<AxiosResponse<PhotoResponse>> => {
    return axios.post(
      "/kyc/photoid",
      {
        selfieImage: photo, //: base64 string,
      },
      {
        headers: {
          Authorization: Api.getToken(),
        },
      }
    );
  };

  static submission = async (
    first_name: string,
    last_name: string,
    nationality: string,
    date_of_birth: string,
    gender: string,
    id_type: string,
    photoid_res: string,
    selfie_res: string
  ): Promise<AxiosResponse<KycResponse>> => {
    return axios.post(
      "/kyc/selfie",
      {
        first_name: first_name,
        last_name: last_name,
        nationality: nationality,
        date_of_birth: date_of_birth,
        gender: gender,
        id_type: id_type,
        photoid_res: photoid_res,
        selfie_res: selfie_res,
      },
      {
        headers: {
          Authorization: Api.getToken(),
        },
      }
    );
  };
}
