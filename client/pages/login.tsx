import { useFormState } from "react-use-form-state";
import React, { useEffect, useState } from "react";
import { Flex } from "rebass/styled-components";
import emailValidator from "email-validator";
import styled from "styled-components";
import Router from "next/router";
import axios from "axios";
import Header2 from "../components/Header2";


import { useStoreState, useStoreActions } from "../store";
import { APIv2, DISALLOW_REGISTRATION } from "../consts";
import { ColCenterV } from "../components/Layout";
import AppWrapper from "../components/AppWrapper";
import { TextInput } from "../components/Input";
import { fadeIn } from "../helpers/animations";
import { Button } from "../components/Button";
import Text, { H2 } from "../components/Text";
import ALink from "../components/ALink";
import Icon from "../components/Icon";

const LoginForm = styled(Flex).attrs({
  as: "form",
  flexDirection: "column"
})`
  animation: ${fadeIn} 0.8s ease-out;
`;

const Email = styled.span`
  font-weight: normal;
  color: #512da8;
  border-bottom: 1px dotted #999;
`;

const LoginPage = () => {
  const { isAuthenticated } = useStoreState((s) => s.auth);
  const login = useStoreActions((s) => s.auth.login);
  // console.log("Login:::::::::::::", login, isAuthenticated)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ login: false, signup: false });

  const redirectUrl = "https://a35d-136-232-130-202.ngrok-free.app/api/v2/auth/signin/kivo";

  const handleKivoAuth = async (e: any) => {
    try {
      // console.log("")
      e?.preventDefault();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error in handleKivoAuth:", error);
    }
  };

  return (

    <div>
      <Header2 />
      <LoginForm id="login-form"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          // height: '300px',
          width: '100%',
        }}
      >
        <div className="loginContainer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            // height: '300px',
            width: '100%',
          }}
        >
          <h1 style={{ fontSize: '4rem' }}>  Kivo.Link </h1>
          <Button
            flex="1 1 auto"
            // height={[44, 56]}
            height="56px"
            width="340px"
            mt={3}
            onClick={handleKivoAuth}
            style={{ fontSize: '18px' }}
          >
            <Icon
              name={loading.login ? "spinner" : "login"}
              stroke="white"
              mr={3}
            />
            Log in with Kivo.ai
          </Button>
          <Text color="red" mt={1} normal>
            {error}
          </Text>
        </div>
      </LoginForm>
    </div>

  );
};

export default LoginPage;
