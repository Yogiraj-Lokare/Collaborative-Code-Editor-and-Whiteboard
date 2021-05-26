import React, { useState, useEffect, useRef } from "react";
import Board from "./Board";
import {
  Flex,
  Center,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
} from "@chakra-ui/react";

const Container: React.FC = () => {
  const [color, setColor] = useState("#ffffff");
  const [size, setSize] = useState(3);
  const [reset, setReset] = useState(false);
  const [left, setLeft] = useState<any>(750);
  const [top, setTop] = useState<any>(70);
  const board = useRef<HTMLElement | null>(null);

  const Reset = () => {
    setReset((reset: boolean) => {
      return !reset;
    });
  };

  useEffect(() => {
    let lef = document.getElementById("contain");
    board.current = lef;
    setLeft(board.current?.offsetLeft);
    setTop(board.current?.offsetTop);
  }, []);

  useEffect(() => {
    setLeft(board.current?.offsetLeft);
  }, [board.current?.clientWidth]);

  return (
    <React.Fragment>
      <div className="container" id="contain">
        <Flex
          justifyContent="space-around"
          padding="1"
          borderLeft="darkgrey 2px solid"
          borderBottom="darkgrey 1px solid"
        >
          <Center>
            <input
              style={{ height: "40px", borderRadius: "50%", cursor: "pointer" }}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            ></input>
          </Center>
          <Center>
            <Slider
              onChange={(val) => setSize(val)}
              width="28"
              value={size}
              aria-label="slider-ex-1"
            >
              <SliderTrack bg="cyan.100">
                <SliderFilledTrack bg="cyan.500" />
              </SliderTrack>
              <SliderThumb bg="facebook.600" />
            </Slider>
          </Center>
          <Center>
            <Button
              onClick={() => {
                Reset();
              }}
              bg="cyan.300"
              variant="solid"
            >
              Reset
            </Button>
          </Center>
        </Flex>
        <div className="board-container">
          <Board
            top={top}
            lef={left}
            color={color}
            reset={reset}
            size={Math.floor(size / 10) + 3}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Container;
