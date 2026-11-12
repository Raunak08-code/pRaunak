import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Calendar,
  Code,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { blogPosts } from "../data";
import type { BlogPost } from "../types";

function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeContent: string[] = [];

  return lines.map((line, index) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        const content = codeContent.join("\n");
        codeContent = [];
        inCodeBlock = false;
        return (
          <pre className="blog-code-block" key={index}>
            <code>{content}</code>
          </pre>
        );
      }
      inCodeBlock = true;
      return null;
    }
    if (inCodeBlock) {
      codeContent.push(line);
      return null;
    }
    if (line.startsWith("# ")) {
      return <h2 key={index}>{renderInline(line.slice(2))}</h2>;
    }
    if (line.startsWith("## ")) {
      return <h3 key={index}>{renderInline(line.slice(3))}</h3>;
    }
    if (line.startsWith("### ")) {
      return <h4 key={index}>{renderInline(line.slice(4))}</h4>;
    }
    if (line.trim() === "---") return <hr key={index} />;
    if (line.startsWith("> ")) {
      return <blockquote key={index}>{renderInline(line.slice(2))}</blockquote>;
    }
    if (line.startsWith("- ")) {
      return <p className="blog-list-item" key={index}>{renderInline(line.slice(2))}</p>;
    }
    const numbered = line.match(/^(\d+)\.\s+(.*)$/);
    if (numbered) {
      return (
        <p className="blog-list-item blog-numbered-item" key={index}>
          <span>{numbered[1]}.</span>{renderInline(numbered[2])}
        </p>
      );
    }
    if (!line.trim()) return <div className="blog-paragraph-space" key={index} />;
    return <p key={index}>{renderInline(line)}</p>;
  });
}

function BlogCard({
  post,
  onReadMore,
}: {
  post: BlogPost;
  onReadMore: (post: BlogPost) => void;
}) {
  const [minimized, setMinimized] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3 }}
      className={`blog-card${minimized ? " is-minimized" : ""}`}
    >
      <header className="blog-card-header">
        <div className="blog-card-date">
          <Calendar aria-hidden="true" />
          <time>{post.date}</time>
        </div>
        <button
          type="button"
          className="blog-minimize"
          aria-label={`${minimized ? "Expand" : "Minimize"} ${post.title} card`}
          aria-expanded={!minimized}
          onClick={() => setMinimized((value) => !value)}
        >
          {minimized ? <Plus aria-hidden="true" /> : <Minus aria-hidden="true" />}
        </button>
      </header>

      <h2>{post.title}</h2>
      {!minimized && (
        <>
          <p className="blog-card-description">{post.excerpt}</p>
          <button type="button" className="blog-read-more" onClick={() => onReadMore(post)}>
            Read More <ArrowRight aria-hidden="true" />
          </button>
        </>
      )}
    </motion.article>
  );
}

export default function Blogs() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const previousScrollTop = useRef(0);
  const hasOpenedPost = useRef(false);

  const sortedBlogPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const openPost = (post: BlogPost) => {
    previousScrollTop.current =
      document.getElementById("app-content")?.scrollTop ?? window.scrollY;
    setSelectedPost(post);
  };

  useLayoutEffect(() => {
    if (selectedPost) {
      detailScrollRef.current?.scrollTo(0, 0);
      hasOpenedPost.current = true;
      return;
    }
    if (!hasOpenedPost.current) return;
    const scrollContainer = document.getElementById("app-content");
    if (scrollContainer) scrollContainer.scrollTop = previousScrollTop.current;
    else window.scrollTo(0, previousScrollTop.current);
    hasOpenedPost.current = false;
  }, [selectedPost]);

  useEffect(() => {
    if (!selectedPost) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedPost(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedPost]);

  return (
    <section id="blogs" className="blogs-page">
      <div className="blogs-shell">
        <header className="blogs-heading">
          <p className="blog-kicker">Writing &amp; field notes</p>
          <h1>Blog</h1>
        </header>

        <div className="blogs-grid">
          {sortedBlogPosts.map((post) => (
            <BlogCard key={post.id} post={post} onReadMore={openPost} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="blog-detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={detailScrollRef}
              className="blog-detail-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-detail-title"
            >
              <header className="blog-detail-toolbar">
                <button type="button" onClick={() => setSelectedPost(null)} className="blog-back-button">
                  <ArrowLeft aria-hidden="true" /> Back to Blog
                </button>
                <div className="blog-detail-brand">
                  <BookMarked aria-hidden="true" />
                  <span>Article</span>
                </div>
                <button
                  type="button"
                  className="blog-close-button"
                  onClick={() => setSelectedPost(null)}
                  aria-label="Close article and return to blog"
                >
                  <X aria-hidden="true" />
                </button>
              </header>

              <article className="blog-article">
                <div className="blog-article-meta">
                  <Calendar aria-hidden="true" />
                  <time>{selectedPost.date}</time>
                  <span>{selectedPost.readTime}</span>
                </div>
                <h1 id="blog-detail-title">{selectedPost.title}</h1>
                <div className="blog-article-tags">
                  {selectedPost.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="markdown-body blog-article-content">
                  {renderMarkdown(selectedPost.content)}
                </div>
                <button type="button" className="blog-article-close" onClick={() => setSelectedPost(null)}>
                  Close article
                </button>
              </article>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
