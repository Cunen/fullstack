import React from "react";
import styled from "styled-components";
import { useLoginUser } from "../../mutations/mutations";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useLoginUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const result = await loginUser({ username, password });

    if (result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      const now = new Date();
      now.setTime(now.getTime() + 3600 * 1000); // 1 hour
      localStorage.setItem("tokenExpiry", now.toISOString());
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
