//UI
export type FlipbookId =
  | "m1-trung-tam-quyen-luc"
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
  "m1-trung-tam-quyen-luc": {
    id: "m1-trung-tam-quyen-luc",
    title: "Nhà nước XHCN: Quyền lực thuộc về nhân dân",
    pages: [],
    embedUrl: "https://heyzine.com/flip-book/ba08748455.html",
  },
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
    title: "Pháp luật trong Nhà nước XHCN",
    pages: [
      "Pháp luật là công cụ quản lý xã hội quan trọng.",
      "Thượng tôn pháp luật giúp bảo vệ quyền con người, quyền công dân.",
      "Mọi chủ thể đều phải tuân thủ pháp luật.",
    ],
  },
  "m1-to-chuc": {
    id: "m1-to-chuc",
    title: "Tổ chức bộ máy nhà nước",
    pages: [
      "Bộ máy nhà nước được tổ chức theo Hiến pháp và pháp luật.",
      "Phân công, phối hợp và kiểm soát trong thực hiện quyền lực.",
      "Hướng tới hiệu lực, hiệu quả và phục vụ nhân dân.",
    ],
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
