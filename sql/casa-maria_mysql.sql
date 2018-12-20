CREATE TABLE `User` (
                `id` INT AUTO_INCREMENT NOT NULL,
                `surname` VARCHAR(50) NOT NULL,
                `name` VARCHAR(50) NOT NULL,
                `email` VARCHAR(50) NOT NULL,
                PRIMARY KEY (`id`)
);

CREATE TABLE `UserLogged` (
                `id` INT AUTO_INCREMENT NOT NULL,
                `password` INT NOT NULL,
                `id_user` INT NOT NULL,
                PRIMARY KEY (`id`)
);

CREATE TABLE `Admin` (
                `id` INT AUTO_INCREMENT NOT NULL,
                `password` INT NOT NULL,
                `id_user` INT NOT NULL,
                PRIMARY KEY (`id`)
);

CREATE TABLE `Type` (
                `id` INT AUTO_INCREMENT NOT NULL,
                `name` VARCHAR(50) NOT NULL,
                `id_admin` INT NOT NULL,
                PRIMARY KEY (`id`)
);

CREATE TABLE `Offer` (
                `id` INT AUTO_INCREMENT NOT NULL,
                `name` VARCHAR(50) NOT NULL,
                `description` VARCHAR(1024) NOT NULL,
                `date_from` DATE NOT NULL,
                `date_to` DATE NOT NULL,
                `id_admin` INT NOT NULL,
                PRIMARY KEY (`id`)
);

CREATE TABLE `Room` (
                `id` INT NOT NULL,
                `sleeps` INT NOT NULL,
                `floor` INT NOT NULL,
                `id_type` INT NOT NULL,
                `id_admin` INT NOT NULL,
                PRIMARY KEY (`id`)
);

CREATE TABLE `RoomOffer` (
                `id_offer` INT NOT NULL,
                `id_room` INT NOT NULL,
                `price` DOUBLE PRECISION NOT NULL,
                PRIMARY KEY (`id_offer`, `id_room`)
);

CREATE TABLE `Booking` (
                `id_room` INT NOT NULL,
                `id_user` INT NOT NULL,
                `date_from` DATE NOT NULL,
                `date_to` DATE NOT NULL,
                `price` DOUBLE PRECISION NOT NULL,
                `guests` INT NOT NULL,
                PRIMARY KEY (`id_room`, `id_user`)
);

ALTER TABLE `Admin` ADD CONSTRAINT `user_admin_fk`
FOREIGN KEY (`id_user`)
REFERENCES User (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `UserLogged` ADD CONSTRAINT `user_user_logged_fk`
FOREIGN KEY (`id_user`)
REFERENCES User (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `Booking` ADD CONSTRAINT `user_booking_fk`
FOREIGN KEY (`id_user`)
REFERENCES User (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `Offer` ADD CONSTRAINT `admin_offer_fk`
FOREIGN KEY (`id_admin`)
REFERENCES Admin (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `Room` ADD CONSTRAINT `admin_room_fk`
FOREIGN KEY (`id_admin`)
REFERENCES Admin (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `Type` ADD CONSTRAINT `admin_type_fk`
FOREIGN KEY (`id_admin`)
REFERENCES Admin (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `Room` ADD CONSTRAINT `typeroom_room_fk`
FOREIGN KEY (`id_type`)
REFERENCES Type (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `RoomOffer` ADD CONSTRAINT `offer_room_offer_fk`
FOREIGN KEY (`id_offer`)
REFERENCES Offer (`id`)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `Booking` ADD CONSTRAINT `room_booking_fk`
FOREIGN KEY (`id_room`)
REFERENCES `Room` (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;

ALTER TABLE `RoomOffer` ADD CONSTRAINT `room_room_offer_fk`
FOREIGN KEY (id_room)
REFERENCES Room (id)
ON DELETE NO ACTION
ON UPDATE NO ACTION;
