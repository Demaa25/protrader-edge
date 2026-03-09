// src/app/(lms)/lessons/[lessonId]/page.tsx
import styles from "./lesson.module.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { Bottombar } from "@/components/Bottombar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LessonGateNotice from "./LessonGateNotice";
import LessonMaterialsViewer from "./LessonMaterialsViewer";
import { EvaluationType, LessonMaterialType } from "@prisma/client";

type ParamsLike = { lessonId: string } | Promise<{ lessonId: string }>;

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

function getYouTubeEmbed(url: string) {
  const u = new URL(url);
  if (u.hostname.includes("youtu.be")) {
    const id = u.pathname.replace("/", "");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (u.hostname.includes("youtube.com")) {
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
    const parts = u.pathname.split("/").filter(Boolean);
    const shortsIdx = parts.indexOf("shorts");
    if (shortsIdx >= 0 && parts[shortsIdx + 1]) return `https://www.youtube.com/embed/${parts[shortsIdx + 1]}`;
    const embedIdx = parts.indexOf("embed");
    if (embedIdx >= 0 && parts[embedIdx + 1]) return `https://www.youtube.com/embed/${parts[embedIdx + 1]}`;
  }
  return null;
}

function getVimeoEmbed(url: string) {
  const u = new URL(url);
  if (!u.hostname.includes("vimeo.com")) return null;
  const parts = u.pathname.split("/").filter(Boolean);
  const id = parts.find((p) => /^\d+$/.test(p));
  return id ? `https://player.vimeo.com/video/${id}` : null;
}

export default async function LessonPage(props: { params: ParamsLike }) {
  const { lessonId } = await Promise.resolve(props.params);

  const session = await getSession();
  if (!session?.user) redirect("/login");

  
  const userId = (session.user as any)?.id as string | undefined;
  
  const role = (session.user as any)?.role as "ADMIN" | "STUDENT" | undefined;
  if (!userId) redirect("/login");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      content: true,
      order: true,
      module: {
        select: {
          id: true,
          order: true,
          title: true,
          course: { select: { id: true, title: true } },
        },
      },
      materials: {
        orderBy: { order: "asc" },
        select: { id: true, type: true, title: true, url: true, order: true },
      },
    },
  });

  if (!lesson) redirect("/dashboard");
  const courseId = lesson.module.course.id;

  // Access gate (purchase/enrollment/admin)
  const [purchase, enrollment] = await Promise.all([
    prisma.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { status: true },
    }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { id: true },
    }),
  ]);

  const hasAccess =
    !!enrollment ||
    purchase?.status === "PAID" ||
    purchase?.status === "PARTIAL" ||
    role === "ADMIN";

  if (!hasAccess) redirect(`/enroll/${courseId}`);

  // Progress status
  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: lesson.id } },
    select: { completed: true },
  });

  // Ordered lessons list for prev/next
  const allLessons = await prisma.lesson.findMany({
    where: { module: { courseId } },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    select: { id: true, title: true },
  });

  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  // Gate by previous quiz pass (if previous lesson has a quiz)
  let gate = { allowed: true, requiredQuizId: null as string | null, passMarkPct: 70 };
  if (prev) {
    const prevLessonQuiz = await prisma.evaluation.findFirst({
      where: { lessonId: prev.id, type: EvaluationType.QUIZ },
      select: { id: true, passMarkPct: true },
    });

    if (prevLessonQuiz) {
      const bestAttempt = await prisma.evaluationAttempt.findFirst({
        where: { evaluationId: prevLessonQuiz.id, userId, status: "SUBMITTED" },
        orderBy: { scorePct: "desc" },
        select: { scorePct: true },
      });

      const passMark = prevLessonQuiz.passMarkPct ?? 70;
      const passed = (bestAttempt?.scorePct ?? 0) >= passMark;

      if (!passed) {
        gate = { allowed: false, requiredQuizId: prevLessonQuiz.id, passMarkPct: passMark };
      }
    }
  }

  // Find quiz after THIS lesson (continue should go to quiz if it exists)
  const lessonQuiz = await prisma.evaluation.findFirst({
    where: { lessonId: lesson.id, type: EvaluationType.QUIZ },
    select: { id: true },
  });

  const continueHref = lessonQuiz?.id
    ? `/quiz/${lessonQuiz.id}`
    : next?.id
      ? `/lessons/${next.id}`
      : `/courses/${courseId}`;

  async function markCompleteAction(formData: FormData) {
    "use server";
    const rawLessonId = String(formData.get("lessonId") || "");
    const rawNextId = String(formData.get("nextLessonId") || "");

    if (!rawLessonId) return;

    const s = await getSession();
    
    const uid = (s?.user as any)?.id as string | undefined;
    if (!uid) redirect("/login");

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: uid, lessonId: rawLessonId } },
      update: { completed: true },
      create: { userId: uid, lessonId: rawLessonId, completed: true },
    });

    // After completing: go to quiz after this lesson if exists
    const q = await prisma.evaluation.findFirst({
      where: { lessonId: rawLessonId, type: EvaluationType.QUIZ },
      select: { id: true },
    });

    if (q?.id) redirect(`/quiz/${q.id}`);
    if (rawNextId) redirect(`/lessons/${rawNextId}`);
    redirect(`/courses/${courseId}`);
  }

  // Materials split
  const videos = lesson.materials.filter((m) => m.type === LessonMaterialType.VIDEO && m.url?.trim());
  const documents = lesson.materials.filter((m) => m.type === LessonMaterialType.DOCUMENT && m.url?.trim());

  // Video rendering: only if a VIDEO material exists
  let player: React.ReactNode = null;
  const videoUrl = videos[0]?.url?.trim() || "";

  if (videoUrl) {
    let embed: string | null = null;
    try {
      embed = getYouTubeEmbed(videoUrl) || getVimeoEmbed(videoUrl);
    } catch {
      embed = null;
    }

    if (embed) {
      player = (
        <div className={styles.videoFrameWrap}>
          <iframe
            className={styles.videoFrame}
            src={embed}
            title="Lesson video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    } else if (isDirectVideo(videoUrl)) {
      player = (
        <video className={styles.videoTag} controls playsInline preload="metadata">
          <source src={videoUrl} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      player = (
        <div className={styles.videoFrameWrap}>
          <iframe className={styles.videoFrame} src={videoUrl} title="Lesson video" />
        </div>
      );
    }
  }

  return (
    <div className={styles.shell}>
      <Sidebar role={role as any} />

      <div className={styles.content}>
        <Topbar />

        <main className={styles.main}>
          {!gate.allowed && gate.requiredQuizId ? (
            <LessonGateNotice quizHref={`/quiz/${gate.requiredQuizId}`} passMarkPct={gate.passMarkPct} />
          ) : null}

          <div className={styles.breadcrumb}>
            <a className={styles.crumbLink} href={`/courses/${courseId}`}>
              {lesson.module.course.title}
            </a>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{lesson.title}</span>
          </div>

          <h1 className={styles.h1}>{lesson.title}</h1>

          {!gate.allowed ? (
            <div className={styles.sub} style={{ color: "crimson", marginTop: 10 }}>
              Lesson locked until you pass the previous quiz ({gate.passMarkPct}%).
            </div>
          ) : (
            <>
              {/* Only show player card if we have video OR documents */}
              {(player || documents.length > 0) ? (
                <section className={styles.playerCard}>
                  {player ? (
                    <>
                      <div style={{ fontWeight: 900, marginBottom: 8 }}>Lesson Video</div>
                      {player}
                    </>
                  ) : null}

                  {documents.length > 0 ? (
                    <LessonMaterialsViewer
                      documents={documents.map((d) => ({
                        id: d.id,
                        type: "DOCUMENT",
                        title: d.title,
                        url: d.url,
                        order: d.order,
                      }))}
                    />
                  ) : null}

                  {!player && documents.length === 0 ? (
                    <div className={styles.muted}>No video or documents attached yet.</div>
                  ) : null}
                </section>
              ) : null}

              {lesson.content ? (
                <section className={styles.textCard}>
                  <div className={styles.textTitle}>Lesson Notes</div>
                  <div className={styles.textBody}>
                    {lesson.content.split("\n").map((line, i) => (
                      <p key={i} className={styles.paragraph}>
                        {line}
                      </p>
                    ))}
                  </div>
                </section>
              ) : null}

              <footer className={styles.footer}>
                {prev ? (
                  <a className={styles.navBtn} href={`/lessons/${prev.id}`}>
                    ← Previous Lesson
                  </a>
                ) : (
                  <span />
                )}

                <form action={markCompleteAction}>
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <input type="hidden" name="nextLessonId" value={next?.id ?? ""} />
                  <button className={styles.primary} type="submit">
                    {progress?.completed ? "Completed ✓" : "Mark Complete"}
                  </button>
                </form>

                {next ? (
                  <a className={styles.navBtn} href={continueHref}>
                    Continue →
                  </a>
                ) : (
                  <a className={styles.navBtn} href={`/courses/${courseId}`}>
                    Back to Course
                  </a>
                )}
              </footer>
            </>
          )}
        </main>

        <Bottombar />
      </div>
    </div>
  );
}