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
  size: number;
  top: number;
};
