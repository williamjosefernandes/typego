package runtime

import (
	"log"
	"net/http"
)

func Start(addr string, handler http.Handler) error {
	log.Printf("TypeGo Go runtime listening on %s", addr)
	return http.ListenAndServe(addr, handler)
}

