package user

import "backend/internal/repo"

type UserRepository struct{}

func NewResumeRepository() *UserRepository

var _ repo.UserRepo = (*UserRepository)(nil)
