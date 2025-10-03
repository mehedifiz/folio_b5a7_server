import { Request, Response } from "express";
import { generateUniqueSlug } from "../../config/slug";
import { Prisma } from "../../config/db";


export const createBlog = async (req: Request, res: Response) => {
  console.log("hti")
  try {
    const { title, summary, content, image, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    let slug = await generateUniqueSlug(title);

    let slugExists = await Prisma.blog.findUnique({ where: { slug } });
    let counter = 1;
    while (slugExists) {
       slug = `${slug}-${counter}`;
      slugExists = await Prisma.blog.findUnique({ where: { slug } });
      counter++;
    }

    const Blog = await Prisma.blog.create({
      data: {
        title,
        slug,
        summary,
        content,
        image,
        published: published ?? false,
      },
    });

    res.status(201).json(Blog);
  } catch (err: any) {
    console.error("Error creating Blog:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const getAll = async (req : Request, res: Response) => {
     try {
    const { page = "1", limit = "10", published } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    // Build filter
    const filter: any = {};
    if (published !== undefined) {
      filter.published = published === "true";
    }

    const blogs = await Prisma.blog.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const total = await Prisma.blog.count({ where: filter });

    res.json({
      data: blogs,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (err: any) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
}


export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check if blog exists
    const blog = await Prisma.blog.findUnique({ where: { id: Number(id) } });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete the blog
    await Prisma.blog.delete({ where: { id: Number(id) } });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const getBlog = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  try {
    const blog = await Prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (err: any) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, summary, content, image, published } = req.body;

  try {
    // Check if blog exists
    const blog = await Prisma.blog.findUnique({ where: { id: Number(id) } });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let slug = blog.slug;

    if (title && title !== blog.title) {
      slug = await generateUniqueSlug(title);

      let slugExists = await Prisma.blog.findUnique({ where: { slug } });
      let counter = 1;
      while (slugExists) {
        slug = `${slug}-${counter}`;
        slugExists = await Prisma.blog.findUnique({ where: { slug } });
        counter++;
      }
    }

    const updatedBlog = await Prisma.blog.update({
      where: { id: Number(id) },
      data: {
        title: title ?? blog.title,
        slug,
        summary: summary ?? blog.summary,
        content: content ?? blog.content,
        image: image ?? blog.image,
        published: published ?? blog.published,
      },
    });

    res.status(200).json(updatedBlog);
  } catch (err: any) {
    console.error("Error updating blog:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
