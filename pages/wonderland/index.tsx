import React from "react";
import Link from "next/link";

const wonderlandList = [
  {
    id: 1,
    title: "夢境星球",
    author: "夢想家A",
    authorAvatar: "/avatar1.png",
    cover: "/wonderland1.jpg",
    tags: ["插畫", "奇幻"],
    likes: 120,
    comments: 40,
    collects: 50,
  },
  {
    id: 2,
    title: "童話大冒險",
    author: "插畫師B",
    authorAvatar: "/avatar2.png",
    cover: "/wonderland2.jpg",
    tags: ["漫畫", "冒險"],
    likes: 98,
    comments: 21,
    collects: 38,
  },
  {
    id: 3,
    title: "AI幻想曲",
    author: "AI小畫家",
    authorAvatar: "/avatar3.png",
    cover: "/wonderland3.jpg",
    tags: ["貼圖", "科幻"],
    likes: 150,
    comments: 61,
    collects: 87,
  },
  {
    id: 4,
    title: "星空下的異世界",
    author: "夢幻插畫師",
    authorAvatar: "/avatar4.png",
    cover: "/wonderland4.jpg",
    tags: ["插畫", "療癒"],
    likes: 73,
    comments: 19,
    collects: 26,
  },
];

export default function WonderlandIndex() {
  return (
    <div className="wonderland-index" style={{ color: "#fff", background: "#10182a", minHeight: "100vh", padding: "48px 0" }}>
      <h1 style={{ fontSize: 36, marginBottom: 24, fontWeight: 700, letterSpacing: 2 }}>NUMINA WonderLand</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 32, maxWidth: 1100, margin: "0 auto" }}>
        {wonderlandList.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#20294a",
              borderRadius: 18,
              boxShadow: "0 2px 18px #0008",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Link href={`/wonderland/${item.id}`}>
              <img
                src={item.cover}
                alt={`${item.title} 封面`}
                style={{ width: "100%", borderRadius: 12, marginBottom: 16, objectFit: "cover" }}
              />
            </Link>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              <img
                src={item.authorAvatar}
                alt={`${item.author} 頭像`}
                style={{ width: 36, height: 36, borderRadius: "50%", marginRight: 8, border: "2px solid #ffd700" }}
              />
              <span style={{ fontWeight: 600, marginRight: 8 }}>{item.author}</span>
              <Link href="#" style={{ fontSize: 14, color: "#FFD700", marginLeft: 8 }}>+訂閱</Link>
            </div>
            <Link href={`/wonderland/${item.id}`}>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{item.title}</h2>
            </Link>
            <div style={{ marginBottom: 12 }}>
              {item.tags.map((tag, i) => (
                <span key={i} style={{ fontSize: 13, color: "#8ccfff", marginRight: 10, background: "#203765", padding: "2px 10px", borderRadius: 7 }}>
                  #{tag}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 14, color: "#ffd700", marginTop: "auto" }}>
              <span style={{ marginRight: 16 }}>👍 {item.likes}</span>
              <span style={{ marginRight: 16 }}>💬 {item.comments}</span>
              <span>⭐ {item.collects}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <Link href={`/wonderland/${item.id}`}>
                <span style={{ fontSize: 15, color: "#8ccfff", textDecoration: "underline", cursor: "pointer" }}>閱讀/查看</span>
              </Link>
              <span style={{ margin: "0 10px" }}>|</span>
              <Link href="#">
                <span style={{ fontSize: 15, color: "#8ccfff", cursor: "pointer" }}>分享</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
