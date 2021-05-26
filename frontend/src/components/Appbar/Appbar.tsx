import React, { useState, useEffect, ChangeEvent } from "react";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { AppBar, Dialog, Toolbar } from "@material-ui/core";
import WhiteBoard from "../whiteBoard/WhiteBoard";

const AppHeaderBar: React.FC = () => {
  return (
    <React.Fragment>
      <Flex>
        <AppBar variant="outlined" position="static">
          <Toolbar variant="dense">
            <WhiteBoardController />
          </Toolbar>
        </AppBar>
      </Flex>
    </React.Fragment>
  );
};

export default AppHeaderBar;

const WhiteBoardController = () => {
  const [active, setActive] = useState(false);
  const handleClose = () => {
    setActive(false);
  };

  return (
    <React.Fragment>
      <Button
        _hover={{ backgroundColor: "lightblue" }}
        variant="outline"
        borderWidth="medium"
        leftIcon={<EditIcon fontSize="larger" />}
        onClick={() => setActive(!active)}
      >
        WhiteBoard
      </Button>
      <Dialog fullScreen open={active} onClose={handleClose}>
        <AppBar variant="outlined" position="static">
          <Toolbar variant="dense">
            <IconButton
              isRound={true}
              aria-label="close"
              padding="2"
              _hover={{ backgroundColor: "lightblue" }}
              variant="outline"
              icon={<CloseIcon fontSize="x-large" />}
              onClick={handleClose}
            ></IconButton>
          </Toolbar>
        </AppBar>
        <WhiteBoard />
      </Dialog>
    </React.Fragment>
  );
};
