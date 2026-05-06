export type Post = {
  _id: string;
  title: string;
  content: string;
  user: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
