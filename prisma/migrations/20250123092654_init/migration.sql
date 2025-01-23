-- CreateTable
CREATE TABLE `Anime` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `alias` JSON NOT NULL,
    `description` TEXT NULL,
    `cover` VARCHAR(255) NULL,
    `startUpdateTime` DATETIME(0) NOT NULL,
    `isSerializing` BOOLEAN NOT NULL,
    `isCompleted` BOOLEAN NOT NULL,
    `totalEpisodes` INTEGER NOT NULL,
    `currentEpisode` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Anime_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Episode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `airDate` DATE NOT NULL,
    `episodeNumber` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `duration` INTEGER NULL,
    `synopsis` TEXT NULL,
    `isPostponed` BOOLEAN NULL,
    `notes` TEXT NULL,
    `videoUrl` VARCHAR(255) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `animeId` INTEGER NOT NULL,

    INDEX `Episode_animeId_idx`(`animeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animeId` INTEGER NOT NULL,
    `platform` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Schedule_animeId_idx`(`animeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Episode` ADD CONSTRAINT `Episode_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_animeId_fkey` FOREIGN KEY (`animeId`) REFERENCES `Anime`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
