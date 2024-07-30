"use client";
import { Flex } from "rebass/styled-components";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import decode from "jwt-decode";
import cookie from "js-cookie";
import AppWrapper from "../components/AppWrapper";
import { Button } from "../components/Button";
import { useStoreActions, useStoreDispatch, useStoreState } from "../store";
import { Col } from "../components/Layout";
import { TokenPayload } from "../types";
import Icon from "../components/Icon";
import { NextPage } from "next";
import { Colors } from "../consts";
import ALink from "../components/ALink";
import { useRouter } from "next/router";
import axios from 'axios';

import PageLoading from "../components/PageLoading"
interface Props {
  token?: string;
}

const MessageWrapper = styled(Flex).attrs({
  justifyContent: "center",
  alignItems: "center",
  my: 32
})``;

const Message = styled.p`
  font-size: 24px;
  font-weight: 300;

  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;



const Verify: NextPage<Props> = ({ token }) => {
  const addAuth = useStoreActions((actions) => actions.auth.add); // Make sure actions.auth.add exists

  const auth = useStoreState((state) => state.auth); // Ensure state.auth exists
  // console.log('Auth', auth);

  const [code, setCode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');

    if (codeParam) {
      // console.log("Code from URL:", codeParam);
      setCode(codeParam);
    }

    if (token) {
      cookie.set("token", token, { expires: 7 });
      try {
        const payload: TokenPayload = decode(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(payload));
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (code) {
      axios.get(`https://a35d-136-232-130-202.ngrok-free.app/api/v2/auth/kivo/callback`, {
        params: { code }
      })
        .then(response => {
          // console.log("API Response:", response.data);
          localStorage.setItem('apiResponse', JSON.stringify(response.data));

          const accessToken = response.data.data.token_for_kivo;
          // console.log("\n :::::::::::::::::::::::Access token of callback api::::::::::::", accessToken);
          if (accessToken) {
            try {
              cookie.set("token", accessToken, { expires: 7 });

              const payload1: TokenPayload = decode(accessToken);
              // console.log("\n :::::::::::::::::::::::decoded Access token of callback api::::::::::::", payload1);
              addAuth(payload1); // Ensure payload1 matches your TokenPayload type

              const payload: TokenPayload = {
                email: response.data.data.email
              };

              localStorage.setItem('user', JSON.stringify(payload));
            } catch (error) {
              console.error("Error decoding access token:", error);
            }

            router.push('/');
          } else {
            console.error("No access token in response.");
          }
        })
        .catch(error => {
          console.error("API Error:", error);
        });
    }
  }, [code, router, addAuth]);

  return <PageLoading />;
  

};

Verify.getInitialProps = async ({ req }) => {
  return { token: req && (req as any).token };
};

export default Verify;
