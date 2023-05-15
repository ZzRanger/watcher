import { QRCodeSVG } from "solid-qr-code";
import { useParams } from "solid-start";

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
      }}
    >
      <QRCodeSVG
        value={`${baseUrl}/session/${params.code}`}
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
