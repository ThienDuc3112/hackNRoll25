-- +goose Up
-- +goose StatementBegin
CREATE TABLE data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  heading VARCHAR NOT NULL DEFAULT '',
  job_title VARCHAR NOT NULL DEFAULT '',
  date_range VARCHAR NOT NULL DEFAULT '',
  description VARCHAR NOT NULL DEFAULT '',
  is_single_point BOOLEAN NOT NULL DEFAULT FALSE,
  sort_value INT NOT NULL,
  section_id UUID NOT NULL REFERENCES sections(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE data_points;
-- +goose StatementEnd
