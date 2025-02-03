package resume

import "backend/internal/repo"

type ResumeRepository struct{}

func NewResumeRepository() *ResumeRepository

var _ repo.ResumeRepo = (*ResumeRepository)(nil)
