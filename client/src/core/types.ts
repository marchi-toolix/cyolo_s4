
export interface User {
  id?: number;
  name: string;
}

export type LoginInputs = {
  name: string;
};

export type FileCardProps = {
  name: string;
  size: string;
  id: string;
}