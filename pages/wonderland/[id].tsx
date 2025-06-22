import React, { useState } from "react";
import Link from "next/link";

const dummyWork = {
  id: 1,
  title: "夢境星球",
  author: "夢想家A",
  authorAvatar: "/avatar1.png",
  cover: "/wonderland1.jpg",
  description: "這是我的超夢幻異世界作品，主題為療癒、奇幻、冒險。",
  tags: ["插畫", "奇幻"],
  images: ["/wonderland1.jpg", "/wonderland1-2.jpg", "/wonderland1-3.jpg"],
  likes: 120,
  comments: [
    { id: 1, user: "粉絲A", text: "超級美！" },
    { id: 2, user: "粉絲B", text: "療癒到不行～" },
  ],
  collects: 50,
};

export default function WonderlandWorkDetail() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(dummyWork.comments);

  const handleComment = () => {
    if (comment.trim() === "") return;
    setComments([...comments, { id: comments.length + 1, user: "你", text: comment }]);
    setComment("");
  };

  return (
    <div style={{ color: "#fff", background: "#10182a", minHeight: "100vh", padding: 48 }}>
      <div style={{ maxWidth: 820, margin: "0 auto", background: "#20294a", borderRadius: 20, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={dummyWork.authorAvatar}
            alt={`${dummyWork.author} 頭像`}
            style={{ width: 38, height: 38, borderRadius: "50%", marginRight: 12, border: "2px solid #ffd700" }}
          />
          <span style={{ fontWeight: 600, fontSize: 18, marginRight: 8 }}>{dummyWork.author}</span>
          <span style={{ fontSize: 14, color: "#ffd700", marginLeft: 6 }}>[原創]</span>
          <Link href="#" style={{ fontSize: 15, color: "#FFD700", marginLeft: 16 }}>+訂閱</Link>
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 700, margin: "18px 0 10px" }}>{dummyWork.title}</h2>
        <div style={{ marginBottom: 14 }}>
          {dummyWork.tags.map((tag, i) => (
            <span key={i} style={{ fontSize: 15, color: "#8ccfff", marginRight: 10, background: "#203765", padding: "2px 10px", borderRadius: 7 }}>
              #{tag}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 17, marginBottom: 20 }}>{dummyWork.description}</div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", marginBottom: 28 }}>
          {dummyWork.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`作品圖片${i + 1}`}
              style={{ width: 240, height: 200, objectFit: "cover", borderRadius: 12 }}
            />
          ))}
        </div>
        <div style={{ marginBottom: 18 }}>
          <span style={{ marginRight: 18 }}>👍 {dummyWork.likes}</span>
          <span>⭐ {dummyWork.collects}</span>
        </div>
        <div style={{ marginBottom: 28 }}>
          <button style={{ color: "#fff", background: "#FFD700", border: "none", borderRadius: 6, padding: "6px 18px", marginRight: 14 }}>按讚</button>
          <button style={{ color: "#fff", background: "#338dff", border: "none", borderRadius: 6, padding: "6px 18px" }}>收藏</button>
        </div>
        <div style={{ borderTop: "1px solid #394764", marginTop: 12, paddingTop: 14 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>留言區</h3>
          {comments.map((c) => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontWeight: 600, marginRight: 8 }}>{c.user}</span>
              <span style={{ color: "#eee" }}>{c.text}</span>
            </div>
          ))}
          <div style={{ display: "flex", marginTop: 14 }}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="輸入留言"
              style={{
                flex: 1,
                borderRadius: 7,
                border: "1px solid #203765",
                padding: "8px 12px",
                color: "#fff",
                background: "#283c5b",
                outline: "none",
                marginRight: 8,
              }}
            />
            <button
              onClick={handleComment}
              style={{
                color: "#fff",
                background: "#FFD700",
                border: "none",
                borderRadius: 6,
                padding: "7px 18px",
                fontWeight: 600,
              }}
            >
              發送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
