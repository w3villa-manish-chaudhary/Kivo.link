// import { Flex } from "rebass/styled-components";
// import getConfig from "next/config";
// import React, { FC, useEffect, useState } from "react";
// import Router from "next/router";
// import useMedia from "use-media";
// import Image from "next/image";

// import { DISALLOW_REGISTRATION } from "../consts";
// import { useStoreState } from "../store";
// import styled from "styled-components";
// import { RowCenterV } from "./Layout";
// import { Button } from "./Button";
// import ALink from "./ALink";

// const { publicRuntimeConfig } = getConfig();

// const Li = styled(Flex).attrs({ ml: [12, 24, 32] })`
//   a {
//     color: inherit;

//     :hover {
//       color: #2196f3;
//     }
//   }
// `;

// const LogoImage = styled.div`
//   & > a {
//     position: relative;
//     display: flex;
//     align-items: center;
//     margin: 0 8px 0 0;
//     font-size: 22px;
//     font-weight: bold;
//     text-decoration: none;
//     color: inherit;
//     transition: border-color 0.2s ease-out;
//     padding: 0;
//   }

//   @media only screen and (max-width: 488px) {
//     a {
//       font-size: 18px;
//     }
//   }

//   span {
//     margin-right: 10px !important;
//   }
// `;

// const Header: FC = () => {
//   const { isAuthenticated } = useStoreState((s) => s.auth);
//   const isMobile = useMedia({ maxWidth: 640 });

//   // State to store user email
//   const [userEmail, setUserEmail] = useState<string | null>(null);

//   // Fetch user email from localStorage on component mount
//   useEffect(() => {
//     const storedData = localStorage.getItem('user');
//     if (storedData) {
//       const userData = JSON.parse(storedData);
//       setUserEmail(userData.email);
//     }
//   }, [userEmail]);

//   const handleEmailClick = () => {
//     if (userEmail) {
//       Router.push('/settings');
//     }
//   };

  

//   const logout = isAuthenticated && (
//     <Li>
//       <ALink href="/logout" title="logout" fontSize={[14, 16]} isNextLink onClick={() => { localStorage.clear(); }}>
//         Log out
//       </ALink>
//     </Li>
//   );

//   return (
//     <Flex
//       width={1232}
//       maxWidth="100%"
//       p={[16, "0 32px"]}
//       mb={[32, 0]}
//       height={["auto", "auto", 102]}
//       justifyContent="space-between"
//       alignItems={["flex-start", "center"]}
//     >
//       <Flex
//         flexDirection={["column", "row"]}
//         alignItems={["flex-start", "stretch"]}
//       >
//         <LogoImage>
//           <ALink
//             href="/"
//             title="Homepage"
//             onClick={(e) => {
//               e.preventDefault();
//               if (window.location.pathname !== "/") Router.push("/");
//             }}
//             forButton
//             isNextLink
//           >
//             <Image
//               src="/images/logo.svg"
//               alt="Kivo.Link logo"
//               width={18}
//               height={24}
//             />
//             {publicRuntimeConfig.SITE_NAME}
//           </ALink>
//         </LogoImage>

//         {!isMobile && (
//           <Flex
//             style={{ listStyle: "none" }}
//             display={["none", "flex"]}
//             alignItems="flex-end"
//             as="ul"
//             m={0}
//             px={0}
//             pt={0}
//             pb="2px"
//           >
//             <Li>
//               <ALink
//                 href="//github.com/thedevs-network/Kivo.Link"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 title="GitHub"
//                 fontSize={[14, 16]}
//               >
//                 GitHub
//               </ALink>
//             </Li>
//             <Li>
//               <ALink
//                 href="/report"
//                 title="Report abuse"
//                 fontSize={[14, 16]}
//                 isNextLink
//               >
//                 Report
//               </ALink>
//             </Li>
//           </Flex>
//         )}
//       </Flex>
//       <RowCenterV
//         m={0}
//         p={0}
//         justifyContent="flex-end"
//         as="ul"
//         style={{ listStyle: "none" }}
//       >
//         {isMobile && (
//           <Li>
//             <Flex>
//               <ALink
//                 href="/report"
//                 title="Report"
//                 fontSize={[14, 16]}
//                 isNextLink
//               >
//                 Report
//               </ALink>
//             </Flex>
//           </Li>
//         )}
//         {logout}
//         {/* Removed the settings button */}
//         {userEmail && (
//           <Li>
//             <Button height={[32, 40]} onClick={handleEmailClick}>
//               {userEmail}
//             </Button>
//           </Li>
//         )}
//       </RowCenterV>
//     </Flex>
//   );
// };

// export default Header;


import { Flex } from "rebass/styled-components";
import getConfig from "next/config";
import React, { FC, useEffect, useState } from "react";
import Router from "next/router";
import useMedia from "use-media";
import Image from "next/image";
import { DISALLOW_REGISTRATION } from "../consts";
import { useStoreState } from "../store";
import styled from "styled-components";
import { RowCenterV } from "./Layout";
import { Button } from "./Button";
import ALink from "./ALink";
const { publicRuntimeConfig } = getConfig();
const Li = styled(Flex).attrs({ ml: [12, 24, 32] })`
  a {
    color: inherit;
    :hover {
      color: #2196F3;
    }
  }
`;
const LogoImage = styled.div`
  & > a {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0 8px 0 0;
    font-size: 22px;
    font-weight: bold;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s ease-out;
    padding: 0;
  }
  @media only screen and (max-width: 488px) {
    a {
      font-size: 18px;
    }
  }
  span {
    margin-right: 10px !important;
  }
`;
const UserIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FFFFFF;
  border: 1px solid #ccc;
  margin-right: 8px; /* Space between the icon and email text */
  svg {
    width: 16px;
    height: 16px;
    color: #2196F3;
  }
`;
const ProfileButton = styled(Button)`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #2196F3;
  color: white;
  border: 1px solid #ccc;
  cursor: pointer;
`;
const Header: FC = () => {
  const { isAuthenticated } = useStoreState((s) => s.auth);
  const isMobile = useMedia({ maxWidth: 640 });
  // State to store user email
  const [userEmail, setUserEmail] = useState<string | null>(null);
  // Fetch user email from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('user');
    if (storedData) {
      const userData = JSON.parse(storedData);
      setUserEmail(userData.email);
    }
  }, [userEmail]);
  const handleEmailClick = () => {
    if (userEmail) {
      Router.push('/settings');
    }
  };
  const logout = isAuthenticated && (
    <Li>
      <ALink href="/logout" title="logout" fontSize={[14, 16]} isNextLink onClick={() => { localStorage.clear(); }}>
        Log out
      </ALink>
    </Li>
  );
  return (
    <Flex
      width={1232}
      maxWidth="100%"
      p={[16, "0 32px"]}
      mb={[32, 0]}
      height={["auto", "auto", 102]}
      justifyContent="space-between"
      alignItems={["flex-start", "center"]}
    >
      <Flex
        flexDirection={["column", "row"]}
        alignItems={["flex-start", "stretch"]}
      >
        <LogoImage>
          <ALink
            href="/"
            title="Homepage"
            onClick={(e) => {
              e.preventDefault();
              if (window.location.pathname !== "/") Router.push("/");
            }}
            forButton
            isNextLink
          >
            <Image
              src="/images/logo.svg"
              alt="Kivo.Link logo"
              width={18}
              height={24}
            />
            {publicRuntimeConfig.SITE_NAME}
          </ALink>
        </LogoImage>
        {!isMobile && (
          <Flex
            style={{ listStyle: "none" }}
            display={["none", "flex"]}
            alignItems="flex-end"
            as="ul"
            m={0}
            px={0}
            pt={0}
            pb="2px"
          >
            <Li>
              <ALink
                href="//github.com/thedevs-network/Kivo.Link"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                fontSize={[14, 16]}
              >
                GitHub
              </ALink>
            </Li>
            <Li>
              <ALink
                href="/report"
                title="Report abuse"
                fontSize={[14, 16]}
                isNextLink
              >
                Report
              </ALink>
            </Li>
          </Flex>
        )}
      </Flex>
      <RowCenterV
        m={0}
        p={0}
        justifyContent="flex-end"
        as="ul"
        style={{ listStyle: "none" }}
      >
        {isMobile && (
          <Li>
            <Flex>
              <ALink
                href="/report"
                title="Report"
                fontSize={[14, 16]}
                isNextLink
              >
                Report
              </ALink>
            </Flex>
          </Li>
        )}
        {logout}
        {/* Removed the settings button */}
        {userEmail && (
          <Li>
            <Button height={[32, 40]} onClick={handleEmailClick}>
            <UserIcon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
              </UserIcon>
              {userEmail}
            </Button>
          </Li>
        )}
      </RowCenterV>
    </Flex>
  );
};
export default Header;
