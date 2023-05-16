import { QRCodeSVG } from "solid-qr-code";
import { A, useParams } from "solid-start";

const baseUrl = import.meta.env.VITE_VERCEL_URL;

export default function QRCode() {
  const params = useParams<{ code: string }>();

  return (
    <div
      style={{
        display: "flex",
        "flex-direction": "column",
        "align-items": "center",
        padding: "16px",
        "justify-content": "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          position: "absolute",
          top: "20px",
          left: "20px",
        }}
      >
        <A href={`/session/${params.code}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
            color="black"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </A>
      </div>
      <QRCodeSVG
        value={`https://${baseUrl}/session/${params.code}`}
        size={128}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        includeMargin={false}
        imageSettings={{
          src: "https://static.zpao.com/favicon.png",
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
        }}
      />
    </div>
  );
}
