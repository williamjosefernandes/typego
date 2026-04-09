package runtime

import "net/http"

type Router struct {
	mux *http.ServeMux
}

func NewRouter() *Router {
	return &Router{mux: http.NewServeMux()}
}

func (r *Router) Handle(path string, handler http.HandlerFunc) {
	r.mux.HandleFunc(path, handler)
}

func (r *Router) Handler() http.Handler {
	return r.mux
}

