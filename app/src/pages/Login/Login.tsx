import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useAuth from "../../providers/Auth/auth";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const result = await login(username, password);

    if (result?.token && result?.userId) {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input type="text" name="username" placeholder="Username" required />
      <label htmlFor="password">Password:</label>
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;
export default Login;
