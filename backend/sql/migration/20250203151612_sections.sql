-- +goose Up
-- +goose StatementBegin
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  name VARCHAR NOT NULL,
  sort_value INT NOT NULL,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE sections;
-- +goose StatementEnd
