//UI
export type FlipbookId =
  | "m1-trung-tam-quyen-luc"
  | "m1-chuc-nang"
  | "m1-phap-luat"
  | "m1-to-chuc"
  | "m2-dan-chu"
  | "m2-phap-quyen"
  | "m2-phat-huy"
  | "m2-tham-gia"
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
    title: "Dân chủ xã hội chủ nghĩa",
    pages: [
      "Dân chủ XHCN là bản chất của chế độ XHCN: Nhân dân làm chủ.",
      "Thực hiện bằng dân chủ trực tiếp và dân chủ đại diện.",
      "Gắn với kỷ cương, pháp luật và trách nhiệm công dân.",
    ],
  },
  "m2-phap-quyen": {
    id: "m2-phap-quyen",
    title: "Nhà nước pháp quyền XHCN ở Việt Nam",
    pages: [
      "Nhà nước quản lý xã hội bằng Hiến pháp và pháp luật.",
      "Tôn trọng, bảo vệ và bảo đảm quyền con người, quyền công dân.",
      "Đề cao công khai, minh bạch và trách nhiệm giải trình.",
    ],
  },
  "m2-phat-huy": {
    id: "m2-phat-huy",
    title: "Phát huy dân chủ XHCN",
    pages: [
      "Kiểm soát quyền lực để phòng chống lạm quyền, tham nhũng.",
      "Cơ chế giám sát, phản biện xã hội góp phần nâng cao chất lượng quản trị.",
      "Mục tiêu: quyền lực được sử dụng đúng mục đích, vì nhân dân.",
    ],
  },
  "m2-tham-gia": {
    id: "m2-tham-gia",
    title: "Nhân dân tham gia quản lý",
    pages: [
      "Tham gia qua bầu cử, góp ý, giám sát và phản biện.",
      "Tham gia qua tổ chức chính trị - xã hội và các kênh hợp pháp.",
      "Tăng chất lượng quyết sách và tạo đồng thuận xã hội.",
    ],
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
