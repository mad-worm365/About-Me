import { posts } from "@/lib/data";
import { Reveal } from "./Reveal";

export function Blog() {
  return (
    <section id="blog" className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <Reveal>
        <p className="text-xs font-semibold tracking-[0.22em] text-violet-500">BLOG</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          Notes from the workbench
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.title} delay={index * 90}>
            <article className="group h-full rounded-[1.5rem] border border-line bg-surface p-6 shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="rounded-full bg-violet-50 px-2.5 py-1 font-semibold text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                  {post.tag}
                </span>
                {post.read}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink group-hover:text-violet-600 dark:group-hover:text-violet-300">
                {post.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">{post.excerpt}</p>
              <p className="mt-5 text-sm font-semibold text-violet-600 dark:text-violet-300">Read article →</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
