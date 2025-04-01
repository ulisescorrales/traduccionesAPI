START TRANSACTION;
--User account table
CREATE TABLE user{
    id_user SERIAL PRIMARY KEY,
    user_name VARCHAR(100), 
    password VARCHAR(255),
    email VARCHAR(320),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login DATE,
    status_account VARCHAR(10) CHECK (status_account IN ('active', 'inactive'))
};

--General table for translations (only queries for the user)
CREATE TABLE translation_en_es (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lexentry VARCHAR(130),
    word VARCHAR(120) NOT NULL,
    sense VARCHAR(170),
    translate VARCHAR(225) NOT NULL,
    INDEX word_search(word)
);
--Personal dictionary table for the user
CREATE TABLE dictionary_user(
    id_user LONG,
    language_origin VARCHAR(2) CHECK (language_origin IN ('en', 'es')),
    language_target VARCHAR(2) CHECK (language_target IN ('en', 'es')),
    created_at DATE DEFAULT CURRENT_DATE,
    last_update DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_user) REFERENCES user(id_user),
);
--Table for words that the user has added to their personal dictionary
CREATE TABLE words_user(
    id_user LONG,
    id_word LONG PRYMARY KEY,
    word VARCHAR(120) NOT NULL,
    sense VARCHAR(170),
    definitions VARCHAR(170) DEFAULT NULL,
    pasive_play BOOLEAN DEFAULT TRUE,
    active_play BOOLEAN DEFAULT TRUE,
   --AQUÍ 
    FOREIGN KEY (id_user) REFERENCES user(id_user) ON DELETE CASCADE,
    INDEX id_user;
);
CREATE TABLE translate(
    translate VARCHAR (120) NOT NULL,
    id_word LONG,
    FOREIGN KEY (id_word) REFERENCES words_user(id_word) ON DELETE CASCADE,
    PRIMARY KEY (translate, id_word), 
)

SOURCE ./insert.sql;
COMMIT;