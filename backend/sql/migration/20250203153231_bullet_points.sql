-- +goose Up
-- +goose StatementBegin
CREATE TABLE bullet_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data VARCHAR NOT NULL DEFAULT '',
  sort_value INT NOT NULL,
  data_points_id UUID NOT NULL REFERENCES data_points(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE bullet_points;
-- +goose StatementEnd
