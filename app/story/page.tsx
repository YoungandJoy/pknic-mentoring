// 인스타 스토리 캡쳐 전용 페이지 (9:16 = 1080x1920)
// 모바일 사파리/크롬에서 이 URL 열고 스크린샷 → 인스타 스토리에 바로 업로드

export const metadata = { title: "PKNIC Mentoring · Story" };

export default function StoryPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="story"
        style={{
          width: "100vw",
          aspectRatio: "9/16",
          maxHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse at top, #0F2A22 0%, #0A0F1C 50%, #0A0F1C 100%)",
          color: "#E5E7EB",
          padding: "11vh 8vw 6vh",
          display: "flex",
          flexDirection: "column",
          fontFamily:
            "'Pretendard','Apple SD Gothic Neo','Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif",
          fontSmooth: "antialiased",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            width: "65vw",
            height: "65vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(16,185,129,0) 60%)",
            top: "-15vw",
            right: "-15vw",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "55vw",
            height: "55vw",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0) 60%)",
            bottom: "-10vw",
            left: "-15vw",
            pointerEvents: "none",
          }}
        />

        {/* top brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5vw",
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: "5.5vw",
              height: "5.5vw",
              borderRadius: "1.4vw",
              background: "linear-gradient(135deg,#10B981,#059669)",
              color: "#0A0F1C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "2.4vw",
              letterSpacing: "-0.05em",
            }}
          >
            PK
          </div>
          <div
            style={{
              fontSize: "2.5vw",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            PKNIC <span style={{ color: "#9CA3AF", fontWeight: 500 }}>Mentoring</span>
          </div>
        </div>

        {/* badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "1.2vw",
            padding: "1.3vw 2.4vw",
            borderRadius: "999px",
            background: "rgba(16,185,129,0.12)",
            border: "1.5px solid rgba(16,185,129,0.45)",
            color: "#34D399",
            fontSize: "2.4vw",
            fontWeight: 700,
            letterSpacing: "0.02em",
            marginTop: "13vh",
            alignSelf: "flex-start",
            zIndex: 2,
          }}
        >
          <span
            style={{
              width: "1vw",
              height: "1vw",
              borderRadius: "50%",
              background: "#34D399",
              boxShadow: "0 0 2vw #34D399",
            }}
          />
          2026 PILOT 시작
        </div>

        {/* headline */}
        <h1
          style={{
            fontSize: "12vw",
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            fontWeight: 900,
            marginTop: "4vh",
            zIndex: 2,
          }}
        >
          Don&apos;t navigate
          <br />
          your career
          <br />
          <span
            style={{
              background: "linear-gradient(135deg,#10B981,#6EE7B7)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            alone.
          </span>
        </h1>

        {/* subtitle */}
        <div
          style={{
            marginTop: "5vh",
            fontSize: "3.4vw",
            lineHeight: 1.45,
            color: "#C7CDD6",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            zIndex: 2,
          }}
        >
          북미 현직자 ↔ 북미·한국 학생을
          <br />
          잇는{" "}
          <b style={{ color: "#fff", fontWeight: 700 }}>1:1 멘토링 파일럿</b>을
          <br />
          준비하고 있어요.
        </div>

        {/* pills */}
        <div
          style={{
            display: "flex",
            gap: "1.5vw",
            marginTop: "5vh",
            flexWrap: "wrap",
            zIndex: 2,
          }}
        >
          {["📋  5분 수요조사", "🎯  본인 위치 시각화"].map((p) => (
            <div
              key={p}
              style={{
                padding: "1.5vw 2.6vw",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
                border: "1.5px solid rgba(255,255,255,0.08)",
                fontSize: "2.4vw",
                fontWeight: 600,
                color: "#E5E7EB",
              }}
            >
              {p}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* CTA */}
        <div
          style={{
            zIndex: 2,
            borderRadius: "3.3vw",
            padding: "4.5vw 5vw",
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(16,185,129,0.06))",
            border: "2px solid rgba(16,185,129,0.55)",
          }}
        >
          <div
            style={{
              fontSize: "2.2vw",
              color: "#6EE7B7",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "1.6vw",
            }}
          >
            ▸ 지금 참여하기
          </div>
          <div
            style={{
              fontSize: "3.8vw",
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "2vw",
            }}
          >
            설문 5분이면 충분합니다.
          </div>
          <div
            style={{
              fontSize: "3.3vw",
              fontWeight: 700,
              color: "#34D399",
              letterSpacing: "-0.01em",
              wordBreak: "break-all",
            }}
          >
            pknic-mentoring.vercel.app
          </div>
        </div>

        <div
          style={{
            marginTop: "3vh",
            fontSize: "2vw",
            color: "#9CA3AF",
            textAlign: "center",
            zIndex: 2,
            letterSpacing: "0.02em",
          }}
        >
          © 2026 PKNIC Mentoring · Connecting NA seniors with students
        </div>
      </div>
    </main>
  );
}
