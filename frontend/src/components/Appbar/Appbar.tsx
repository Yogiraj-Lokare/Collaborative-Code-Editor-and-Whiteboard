import React, { useState, useEffect, ChangeEvent } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { AppBar, Toolbar } from "@material-ui/core";

const AppHeaderBar: React.FC = () => {
  return (
    <React.Fragment>
      <Flex>
        <AppBar variant="outlined" position="static">
          <Toolbar variant="dense">Code</Toolbar>
        </AppBar>
      </Flex>
    </React.Fragment>
  );
};

export default AppHeaderBar;
