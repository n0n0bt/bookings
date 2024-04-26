package models

import "github.com/n0n0bt/bookings/internal/forms"

// TemplateData is a shared struct used for rendering templates
type TemplateData struct {
	StringMap map[string]string
	IntMap    map[string]int
	FloatMap  map[string]float32
	Data      map[string]interface{}
	CSRFToken string
	Flash     string
	Warning   string
	Error     string
	Form      *forms.Form
	IsAuthenticated int
}
