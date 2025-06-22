import React, { useState } from "react";
import Link from "next/link";

export default function WonderlandEdit() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [pdf, setPdf] = useState<File | null>(null);
  const [stickers, setStickers] = useState<File[]>([]);
  const [mode, setMode] = useState("免費");
  const [price, setPrice] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setPdf(e.target.files[0]);
  };
  const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setStickers(Array.from(e.target.files));
  };

  return (
    <div style={{ color: "#fff", background: "#10182a", minHeight: "100vh", padding: 48 }}>
      <div style={{ maxWidth: 820, margin: "0 auto", background: "#20294a", borderRadius: 20, padding: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>WonderLand 創作編輯器</h2>
        <div style={{ marginBottom: 18 }}>
          <label>標題：</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ color: "#fff", background: "#283c5b", border: "1px solid #304770", borderRadius: 7, padding: 8, width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>描述：</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            style={{ color: "#fff", background: "#283c5b", border: "1px solid #304770", borderRadius: 7, padding: 8, width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>分類標籤：</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            style={{ color: "#fff", background: "#283c5b", border: "1px solid #304770", borderRadius: 7, padding: 8, width: "100%" }}
            placeholder="例：插畫,漫畫,貼圖"
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>插畫／漫畫圖上傳：</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {images.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`上傳圖片${i + 1}`}
                style={{ width: 88, height: 88, borderRadius: 8, objectFit: "cover" }}
              />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>漫畫書 PDF 上傳：</label>
          <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
          {pdf && <span style={{ color: "#8ccfff", marginLeft: 12 }}>{pdf.name}</span>}
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>創作貼圖包（可多檔）：</label>
          <input type="file" multiple accept="image/*" onChange={handleStickerUpload} />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {stickers.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`上傳貼圖${i + 1}`}
                style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover", border: "2px solid #FFD700" }}
              />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>收費模式：</label>
          <select value={mode} onChange={e => setMode(e.target.value)} style={{ color: "#fff", background: "#283c5b", border: "1px solid #304770", borderRadius: 7, padding: 8 }}>
            <option value="免費">免費</option>
            <option value="單篇付費">單篇付費</option>
            <option value="訂閱制">訂閱制</option>
            <option value="打賞">打賞</option>
          </select>
          {(mode === "單篇付費" || mode === "訂閱制") && (
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="請輸入金額"
              style={{ marginLeft: 12, color: "#fff", background: "#283c5b", border: "1px solid #304770", borderRadius: 7, padding: 8, width: 120 }}
            />
          )}
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 16 }}>
          <button style={{ color: "#fff", background: "#1976d2", border: "none", borderRadius: 6, padding: "8px 24px", fontWeight: 600 }} onClick={() => setShowPreview(true)}>
            預覽
          </button>
          <button style={{ color: "#fff", background: "#FFD700", border: "none", borderRadius: 6, padding: "8px 24px", fontWeight: 600 }}>
            發布
          </button>
          <button style={{ color: "#fff", background: "#404d68", border: "none", borderRadius: 6, padding: "8px 24px", fontWeight: 600 }}>
            儲存草稿
          </button>
          <Link href="/wonderland">
            <button style={{ color: "#fff", background: "#30394a", border: "none", borderRadius: 6, padding: "8px 24px", fontWeight: 600 }}>
              取消
            </button>
          </Link>
        </div>
        {showPreview && (
          <div style={{ marginTop: 36, padding: 24, background: "#151e33", borderRadius: 10 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>預覽：</h3>
            <div style={{ color: "#8ccfff" }}>{title}</div>
            <div style={{ marginBottom: 6 }}>{desc}</div>
            <div>
              {images.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`預覽圖片${i + 1}`}
                  style={{ width: 96, height: 96, borderRadius: 10, marginRight: 7, objectFit: "cover" }}
                />
              ))}
            </div>
            <div style={{ marginTop: 6 }}>
              標籤：{tags}
              {pdf && <div style={{ color: "#FFD700" }}>PDF: {pdf.name}</div>}
            </div>
            <div>
              {stickers.length > 0 && <span>貼圖包({stickers.length})</span>}
              <div style={{ display: "flex", gap: 6 }}>
                {stickers.map((file, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(file)}
                    alt={`預覽貼圖${i + 1}`}
                    style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", border: "1px solid #FFD700" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
