import React, { useState, useEffect, ChangeEvent } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { AppBar, Toolbar } from "@material-ui/core";

const Footer: React.FC = () => {
  return (
    <React.Fragment>
      <AppBar variant="outlined" position="static">
        <Toolbar variant="dense">
          <PhoneIcon />
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Footer;
