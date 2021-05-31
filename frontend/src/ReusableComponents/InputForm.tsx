import { Input } from "@chakra-ui/react";
import React from "react";

const InputForm: React.FC<any> = ({ name, type, placeholder }) => {
  return (
    <React.Fragment>
      <div style={{ marginBottom: "1vh" }}>
        {type == "password" ? (
          <Input
            required
            minLength={6}
            name={name}
            type={type}
            placeholder={placeholder}
          ></Input>
        ) : (
          <Input
            required
            name={name}
            type={type}
            placeholder={placeholder}
          ></Input>
        )}
      </div>
    </React.Fragment>
  );
};

export default InputForm;
