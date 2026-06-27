import { column, Schema, Table } from "@powersync/web";

export const postsTable = new Table(
  {
    uuid: column.text,
    content: column.text,
    author_id: column.text,
    author_entity_id: column.text,
    town_uuid: column.text,
    created_at: column.text,
    images: column.text,
    image_url: column.text,
    type: column.text,
    author_name: column.text,
    bategats_count: column.integer,
    language: column.text,
    // Add other matching columns from Supabase 'posts' table required by UniversalCard
  },
  { indexes: { town: ["town_uuid"] } },
);

export const bategatsTable = new Table(
  {
    post_uuid: column.text,
    user_id: column.text,
    action: column.text,
    delta: column.integer,
    vector_clock: column.text,
  },
  { indexes: { post: ["post_uuid"] } },
);

export const townsTable = new Table({
  id: column.text,
  name: column.text,
  uuid: column.text,
});

export const AppSchema = new Schema({
  posts: postsTable,
  bategats: bategatsTable,
  towns: townsTable,
});
