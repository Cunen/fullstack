import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

import { Post } from "../db/mongoose.controller.js";
import { check, validationResult } from "express-validator";
import { runValidation } from "../utils/utils.js";
import { imagesDir } from "../utils/path.js";

// GET /api/posts
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  try {
    const total = await Post.countDocuments();
    const pages = Math.ceil(total / limit);
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit);
    return res.status(200).json({
      page,
      pages,
      limit,
      total,
      data: posts,
    });
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
    return res.status(500).json({ message: "Failed to fetch post" });
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
    const errors = runValidation(req, res);
    if (errors) return res.status(400).json(errors);

    const newPost = new Post({ title, content, user });
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create post" });
  }
};

// POST /api/posts/form
export const createPostFromForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, content, user } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  try {
    const errors = runValidation(req, res);
    if (errors) return res.status(400).json(errors);

    const newPost = new Post({ title, content, user, image: file.filename });
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create post" });
  }
};

export const validatePostData = [
  check("title").isLength({ min: 5 }).withMessage("Title is required"),
  check("content").isLength({ min: 5 }).withMessage("Content is required"),
  check("user").notEmpty().withMessage("User is required"),
];

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
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.image) {
      await fs.unlink(path.join(imagesDir, post.image), (err) => {
        if (err) throw new Error("Failed to delete image");
        return;
      });
    }

    await post.deleteOne();

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete post" });
  }
};
