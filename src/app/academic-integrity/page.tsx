"use client";

import React from "react";
import styles from "./academic-integrity.module.css";

// ===========================
// SECTION 1: AI TOOLS USED
// ===========================
interface AIToolSession {
  tool: string;
  prompt: string;
  aiOutput: string;
  teamEdits: string;
}

const Section1_AITools: React.FC = () => {
  const copilotSessions: AIToolSession[] = [
    {
      tool: "GitHub Copilot (Claude Sonnet 3.5)",
      prompt: "Tạo game canvas 2D với top-down view, player movement sử dụng WASD và phím mũi tên, bao gồm Game class, Player class, Input system, Maps system với doors và interactive objects",
      aiOutput: "Copilot đã tạo ra toàn bộ cấu trúc game engine với Player class (movement, collision), Input system (keyboard handling), render loop, Maps.ts với các hàm tạo map/door/exhibit objects, và logic chuyển map. Code có cấu trúc rõ ràng với TypeScript types đầy đủ.",
      teamEdits: "Team đã chỉnh sửa và mở rộng: điều chỉnh vị trí shadow của player, tối ưu hóa collision detection, thêm smooth camera movement, cải thiện door placement logic, và tối ưu render performance cho nhiều objects"
    },
    {
      tool: "GitHub Copilot (ChatGPT 4)",
      prompt: "Tạo quiz modal component với multiple choice questions, answer validation, và animation khi chuyển câu hỏi",
      aiOutput: "Copilot sinh ra QuizModal component hoàn chỉnh với state management cho current question, answer selection, answer validation với correct/incorrect feedback, và basic styling với modal overlay",
      teamEdits: "Team đã tùy chỉnh và cải thiện: thêm sound effects cho correct/incorrect answers, cải thiện animation transitions giữa các câu hỏi, tích hợp với game state để lưu progress, và thêm quiz completion flow"
    }
  ];

  const perplexitySessions: AIToolSession[] = [
    {
      tool: "Perplexity AI",
      prompt: "Giải thích khái niệm 'Nhà nước xã hội chủ nghĩa' trong bối cảnh Việt Nam",
      aiOutput: "Perplexity cung cấp định nghĩa: Nhà nước XHCN là nhà nước lấy nhân dân làm chủ, quyền lực thuộc về nhân dân, do nhân dân và vì nhân dân. Bao gồm các chức năng: tổ chức quản lý xã hội, phát triển kinh tế-văn hóa, bảo vệ tổ quốc.",
      teamEdits: "Team đã rút gọn và đơn giản hóa nội dung để phù hợp với format game, đảm bảo dễ hiểu cho người chơi"
    },
    {
      tool: "Perplexity AI",
      prompt: "Dân chủ xã hội chủ nghĩa là gì? Đặc điểm và cách thực hiện ở Việt Nam",
      aiOutput: "Perplexity giải thích: Dân chủ XHCN là bản chất của chế độ XHCN, thực hiện qua dân chủ trực tiếp và dân chủ đại diện. Nhân dân tham gia quản lý nhà nước qua bầu cử, giám sát, và các kênh phản biện hợp pháp.",
      teamEdits: "Team chuyển thể thành câu hỏi quiz và nội dung flipbook, thêm ví dụ cụ thể để dễ hình dung"
    },
    {
      tool: "Perplexity AI",
      prompt: "Nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam có đặc điểm gì?",
      aiOutput: "Perplexity trả lời: Nhà nước pháp quyền XHCN là nhà nước quản lý xã hội bằng Hiến pháp và pháp luật, tôn trọng và bảo đảm quyền con người, quyền công dân. Đề cao công khai minh bạch, kiểm soát quyền lực để phòng chống lạm quyền.",
      teamEdits: "Team đã cấu trúc lại thành các points chính cho flipbook và tạo câu hỏi quiz kiểm tra hiểu biết"
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>1. Công cụ AI đã sử dụng</h2>
      
      <div className={styles.toolCategory}>
        <h3 className={styles.toolName}>GitHub Copilot (ChatGPT + Claude)</h3>
        <p className={styles.toolDescription}>
          Sử dụng để hỗ trợ viết code và phát triển giao diện game. 
          Copilot đã giúp tạo các component React, game logic, và tích hợp API.
        </p>
        
        <div className={styles.sessionList}>
          {copilotSessions.map((session, idx) => (
            <div key={idx} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <span className={styles.sessionTool}>{session.tool}</span>
              </div>
              
              <div className={styles.sessionContent}>
                <div className={styles.sessionBlock}>
                  <strong>Prompt:</strong>
                  <p>{session.prompt}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Output từ AI:</strong>
                  <p>{session.aiOutput}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Chỉnh sửa của nhóm:</strong>
                  <p className={styles.teamEdit}>{session.teamEdits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.toolCategory}>
        <h3 className={styles.toolName}>Perplexity AI</h3>
        <p className={styles.toolDescription}>
          Sử dụng để tìm kiếm và tổng hợp thông tin về các khái niệm chính trị học:
          Nhà nước xã hội chủ nghĩa, Dân chủ xã hội chủ nghĩa, và Nhà nước pháp quyền xã hội chủ nghĩa.
        </p>
        
        <div className={styles.sessionList}>
          {perplexitySessions.map((session, idx) => (
            <div key={idx} className={styles.sessionCard}>
              <div className={styles.sessionHeader}>
                <span className={styles.sessionTool}>{session.tool}</span>
              </div>
              
              <div className={styles.sessionContent}>
                <div className={styles.sessionBlock}>
                  <strong>Prompt:</strong>
                  <p>{session.prompt}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Output từ AI:</strong>
                  <p>{session.aiOutput}</p>
                </div>
                
                <div className={styles.sessionBlock}>
                  <strong>Chỉnh sửa của nhóm:</strong>
                  <p className={styles.teamEdit}>{session.teamEdits}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===========================
// SECTION 2: SOURCE VERIFICATION
// ===========================
interface Reference {
  id: string;
  title: string;
  placeholder: string;
}

const Section2_SourceVerification: React.FC = () => {
  const references: Reference[] = [
    {
      id: "ref-1",
      title: "Nguồn tham khảo 1",
      placeholder: "Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam năm 2013 (sửa đổi, bổ sung năm 2024)"
    },
    {
      id: "ref-2",
      title: "Nguồn tham khảo 2",
      placeholder: "Văn kiện Đại hội XIII của Đảng - Tài liệu về xây dựng nhà nước pháp quyền XHCN"
    },
    {
      id: "ref-3",
      title: "Nguồn tham khảo 3",
      placeholder: "Giáo trình Lý luận chính trị - Các khái niệm cơ bản về nhà nước và pháp luật"
    },
    {
      id: "ref-4",
      title: "Nguồn tham khảo 4",
      placeholder: "Bài giảng của giảng viên về Dân chủ xã hội chủ nghĩa và Nhà nước pháp quyền"
    },
    {
      id: "ref-5",
      title: "Nguồn tham khảo 5",
      placeholder: "Tài liệu nghiên cứu từ Viện Khoa học Xã hội Việt Nam"
    },
    {
      id: "ref-6",
      title: "Nguồn tham khảo 6",
      placeholder: "Các bài báo khoa học về thực tiễn xây dựng nhà nước pháp quyền tại Việt Nam"
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>2. Kiểm chứng nguồn</h2>
      <p className={styles.sectionDescription}>
        Tất cả thông tin trong game đều được kiểm chứng và tham khảo từ các nguồn đáng tin cậy sau:
      </p>
      
      <div className={styles.referenceGrid}>
        {references.map((ref) => (
          <div key={ref.id} className={styles.referenceCard}>
            <div className={styles.referenceHeader}>
              <h4>{ref.title}</h4>
            </div>
            <div className={styles.referencePlaceholder}>
              <p>{ref.placeholder}</p>
              <span className={styles.referenceNote}>[Chi tiết sẽ được cập nhật]</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ===========================
// SECTION 3: AI CREATIVE APPLICATION
// ===========================
interface ApplicationArea {
  title: string;
  description: string;
  details: string[];
}

const Section3_CreativeApplication: React.FC = () => {
  const applications: ApplicationArea[] = [
    {
      title: "Thiết kế giao diện",
      description: "Kết hợp AI và sáng tạo con người trong thiết kế UI/UX",
      details: [
        "AI (GitHub Copilot) đề xuất cấu trúc component và layout cơ bản",
        "Con người quyết định color scheme, spacing, và visual hierarchy phù hợp với theme bảo tàng",
        "AI hỗ trợ generate CSS animations, con người tinh chỉnh timing và easing cho mượt mà",
        "Kết quả: Giao diện game vừa hiện đại vừa mang tính giáo dục, dễ sử dụng"
      ]
    },
    {
      title: "Thu thập nội dung",
      description: "Quy trình thu thập và xử lý thông tin học thuật",
      details: [
        "AI (Perplexity) tìm kiếm và tổng hợp thông tin ban đầu từ nhiều nguồn",
        "Con người kiểm tra độ chính xác, đối chiếu với tài liệu gốc (Hiến pháp, văn kiện Đảng)",
        "AI hỗ trợ đề xuất cách diễn đạt dễ hiểu, con người điều chỉnh cho phù hợp ngữ cảnh Việt Nam",
        "Kết quả: Nội dung chính xác về mặt học thuật nhưng dễ tiếp cận với người chơi"
      ]
    },
    {
      title: "Tối ưu trải nghiệm người dùng",
      description: "Cải thiện gameplay và tương tác",
      details: [
        "AI đề xuất game mechanics như quiz system, flipbook navigation, map transitions",
        "Con người test và điều chỉnh difficulty, pacing, và feedback mechanisms",
        "AI sinh code cho sound effects và visual effects, con người fine-tune cho phù hợp mood",
        "Con người thiết kế progression system và reward, AI implement logic",
        "Kết quả: Gameplay engaging, motivate người chơi học tập qua trải nghiệm tương tác"
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>3. Ứng dụng AI sáng tạo</h2>
      <p className={styles.sectionDescription}>
        Dự án này thể hiện sự kết hợp hài hòa giữa AI và con người trong quá trình phát triển:
      </p>
      
      <div className={styles.applicationList}>
        {applications.map((app, idx) => (
          <div key={idx} className={styles.applicationCard}>
            <h3 className={styles.applicationTitle}>{app.title}</h3>
            <p className={styles.applicationDescription}>{app.description}</p>
            
            <ul className={styles.detailList}>
              {app.details.map((detail, detailIdx) => (
                <li key={detailIdx}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.synthesisBox}>
        <h4>Tổng hợp</h4>
        <p>
          AI đóng vai trò là công cụ hỗ trợ mạnh mẽ, tăng tốc độ phát triển và đề xuất giải pháp.
          Con người là người quyết định cuối cùng, đảm bảo chất lượng, tính chính xác, và phù hợp văn hóa.
          Sự kết hợp này tạo ra sản phẩm vừa hiệu quả vừa có giá trị giáo dục cao.
        </p>
      </div>
    </section>
  );
};

// ===========================
// SECTION 4: INTEGRITY COMMITMENT
// ===========================
interface CommitmentItem {
  category: string;
  items: string[];
}

const Section4_IntegrityCommitment: React.FC = () => {
  const commitments: CommitmentItem[] = [
    {
      category: "Cam kết liêm chính",
      items: [
        "Toàn bộ nội dung trong dự án được thu thập và xử lý một cách trung thực, không bịa đặt hay sao chép trái phép",
        "Mọi thông tin học thuật đều được kiểm chứng từ nguồn đáng tin cậy (Hiến pháp, văn kiện chính thức, giáo trình)",
        "Nhóm cam kết không sử dụng AI để thay thế hoàn toàn công việc mà chỉ sử dụng như công cụ hỗ trợ",
        "Tất cả output từ AI đều được review, chỉnh sửa, và kiểm tra kỹ lưỡng bởi các thành viên trong nhóm"
      ]
    },
    {
      category: "Đảm bảo",
      items: [
        "Đảm bảo tính chính xác của nội dung học thuật thông qua việc đối chiếu với tài liệu gốc",
        "Đảm bảo minh bạch về vai trò của AI trong quá trình phát triển dự án",
        "Đảm bảo mọi thành viên trong nhóm đều tham gia và đóng góp thực chất vào dự án",
        "Đảm bảo code được viết có chất lượng, maintainable, và tuân thủ best practices",
        "Đảm bảo trích dẫn và ghi nhận nguồn tham khảo một cách đầy đủ và chính xác"
      ]
    },
    {
      category: "Tuân thủ",
      items: [
        "Tuân thủ quy định về liêm chính học thuật của trường Đại học FPT",
        "Tuân thủ nguyên tắc sử dụng AI một cách có trách nhiệm và đạo đức",
        "Tuân thủ quy định về bảo vệ quyền tác giả và sở hữu trí tuệ",
        "Tuân thủ các tiêu chuẩn về chất lượng và yêu cầu của môn học MLN131",
        "Tuân thủ timeline và quy trình làm việc đã cam kết với giảng viên"
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>4. Cam kết liêm chính học thuật</h2>
      
      <div className={styles.commitmentList}>
        {commitments.map((commitment, idx) => (
          <div key={idx} className={styles.commitmentCategory}>
            <h3 className={styles.commitmentCategoryTitle}>{commitment.category}</h3>
            <ul className={styles.commitmentItems}>
              {commitment.items.map((item, itemIdx) => (
                <li key={itemIdx} className={styles.commitmentItem}>
                  <span className={styles.checkmark}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.signatureBox}>
        <p className={styles.signatureText}>
          Chúng tôi, các thành viên của nhóm, cam kết tuân thủ đầy đủ các nguyên tắc liêm chính học thuật nêu trên
          và chịu trách nhiệm hoàn toàn về tính trung thực của dự án này.
        </p>
        <div className={styles.signaturePlaceholder}>
          <p>[Chữ ký các thành viên nhóm]</p>
          <p>[Ngày tháng năm]</p>
        </div>
      </div>
    </section>
  );
};

// ===========================
// MAIN PAGE COMPONENT
// ===========================
export default function AcademicIntegrityPage() {
  const [activeSection, setActiveSection] = React.useState<number>(1);

  const sections = [
    { id: 1, title: "Công cụ AI", icon: "🤖" },
    { id: 2, title: "Kiểm chứng nguồn", icon: "📚" },
    { id: 3, title: "Ứng dụng sáng tạo", icon: "💡" },
    { id: 4, title: "Cam kết liêm chính", icon: "✓" }
  ];

  // Override body overflow for this page
  React.useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <a href="/" className={styles.backButton}>← Quay lại Game</a>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Báo cáo Liêm chính Học thuật</h1>
          <p className={styles.pageSubtitle}>
            Dự án: Bảo tàng Lịch sử - Game học tập về Nhà nước và Pháp luật
          </p>
          <p className={styles.courseName}>Môn học: MLN131 - Pháp luật đại cương</p>
        </div>
      </header>

      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`${styles.navItem} ${activeSection === section.id ? styles.navItemActive : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className={styles.navIcon}>{section.icon}</span>
              <span className={styles.navText}>{section.title}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className={styles.pageContent}>
        {activeSection === 1 && <Section1_AITools />}
        {activeSection === 2 && <Section2_SourceVerification />}
        {activeSection === 3 && <Section3_CreativeApplication />}
        {activeSection === 4 && <Section4_IntegrityCommitment />}
      </main>

      <footer className={styles.pageFooter}>
        <p>© 2026 - FPT University - Spring Semester</p>
        <a href="/" className={styles.backLink}>← Quay lại Game</a>
      </footer>
    </div>
  );
}
