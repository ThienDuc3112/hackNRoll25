-- +goose Up
-- +goose StatementBegin
CREATE TABLE resume_extra_infos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data VARCHAR NOT NULL DEFAULT '',
  resume_id UUID NOT NULL REFERENCES resumes(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE resume_extra_infos;
-- +goose StatementEnd
