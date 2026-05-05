import type { Request, Response, NextFunction } from "express";

export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).json([
    {
      id: 1,
      title: "Post 1",
      content: "This is the first post",
    },
  ]);
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  return res.status(201).json({
    id: Math.floor(Math.random() * 1000),
    title,
    content,
  });
};
