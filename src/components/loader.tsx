import React from "react";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const AnimatedTypography = styled(Typography)`
  & {
    position: relative;
    -webkit-box-reflect: below -20px linear-gradient(transparent, rgba(0, 0, 0, 0.2));
    font-size: 50px;
  }

  & span {
    color: white;
    background: -webkit-linear-gradient(white, #2981e6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: "Alfa Slab One", sans-serif;
    position: relative;
    display: inline-block;
    text-transform: uppercase;
    animation: waviy 1s infinite;
    animation-delay: calc(0.1s * var(--i));
  }

  @keyframes waviy {
    0%,
    40%,
    100% {
      transform: translateY(0);
    }
    20% {
      transform: translateY(-20px);
    }
  }

  @media (max-width: 700px) {
    font-size: 20px;
  }
`;

interface Styles extends React.CSSProperties {
    "--i": number;
}

function Loader() {
    const string = "loading...";
    return (
        <AnimatedTypography>
            {string.split("").map((char, idx) => {
                const styles: Styles = {
                    "--i": idx + 1,
                };
                return (
                    <span key={`${char}-${idx}`} style={styles}>
                        {char}
                    </span>
                );
            })}
        </AnimatedTypography>
    );
}

export default Loader;
