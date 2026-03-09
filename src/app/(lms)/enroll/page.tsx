// src/app/(lms)/enroll/page.tsx
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function EnrollIndexPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Prefer "Foundation Program" if present
  const foundation = await prisma.course.findFirst({
    where: { title: "Foundation Program" },
    select: { id: true },
  });

  if (foundation?.id) redirect(`/enroll/${foundation.id}`);

  const anyCourse = await prisma.course.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!anyCourse?.id) redirect("/catalog");

  redirect(`/enroll/${anyCourse.id}`);
}