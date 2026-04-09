import type { GoControllerIR } from "./transformer.js";

function escapeGoStringLiteral(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}

function buildHandlerBody(functionName: string, responseBody: string): string {
  const escapedBody = escapeGoStringLiteral(responseBody);
  return `func ${functionName}(w http.ResponseWriter, r *http.Request) {\n\tw.Header().Set(\"content-type\", \"application/json\")\n\t_, _ = w.Write([]byte(\"${escapedBody}\"))\n}`;
}

function buildRouteRegistrations(controllers: GoControllerIR[]): string {
  const routesByPath = new Map<string, Array<{ method: string; functionName: string }>>();

  for (const controller of controllers) {
    for (const route of controller.routes) {
      const existing = routesByPath.get(route.path) ?? [];
      existing.push({ method: route.method, functionName: route.functionName });
      routesByPath.set(route.path, existing);
    }
  }

  return [...routesByPath.entries()]
    .map(([routePath, handlers]) => {
      const methodSwitch = handlers
        .map((entry) => `\t\tcase \"${entry.method}\":\n\t\t\t${entry.functionName}(w, r)\n\t\t\treturn`)
        .join("\n");

      return `\tmux.HandleFunc(\"${routePath}\", func(w http.ResponseWriter, r *http.Request) {\n\t\tswitch r.Method {\n${methodSwitch}\n\t\tdefault:\n\t\t\thttp.Error(w, \"method not allowed\", http.StatusMethodNotAllowed)\n\t\t}\n\t})`;
    })
    .join("\n\n");
}

export function generateGoSource(controllers: GoControllerIR[], defaultPort = 8080): string {
  const handlers = controllers
    .flatMap((controller) =>
      controller.routes.map((route) => buildHandlerBody(route.functionName, route.responseBody))
    )
    .join("\n\n");

  const routeRegistrations = buildRouteRegistrations(controllers);

  return `package main

import (
\t"fmt"
\t"log"
\t"net/http"
\t"os"
)

${handlers}

func main() {
\tport := os.Getenv("PORT")
\tif port == "" {
\t\tport = "${defaultPort}"
\t}
\taddr := fmt.Sprintf(":%s", port)

\tmux := http.NewServeMux()
${routeRegistrations}

\tlog.Printf("TypeGo Go runtime listening on %s", addr)
\tif err := http.ListenAndServe(addr, mux); err != nil {
\t\tlog.Fatal(err)
\t}
}
`;
}
