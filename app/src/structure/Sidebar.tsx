import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "webcomponents";
import AuthView from "../providers/Auth/AuthView";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const goTo = (path: string) => () => {
    navigate(path);
  };

  return (
    <Wrapper>
      <Bar>
        <AuthView>
          <Button click={goTo("/")} text="Posts" />
          <Button click={goTo("/add")} text="Create" />
          <Button click={goTo("/logout")} text="Logout" />
        </AuthView>
        <AuthView showForUnauthenticated>
          <Button click={goTo("/login")} text="Login" />
          <Button click={goTo("/register")} text="Register" />
        </AuthView>
      </Bar>
      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
};

const Bar = styled.div`
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
  flex: 0 1 auto;
  gap: 16px;
  padding: 16px;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1;
`;

export default Sidebar;
