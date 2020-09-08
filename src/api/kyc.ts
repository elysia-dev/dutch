import axios, { AxiosResponse } from "axios";
import { authenticatedEspressoClient } from "./axiosInstances";

type KycResponse = {};

type PhotoResponse = {
  filehash: string;
};

export default class Api {
  static photoId = async (
    photo: string,
    idType: string
  ): Promise<AxiosResponse<PhotoResponse>> => {
    return (await authenticatedEspressoClient()).post("/kyc/photoid", {
      photoidImage: photo, //: base64 string,
      id_type: idType,
    });
  };

  static selfie = async (
    photo: string
  ): Promise<AxiosResponse<PhotoResponse>> => {
    return (await authenticatedEspressoClient()).post("/kyc/photoid", {
      selfieImage: photo, //: base64 string,
    });
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
    return (await authenticatedEspressoClient()).post("/kyc/selfie", {
      first_name: first_name,
      last_name: last_name,
      nationality: nationality,
      date_of_birth: date_of_birth,
      gender: gender,
      id_type: id_type,
      photoid_res: photoid_res,
      selfie_res: selfie_res,
    });
  };
}
