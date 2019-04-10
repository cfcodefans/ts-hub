-- Up
create table member (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    mark TEXT UNIQUE,
    note TEXT,
    time INTEGER
);

create table records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER,
    time INTEGER,
    mark TEXT,
    note TEXT
);
-- Down
DROP TABLE member;
DROP TABLE records;