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
