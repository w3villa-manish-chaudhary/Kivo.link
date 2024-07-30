import { Flex } from "rebass/styled-components";
import React from "react";
import { Colors } from "../consts";
import Icon from "./Icon";

const PageLoading = () => (
  <Flex
    flex="1 1 auto"
    alignItems="center"
    justifyContent="center"
    height="100vh" // Full viewport height
  >
    <Icon name="spinner" size={64} stroke={Colors.Spinner} />
  </Flex>
);

export default PageLoading;