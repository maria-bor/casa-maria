USE `casa-maria`;
DROP DATABASE `casa-maria`;
CREATE DATABASE `casa-maria` /*!40100 COLLATE 'utf8_polish_ci' */;
USE `casa-maria`;

CREATE TABLE Role (
                idRole INT AUTO_INCREMENT NOT NULL,
                name VARCHAR(50) NOT NULL,
                PRIMARY KEY (idRole)
);


CREATE TABLE User (
                idUser INT AUTO_INCREMENT NOT NULL,
                surname VARCHAR(50) NOT NULL,
                name VARCHAR(50) NOT NULL,
                email VARCHAR(50) NOT NULL,
                PRIMARY KEY (idUser)
);


CREATE TABLE UserLogged (
                idUserLogged INT AUTO_INCREMENT NOT NULL,
                idUser INT NOT NULL,
                password VARCHAR(255) NOT NULL,
                activated BIT NOT NULL COMMENT '0=NO, 1=YES',
                activation_code VARCHAR(264) NOT NULL,
                created_at DATETIME NOT NULL,
                modified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                isDeleted BIT DEFAULT 0,
                PRIMARY KEY (idUserLogged)
);


CREATE TABLE Offer (
                idOffer INT AUTO_INCREMENT NOT NULL,
                name VARCHAR(50) NOT NULL,
                date_from DATE NOT NULL,
                date_to DATE NOT NULL,
                idUserLogged INT NOT NULL,
                isDeleted BIT DEFAULT 0,
                PRIMARY KEY (idOffer)
);


CREATE TABLE Type (
                idType INT AUTO_INCREMENT NOT NULL,
                name VARCHAR(50) NOT NULL,
				description VARCHAR(1024) NOT NULL,
                idUserLogged INT NOT NULL,
                PRIMARY KEY (idType)
);


CREATE TABLE UserRole (
                idUserLogged INT NOT NULL,
                idRole INT NOT NULL,
                PRIMARY KEY (idUserLogged, idRole)
);


CREATE TABLE Room (
                idRoom INT AUTO_INCREMENT NOT NULL,
                nrRoom VARCHAR(50) NOT NULL,
                floor TINYINT NOT NULL,
                sleeps TINYINT NOT NULL,
                idType INT NOT NULL,
                idUserLogged INT NOT NULL,
                isDeleted BIT DEFAULT 0,
                PRIMARY KEY (idRoom)
);


CREATE TABLE Room_Offer (
                idOffer INT NOT NULL,
                idRoom INT NOT NULL,
                price INT NOT NULL,
                isDeleted BIT DEFAULT 0,
                PRIMARY KEY (idOffer, idRoom)
);


CREATE TABLE Booking (
                idBooking INT AUTO_INCREMENT NOT NULL,
                idUser INT NOT NULL,
                idRoom INT NOT NULL,
                date_from DATE NOT NULL,
                date_to DATE NOT NULL,
                price INT NOT NULL,
                guests TINYINT NOT NULL,
                isDeleted BIT DEFAULT 0,
                PRIMARY KEY (idBooking)
);


ALTER TABLE UserRole ADD CONSTRAINT role_userrole_fk
FOREIGN KEY (idRole)
REFERENCES Role (idRole)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Booking ADD CONSTRAINT user_booking_fk
FOREIGN KEY (idUser)
REFERENCES User (idUser)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE UserLogged ADD CONSTRAINT user_userlogged_fk
FOREIGN KEY (idUser)
REFERENCES User (idUser)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE UserRole ADD CONSTRAINT userlogged_userrole_fk
FOREIGN KEY (idUserLogged)
REFERENCES UserLogged (idUserLogged)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Room ADD CONSTRAINT userlogged_room_fk
FOREIGN KEY (idUserLogged)
REFERENCES UserLogged (idUserLogged)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Type ADD CONSTRAINT userlogged_type_fk
FOREIGN KEY (idUserLogged)
REFERENCES UserLogged (idUserLogged)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Offer ADD CONSTRAINT userlogged_offer_fk
FOREIGN KEY (idUserLogged)
REFERENCES UserLogged (idUserLogged)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Room_Offer ADD CONSTRAINT offer_room_offer_fk
FOREIGN KEY (idOffer)
REFERENCES Offer (idOffer)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Room ADD CONSTRAINT type_room_fk
FOREIGN KEY (idType)
REFERENCES Type (idType)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Booking ADD CONSTRAINT room_booking_fk
FOREIGN KEY (idRoom)
REFERENCES Room (idRoom)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE Room_Offer ADD CONSTRAINT room_room_offer_fk
FOREIGN KEY (idRoom)
REFERENCES Room (idRoom)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

INSERT INTO `role` (`idRole`, `name`) VALUES
	(1, 'admin'),
	(2, 'user_logged'),
    (3, 'user_unlogged');