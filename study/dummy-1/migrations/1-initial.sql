-- Up
create table member (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    mark TEXT,
    note TEXT
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