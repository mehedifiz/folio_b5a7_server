import { Prisma } from "./db";

export const generateUniqueSlug = async (title: string): Promise<string> => {
  let slug = title.toLowerCase();

  slug = slug.replace(/[^a-z0-9\s-]/g, "");

  slug = slug.trim().replace(/\s+/g, "-").replace(/-+/g, "-");

  const originalSlug = slug;
  let counter = 1;

  let slugExists = await Prisma.blog.findUnique({ where: { slug } });

  while (slugExists) {
    slug = `${originalSlug}-${counter}`;
    slugExists = await Prisma.blog.findUnique({ where: { slug } });
    counter++;
  }

  return slug;
};
