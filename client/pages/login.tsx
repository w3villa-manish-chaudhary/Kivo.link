// import React, { useEffect, useState } from "react";
// import { Flex } from "rebass/styled-components";
// import styled from "styled-components";
// import Header2 from "../components/Header2";


// import { useStoreState, useStoreActions } from "../store";
// import { fadeIn } from "../helpers/animations";
// import { Button } from "../components/Button";
// import Text, { H2 } from "../components/Text";
// import Icon from "../components/Icon";

// const LoginForm = styled(Flex).attrs({
//   as: "form",
//   flexDirection: "column"
// })`
//   animation: ${fadeIn} 0.8s ease-out;
// `;

// const Email = styled.span`
//   font-weight: normal;
//   color: #512da8;
//   border-bottom: 1px dotted #999;
// `;

// const LoginPage = () => {
//   const { isAuthenticated } = useStoreState((s) => s.auth);
//   const login = useStoreActions((s) => s.auth.login);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState({ login: false, signup: false });

//   const redirectUrl = "https://a35d-136-232-130-202.ngrok-free.app/api/v2/auth/signin/kivo";

//   const handleKivoAuth = async (e: any) => {
//     try {
//       e?.preventDefault();
//       window.location.href = redirectUrl;
//     } catch (error) {
//       console.error("Error in handleKivoAuth:", error);
//     }
//   };

//   return (

//     <div>
//       <Header2 />
//       <LoginForm id="login-form"
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           textAlign: 'center',
//           width: '100%',
//         }}
//       >
//         <div className="loginContainer"
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             textAlign: 'center',
//             width: '100%',
//           }}
//         >
//           <h1 style={{ fontSize: '4rem' }}>  Kivo.Link </h1>
//           <Button
//             flex="1 1 auto"
//             height="56px"
//             width="340px"
//             mt={3}
//             onClick={handleKivoAuth}
//             style={{ fontSize: '18px' }}
//           >
//             <Icon
//               name={loading.login ? "spinner" : "login"}
//               stroke="white"
//               mr={3}
//             />
//             Log in with Kivo.ai
//           </Button>
//           <Text color="red" mt={1} normal>
//             {error}
//           </Text>
//         </div>
//       </LoginForm>
//     </div>

//   );
// };

// export default LoginPage;



import React, { useState } from "react";
import styled from "styled-components";
import Header2 from "../components/Header2";
import { Button } from "../components/Button";
import Text from "../components/Text";
import Icon from "../components/Icon";

const LoginPageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
`;

const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
`;

const LoginForm = styled.form`
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 80px; /* Adjust this value based on the height of your header */
`;

const HeaderText = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const LoginPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ login: false });

  const redirectUrl = "https://a35d-136-232-130-202.ngrok-free.app/api/v2/auth/signin/kivo";

  const handleKivoAuth = async (e) => {
    try {
      e.preventDefault();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error in handleKivoAuth:", error);
    }
  };

  return (
    <LoginPageContainer>
      <Overlay />
      <HeaderWrapper>
        <Header2 />
      </HeaderWrapper>
      <LoginForm>
        <HeaderText>Kivo.Link</HeaderText>
        <Button
          height="56px"
          width="340px"
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
        <Text color="red" mt={1}>
          {error}
        </Text>
      </LoginForm>
    </LoginPageContainer>
  );
};

export default LoginPage;

