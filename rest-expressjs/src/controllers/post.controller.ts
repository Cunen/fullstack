import type { Request, Response, NextFunction } from "express";
import { Post } from "../db/mongoose.controller.js";

// GET /api/posts
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// GET /api/posts/:id
export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// POST /api/posts
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content, user } = req.body;
  try {
    const newPost = new Post({ title, content, user });
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create post" });
  }
};

// PATCH /api/posts/:id
export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { title, content, userId } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, user: userId },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(updatedPost);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update post" });
  }
};

// DELETE /api/posts/:id
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
