import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const userString = localStorage.getItem(
        process.env.REACT_APP_LOCALHOST_KEY
      );
      if (userString) {
        const user = JSON.parse(userString);
        setUserName(user.username);
      }
    };

    fetchData();
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Xin Chào, <span>{userName}!</span>
      </h1>
      <h3>Hãy bắt đầu cuộc trò chuyện nào !</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
