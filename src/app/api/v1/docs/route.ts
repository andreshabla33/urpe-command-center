import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  url: "/api/v1/openapi.json",
  theme: "purple" as const,
  hideClientButton: false,
  metaData: {
    title: "URPE Command Center · API v1 Docs",
    description:
      "Public API para automatizar tareas desde scripts, bots y agentes IA.",
  },
});
