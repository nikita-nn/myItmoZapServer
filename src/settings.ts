import "dotenv/config";

export const dbConnectionString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST || "localhost"}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB}`;

export const urlData = {
  signUrl: "https://my.itmo.ru/api/sport/sign/schedule/lessons",
  tokenUrl: "https://id.itmo.ru/auth/realms/itmo/protocol/openid-connect/token",
  dashboardUrl: "https://my.itmo.ru/api/system/dashboard",
  myItmo: "https://my.itmo.ru",
  lessonsData: "https://my.itmo.ru/api/sport/sign/schedule/filters",
  fullLessonsData: "https://my.itmo.ru/api/sport/sign/schedule",
  electionGetDisciplines:
    "https://dev.my.itmo.su/api/election/students/available_disciplines",
  getQR: "https://qr.itmo.su/v1/user/pass",
};
