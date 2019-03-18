-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 11.03.2019 klo 22:17
-- Palvelimen versio: 10.1.37-MariaDB
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cottagedb`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `sensors`
--

CREATE TABLE `sensors` (
  `id` int(11) NOT NULL,
  `sensor_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `temp_description` text NOT NULL,
  `hum_description` text NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Vedos taulusta `sensors`
--

INSERT INTO `sensors` (`id`, `sensor_name`, `password`, `description`, `temp_description`, `hum_description`, `created`) VALUES
(1, 'temp_sensor_1', '$2b$10$MvSuROhzxAjtQ7mGYWzjEei5zsG5cVyeVvPGwwO98pPNelbsOYFre', 'DHT anturi keittiö', 'lämpötila keittiö', 'kosteus keittiö', '2019-02-02 23:25:47'),
(2, 'temp_sensor_2', '$2b$10$ZycHDxke5pmUytUtxzMhvuX26a/hFuqdSITj9gTkjM9jzhBeFK2be', 'DHT anturi olohuone', 'lämpötila olohuone', 'kosteus olohuone', '2019-02-07 17:07:55'),
(3, 'temp_sensor_3', '$2b$10$dLdB9V83VBlZ79PSsNS0u.uKcimD0KIIYGHI/o0qm4athpQCxJfOq', 'DHT anturi makuuhuone', 'lämpötila makuuhuone', 'kosteus makuuhuone', '2019-02-15 22:45:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sensors`
--
ALTER TABLE `sensors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sensors`
--
ALTER TABLE `sensors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
