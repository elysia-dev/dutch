declare module "*.png";

declare interface FormDataValue {
    uri: string;
    name: string;
    type: string;
}

declare interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;
    set(name: string, value: FormDataValue, fileName?: string): void;
}

declare module 'react-native-dotenv' {
    export const API_URL: string;
    export const DAPP_URL: string;
    export const BSC_RPC_ENDPOINT: string;
    export const ETH_NETWORK: string;
    export const EL_ADDRESS: string;
    export const INFURA_PROJECT_ID: string;
    export const SENTRY_DSN: string;
    export const GOOGLE_MAP_API_ANDROID: string;
    export const GOOGLE_MAP_API_IOS: string;
}
