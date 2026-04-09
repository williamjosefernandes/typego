import type { GoControllerIR } from "./transformer.js";

function escapeGoStringLiteral(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"");
}

function buildHandlerBody(functionName: string, responseBody: string): string {
  const escapedBody = escapeGoStringLiteral(responseBody);
  return `func ${functionName}(w http.ResponseWriter, r *http.Request) {\n\tw.Header().Set(\"content-type\", \"application/json\")\n\t_, _ = w.Write([]byte(\"${escapedBody}\"))\n}`;
}

function buildRouteRegistrations(controllers: GoControllerIR[]): string {
  return controllers
    .flatMap((controller) =>
      controller.routes.map(
        (route) =>
          `\tmux.HandleFunc(\"${route.path}\", func(w http.ResponseWriter, r *http.Request) {\n\t\tif r.Method != \"${route.method}\" {\n\t\t\thttp.Error(w, \"method not allowed\", http.StatusMethodNotAllowed)\n\t\t\treturn\n\t\t}\n\t\t${route.functionName}(w, r)\n\t})`
      )
    )
    .join("\n\n");
}

export function generateGoSource(controllers: GoControllerIR[]): string {
  const handlers = controllers
    .flatMap((controller) =>
      controller.routes.map((route) => buildHandlerBody(route.functionName, route.responseBody))
    )
    .join("\n\n");

  const routeRegistrations = buildRouteRegistrations(controllers);

  return `package main

import (
\t\"log\"
\t\"net/http\"
)

${handlers}

func main() {
\tmux := http.NewServeMux()
${routeRegistrations}

\tlog.Println(\"TypeGo Go runtime listening on :8080\")
\tif err := http.ListenAndServe(\":8080\", mux); err != nil {
\t\tlog.Fatal(err)
\t}
}
`;
}
