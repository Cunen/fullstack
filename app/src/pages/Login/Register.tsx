import React from "react";
import styled from "styled-components";
import { useCreateUser } from "../../mutations/mutations";
import { useNavigate } from "react-router-dom";

export const Register: React.FC = () => {
  const { createUser } = useCreateUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return;
    }

    await createUser({ username, email, password, confirmPassword });
    navigate("/login");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input type="text" name="username" placeholder="Username" required />
      <label htmlFor="email">Email:</label>
      <input type="email" name="email" placeholder="Email" required />
      <label htmlFor="password">Password:</label>
      <input type="password" name="password" placeholder="Password" required />
      <label htmlFor="confirmPassword">Confirm Password:</label>
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        required
      />
      <button type="submit">Register</button>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
`;

export default Register;
