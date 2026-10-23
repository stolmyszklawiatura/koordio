-- Koordio MySQL schema bootstrap
-- Target: MySQL 8.0+ (InnoDB, utf8mb4)
-- Creates the `koordio` database if it does not exist, then creates empty tables.
-- No demo users or passwords are inserted. Do not connect a browser directly to MySQL.

CREATE DATABASE IF NOT EXISTS `koordio`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `koordio`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `events` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `created_by_user_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `description` TEXT NULL,
  `location` VARCHAR(255) NULL,
  `event_date` DATE NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_events_creator` (`created_by_user_id`),
  CONSTRAINT `fk_events_creator`
    FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event_memberships` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `event_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `user_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NULL,
  `display_name` VARCHAR(100) NOT NULL,
  `role` ENUM('organizer', 'participant') NOT NULL DEFAULT 'participant',
  `joined_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_memberships_event_id_id` (`event_id`, `id`),
  UNIQUE KEY `uq_memberships_event_user` (`event_id`, `user_id`),
  KEY `ix_memberships_user` (`user_id`),
  CONSTRAINT `fk_memberships_event`
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `fk_memberships_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `event_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `author_membership_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `title` VARCHAR(160) NOT NULL,
  `body` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_announcements_event_id_id` (`event_id`, `id`),
  KEY `ix_announcements_event_created` (`event_id`, `created_at`),
  CONSTRAINT `fk_announcements_event`
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `fk_announcements_author_membership`
    FOREIGN KEY (`event_id`, `author_membership_id`)
    REFERENCES `event_memberships` (`event_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `event_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `created_by_membership_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `title` VARCHAR(160) NOT NULL,
  `description` TEXT NULL,
  `due_date` DATE NULL,
  `status` ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tasks_event_id_id` (`event_id`, `id`),
  KEY `ix_tasks_event_status` (`event_id`, `status`),
  CONSTRAINT `fk_tasks_event`
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `fk_tasks_creator_membership`
    FOREIGN KEY (`event_id`, `created_by_membership_id`)
    REFERENCES `event_memberships` (`event_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `task_assignees` (
  `task_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `event_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `membership_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  PRIMARY KEY (`task_id`, `membership_id`),
  KEY `ix_task_assignees_membership` (`membership_id`),
  CONSTRAINT `fk_task_assignees_task`
    FOREIGN KEY (`event_id`, `task_id`)
    REFERENCES `tasks` (`event_id`, `id`),
  CONSTRAINT `fk_task_assignees_membership`
    FOREIGN KEY (`event_id`, `membership_id`)
    REFERENCES `event_memberships` (`event_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expenses` (
  `id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `event_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `paid_by_membership_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `description` VARCHAR(200) NOT NULL,
  `amount_minor` BIGINT UNSIGNED NOT NULL COMMENT 'Amount in the smallest currency unit, e.g. grosze for PLN',
  `currency` CHAR(3) NOT NULL DEFAULT 'PLN',
  `spent_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Store UTC; convert for display in the app',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_expenses_event_id_id` (`event_id`, `id`),
  KEY `ix_expenses_event_spent` (`event_id`, `spent_at`),
  CONSTRAINT `fk_expenses_event`
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `fk_expenses_payer_membership`
    FOREIGN KEY (`event_id`, `paid_by_membership_id`)
    REFERENCES `event_memberships` (`event_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `expense_shares` (
  `expense_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `event_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `membership_id` CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `share_amount_minor` BIGINT UNSIGNED NOT NULL COMMENT 'This member share in the smallest currency unit',
  PRIMARY KEY (`expense_id`, `membership_id`),
  KEY `ix_expense_shares_membership` (`membership_id`),
  CONSTRAINT `fk_expense_shares_expense`
    FOREIGN KEY (`event_id`, `expense_id`)
    REFERENCES `expenses` (`event_id`, `id`),
  CONSTRAINT `fk_expense_shares_membership`
    FOREIGN KEY (`event_id`, `membership_id`)
    REFERENCES `event_memberships` (`event_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Keep multi-step expense writes (expense + all shares) in one transaction.
-- The backend must validate that shares sum to amount_minor and enforce role access.
-- Rows are intentionally not deleted by cascading foreign keys; preserve financial history.


