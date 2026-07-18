import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/env/production-config";

export default function robots(): MetadataRoute.Robots {
  const base = getAppUrl().replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/*/dashboard",
        "/*/dashboard/",
        "/*/empresa/painel",
        "/*/empresa/painel/",
        "/*/entrar",
        "/*/cadastrar",
        "/*/recuperar-senha",
        "/*/redefinir-senha",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
