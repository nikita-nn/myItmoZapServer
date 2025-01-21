import { refreshAccessToken } from "../auth/authService";
import { urlData } from "../../settings";
import QRCode from "qrcode";

export const getQRImage = async (isu_id: string) => {
  const token = await refreshAccessToken(isu_id);

  const res = await fetch(urlData.getQR, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return false;
  }

  const json = await res.json();
  const options = {
    width: 500,
    height: 500,
  };

  const code = await QRCode.toDataURL(json.response.qr_hex, options);
  return { qrCode: code };
};
