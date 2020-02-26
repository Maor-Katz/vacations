CREATE DATABASE vacations;

CREATE TABLE Users (
    id int auto_increment,
    firstname varchar(255),
    lastname varchar(255),
    username varchar(255),
    password varchar(255),
    isAdmin bool,
    primary key(id)
);
--password for users below is 123
INSERT INTO Users (firstname, lastname, username, password, isAdmin)
VALUES ("maor", "katz", "maorkatz", "'$2a$10$jn86lR6PAD6wd6Wrb8KuS.tUh.8cBetYIAfwF5mUR9BpZScie5qKu'", true),
("ma", "ka", "maorka", "'$2a$10$jn86lR6PAD6wd6Wrb8KuS.tUh.8cBetYIAfwF5mUR9BpZScie5qKu'", false)

CREATE TABLE Vacation (
    id int auto_increment,
    description text,
    destination varchar(255),
    img_url text,
    dates varchar(255),
    price DECIMAL(10,4), -- 10 digits total, 4 digits after the point
    followers int,
    primary key(id)
);

INSERT INTO Vacation (description, destination, img_url, dates, price, followers)
VALUES ("6 nights, all includes, includes trip", "Singapore", "https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Falexcapri%2Ffiles%2F2018%2F09%2FSingapore-1200x800.jpg", "10.4-17.4", 500, 1),
("2 nights with breakfast and shipping", "Eilat", "https://www.elal.com/magazine/wp-content/uploads/2016/10/eilat-bay_806.jpg", "10.12-13.4", 101.5, 0),
("1 month, Koh phangan,Koh phiphi,Koh Samui", "Thailand", "https://www.traveldailymedia.com/assets/2018/09/Phuket-Thailand.jpg", "20.9-20.10", 1200.2, 2)

CREATE TABLE Follow (
    id int auto_increment,
    user_id int,
    vacation_id int,
    primary key(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (vacation_id) REFERENCES Vacation(id)
);

INSERT INTO Follow (user_id, vacation_id)
VALUES (1, 1),
(1, 3),
(2, 3)
