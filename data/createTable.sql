-- On demarre une transaction afin de s'assurer de la cohérence globale de la BDD
BEGIN;

-- D'abord on supprime les tables si elles existent
DROP TABLE IF EXISTS "card_has_tag", "card", "list", "tag";

-- 1ère table
CREATE TABLE "list" (
  -- on utilise le nouveau type qui est un standart SQL alors que SERIAL est un pseudo-type de PG
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL DEFAULT '',
  "position" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2ème table
CREATE TABLE "card" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" TEXT NOT NULL DEFAULT '',
  "position" INTEGER NOT NULL DEFAULT 0,
  "color" TEXT NOT NULL DEFAULT '#FFF',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Notre colonne list_id référencera la colonne id de notre table list
  -- Le ON DELETE CASCADE, permet dans le cas de la suppression d'une liste ayant des cartes de supprimer également les cartes qui lui son associer
  "list_id" INTEGER NOT NULL REFERENCES "list"("id") ON DELETE CASCADE
);

-- 3ème table
CREATE TABLE "tag" (
  "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL DEFAULT '',
  "color" TEXT NOT NULL DEFAULT '#F0F',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE "card_has_tag" (
  "card_id" INTEGER NOT NULL REFERENCES "card"("id") ON DELETE CASCADE,
  "tag_id" INTEGER NOT NULL REFERENCES "tag"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO "list" ("name", "position") VALUES
('A manger', 1),
('A boire', 2),
('A NE JAMAIS MANGER', 3);

INSERT INTO "card" ("title", "position", "list_id") VALUES
('Maroille', 1, 1),
('Raclette', 2, 1),
('Pizza', 3, 1),
('Tout ce qu''il y a avec du fromage (sauf le chèvre et le bleu)', 3, 1),
('Eau', 1, 2),
('Bière', 2, 2),
('Endives', 1, 3),
('Boudin noir', 2, 3),
('Chou bruxelles', 3, 3);

INSERT INTO "tag" ("name", "color") VALUES 
('fromage', '#fff696'),
('végé', '#2ecc71'),
('sans alcool', '#4BA3C3');

--  On oublie pas de lier nos tags avec nos cartes
INSERT INTO "card_has_tag" ("card_id", "tag_id") VALUES
(1, 1),
(2, 1),
(1, 2),
(5, 3);

-- Ensuite on créer nos tables
COMMIT;
