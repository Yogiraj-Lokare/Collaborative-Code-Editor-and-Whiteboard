export interface Mouse {
  x: number;
  y: number;
}

export interface Operation {
  color: string;
  size: number;
  from: {
    x: number;
    y: number;
  };
  to: {
    x: number;
    y: number;
  };
}

export type Props = {
  lef: number;
  color: string;
  reset: boolean;
  size: number;
  top: number;
  room: string;
};
export interface Document {
  str: string;
  revision: number;
  clients: any;
}
export interface Update {
  document: string;
  language: number;
}
