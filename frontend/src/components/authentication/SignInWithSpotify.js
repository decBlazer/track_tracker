import React from 'react';
import styled from 'styled-components';

function SignInWithSpotify({small}) {
  const handleSignIn = () => {
        window.location.href = "https://localhost:8443/login/oauth2/code/spotify";;
    };


    return (
      <Button onClick={handleSignIn}>
        Sign In with Spotify
      </Button>
    );
  }
  
  const Button = styled.button`
  padding: 5px 10px;
  margin-top: 0;
  background-color: #1db954;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background-color: #1ed760;
  }
`;

export default SignInWithSpotify;
