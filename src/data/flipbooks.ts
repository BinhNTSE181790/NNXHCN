//UI
export type FlipbookId =
  | "m1-chuc-nang"
  | "m1-phap-luat"
  | "m1-to-chuc"
  | "m2-dan-chu"
  | "m2-phap-quyen"
  | "m2-phat-huy"
  | "m3-tong-ket";

export type Flipbook = {
  id: FlipbookId;
  title: string;
  pages: string[];
  embedUrl?: string;
};

export const FLIPBOOKS: Record<FlipbookId, Flipbook> = {

  "m1-chuc-nang": {
    id: "m1-chuc-nang",
    title: "Chức năng của Nhà nước XHCN",
    pages: [
      "Tổ chức, quản lý xã hội; giữ vững trật tự, kỷ cương.",
      "Phát triển kinh tế, văn hóa, giáo dục; thực hiện an sinh xã hội.",
      "Bảo vệ Tổ quốc và mở rộng quan hệ đối ngoại hòa bình.",
    ],
  },
  "m1-phap-luat": {
    id: "m1-phap-luat",
    title: "Nguồn gốc chủ nghĩa xã hội",
    pages: [
    ],
    embedUrl: "https://heyzine.com/flip-book/98e25a41ec.html"
  },
  "m1-to-chuc": {
    id: "m1-to-chuc",
    title: "Mối quan hệ dân chủ xã hội chủ nghĩa và nhà nước xã hội chủ nghĩa",
    pages: [
    ],
    embedUrl: "https://heyzine.com/flip-book/8481ae8b11.html"
  },

  "m2-dan-chu": {
    id: "m2-dan-chu",
    title: "Dân chủ xã hội chủ nghĩa ở Việt Nam",
    pages: [
    ],
    embedUrl: "https://heyzine.com/flip-book/72b412ea20.html"
  },
  "m2-phap-quyen": {
    id: "m2-phap-quyen",
    title: "Nhà nước pháp quyền XHCN ở Việt Nam",
    pages: [
    ],
    embedUrl: "https://heyzine.com/flip-book/78e19834d2.html"
  },
  "m2-phat-huy": {
    id: "m2-phat-huy",
    title: "Phát huy và xây dựng nhà nước pháp quyền XHCN ở Việt Nam",
    pages: [
    ],
    embedUrl: "https://heyzine.com/flip-book/a742a2e1b3.html"
  },
  "m3-tong-ket": {
    id: "m3-tong-ket",
    title: "Tổng kết",
    pages: [
      "Nhà nước XHCN: hướng tới công bằng, tiến bộ xã hội.",
      "Dân chủ XHCN: nhân dân làm chủ, quyền lực thuộc về nhân dân.",
      "Nhà nước pháp quyền XHCN: thượng tôn Hiến pháp và pháp luật.",
      "Kết hợp: vừa dân chủ, vừa kỷ cương; quyền đi đôi với trách nhiệm.",
    ],
  },
};
