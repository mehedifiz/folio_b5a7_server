import { Request, Response } from "express";
import { generateUniqueSlug } from "../../config/slug";
import { Prisma } from "../../config/db";

// Create Project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, thumbnail, liveUrl, repoUrl, features } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let slug = await generateUniqueSlug(title);

    let slugExists = await Prisma.project.findUnique({ where: { slug } });
    let counter = 1;
    while (slugExists) {
      slug = `${slug}-${counter}`;
      slugExists = await Prisma.project.findUnique({ where: { slug } });
      counter++;
    }

    const Project = await Prisma.project.create({
      data: {
        title,
        slug,
        description,
        thumbnail,
        liveUrl,
        repoUrl,
        features: features ?? [],
      },
    });

    res.status(201).json(Project);
  } catch (err: any) {
    console.error("Error creating Project:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10" } = req.query;
    console.log("req.query", req.query);
    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    const projects = await Prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const total = await Prisma.project.count();

    res.json({
      data: projects,
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (err: any) {
    console.error("Error fetching Projects:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get Single Project by Slug
export const getProject = async (req: Request, res: Response) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  try {
    const project = await Prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err: any) {
    console.error("Error fetching Project:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const project = await Prisma.project.findUnique({ where: { id: Number(id) } });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Prisma.project.delete({ where: { id: Number(id) } });

    return res.status(200).json({ ok 
        : true ,
         message: "Project deleted successfully" });
  } catch (err: any) {
    console.error("Error deleting Project:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update Project
export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Updating project with id:", id);
  const { title, description, thumbnail, liveUrl, repoUrl, features } = req.body;

  try {
    const project = await Prisma.project.findUnique({ where: { id: Number(id) } });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let slug = project.slug;
    if (title && title !== project.title) {
      slug = await generateUniqueSlug(title);

      let slugExists = await Prisma.project.findUnique({ where: { slug } });
      let counter = 1;
      while (slugExists) {
        slug = `${slug}-${counter}`;
        slugExists = await Prisma.project.findUnique({ where: { slug } });
        counter++;
      }
    }

    const updatedProject = await Prisma.project.update({
      where: { id: Number(id) },
      data: {
        title: title ?? project.title,
        slug,
        description: description ?? project.description,
        thumbnail: thumbnail ?? project.thumbnail,
        liveUrl: liveUrl ?? project.liveUrl,
        repoUrl: repoUrl ?? project.repoUrl,
        features: features ?? project.features,
      },
    });

    res.status(200).json({
        ok : true,
        project : updatedProject
    });
  } catch (err: any) {
    console.error("Error updating Project:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
