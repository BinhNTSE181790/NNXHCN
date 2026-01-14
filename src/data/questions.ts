//UI
export type QuizId = "map1" | "map2" | "final";

export type Question = {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export const QUIZ_QUESTIONS: Record<QuizId, Question[]> = {
  map1: [
    {
      id: "m1-q1",
      prompt: "Trong nhà nước xã hội chủ nghĩa, quyền lực nhà nước thuộc về ai?",
      choices: [
        "Nhân dân",
        "Một nhóm đặc quyền",
        "Chỉ cơ quan hành pháp",
        "Chỉ cơ quan tư pháp",
      ],
      correctIndex: 0,
    },
    {
      id: "m1-q2",
      prompt: "Đặc trưng quan trọng của nhà nước xã hội chủ nghĩa là gì?",
      choices: [
        "Phục vụ lợi ích nhân dân, hướng tới công bằng xã hội",
        "Tập trung bảo vệ lợi ích cá nhân giàu có",
        "Tách rời khỏi pháp luật",
        "Không cần bộ máy quản lý",
      ],
      correctIndex: 0,
    },
    {
      id: "m1-q3",
      prompt: "Chức năng cơ bản của nhà nước xã hội chủ nghĩa bao gồm:",
      choices: [
        "Tổ chức quản lý xã hội và phát triển kinh tế - văn hóa",
        "Chỉ thu thuế",
        "Chỉ trấn áp",
        "Chỉ đối ngoại",
      ],
      correctIndex: 0,
    },
    {
      id: "m1-q4",
      prompt: "Trong nhà nước xã hội chủ nghĩa, pháp luật có vai trò như thế nào?",
      choices: [
        "Công cụ quản lý xã hội, bảo đảm quyền và lợi ích hợp pháp",
        "Chỉ là khuyến nghị",
        "Chỉ áp dụng với người yếu thế",
        "Có thể bỏ qua khi cần",
      ],
      correctIndex: 0,
    },
    {
      id: "m1-q5",
      prompt: "Nhà nước xã hội chủ nghĩa thường gắn với nguyên tắc nào?",
      choices: [
        "Dân chủ và công bằng xã hội",
        "Phân biệt đối xử",
        "Đặc quyền đặc lợi",
        "Tư hữu hóa toàn bộ",
      ],
      correctIndex: 0,
    },
  ],

  map2: [
    {
      id: "m2-q1",
      prompt: "Dân chủ xã hội chủ nghĩa nhấn mạnh điều gì?",
      choices: [
        "Nhân dân làm chủ, quyền lực thuộc về nhân dân",
        "Chỉ bầu cử hình thức",
        "Quyền lực chỉ thuộc một cá nhân",
        "Loại bỏ sự tham gia của nhân dân",
      ],
      correctIndex: 0,
    },
    {
      id: "m2-q2",
      prompt: "Nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam được hiểu là:",
      choices: [
        "Nhà nước quản lý bằng pháp luật, bảo đảm quyền con người, quyền công dân",
        "Nhà nước quản lý bằng mệnh lệnh cá nhân",
        "Nhà nước đứng trên pháp luật",
        "Nhà nước không cần hiến pháp",
      ],
      correctIndex: 0,
    },
    {
      id: "m2-q3",
      prompt: "Nguyên tắc 'mọi cơ quan, tổ chức, cá nhân đều bình đẳng trước pháp luật' thể hiện:",
      choices: [
        "Tính thượng tôn pháp luật",
        "Tính tùy tiện",
        "Tính đặc quyền",
        "Tính phân biệt",
      ],
      correctIndex: 0,
    },
    {
      id: "m2-q4",
      prompt: "Dân chủ xã hội chủ nghĩa ở Việt Nam được thực hiện chủ yếu thông qua:",
      choices: [
        "Dân chủ trực tiếp và dân chủ đại diện",
        "Chỉ dân chủ trực tiếp",
        "Chỉ dân chủ đại diện",
        "Không có cơ chế thực hiện",
      ],
      correctIndex: 0,
    },
    {
      id: "m2-q5",
      prompt: "Một biểu hiện của nhà nước pháp quyền xã hội chủ nghĩa là:",
      choices: [
        "Kiểm soát quyền lực, phòng chống lạm quyền",
        "Tập trung quyền lực tuyệt đối không kiểm soát",
        "Không cần minh bạch",
        "Hạn chế quyền công dân",
      ],
      correctIndex: 0,
    },
  ],

  final: [
    {
      id: "f-q1",
      prompt: "Điểm chung giữa nhà nước xã hội chủ nghĩa và nhà nước pháp quyền XHCN là:",
      choices: [
        "Đều hướng tới phục vụ nhân dân và quản lý xã hội bằng pháp luật",
        "Đều loại bỏ pháp luật",
        "Đều đặt quyền lực cá nhân lên trên",
        "Đều không có hiến pháp",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q2",
      prompt: "Hiến pháp có vai trò gì trong nhà nước pháp quyền?",
      choices: [
        "Là đạo luật cơ bản, nền tảng cho hệ thống pháp luật",
        "Chỉ là tài liệu tham khảo",
        "Chỉ dùng khi có tranh chấp quốc tế",
        "Có thể thay đổi tùy ý không theo thủ tục",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q3",
      prompt: "Trong dân chủ xã hội chủ nghĩa, nhân dân tham gia quản lý nhà nước và xã hội thông qua:",
      choices: [
        "Bầu cử, giám sát, phản biện và các hình thức tham gia hợp pháp",
        "Chỉ nghe và làm theo",
        "Chỉ thông qua tin đồn",
        "Không được tham gia",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q4",
      prompt: "Nguyên tắc thượng tôn pháp luật có nghĩa là:",
      choices: [
        "Pháp luật được tôn trọng và thực thi nghiêm minh",
        "Pháp luật chỉ áp dụng với dân",
        "Pháp luật có thể bị bỏ qua",
        "Pháp luật là tùy chọn",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q5",
      prompt: "Mục tiêu của nhà nước xã hội chủ nghĩa gắn liền với:",
      choices: [
        "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh",
        "Chỉ tăng trưởng kinh tế bằng mọi giá",
        "Đặc quyền cho một nhóm",
        "Loại bỏ an sinh",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q6",
      prompt: "Kiểm soát quyền lực nhà nước giúp:",
      choices: [
        "Hạn chế lạm quyền, tăng trách nhiệm giải trình",
        "Tăng tùy tiện",
        "Giảm minh bạch",
        "Loại bỏ pháp luật",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q7",
      prompt: "Quyền con người, quyền công dân trong nhà nước pháp quyền XHCN:",
      choices: [
        "Được công nhận, tôn trọng, bảo vệ và bảo đảm",
        "Không cần bảo đảm",
        "Chỉ bảo vệ một số người",
        "Không liên quan pháp luật",
      ],
      correctIndex: 0,
    },
    {
      id: "f-q8",
      prompt: "Dân chủ đại diện thể hiện rõ nhất qua:",
      choices: [
        "Bầu cử đại biểu và hoạt động của cơ quan đại diện",
        "Tự ý ra quyết định cá nhân",
        "Không cần bầu cử",
        "Chỉ biểu quyết online",
      ],
      correctIndex: 0,
    },
  ],
};
