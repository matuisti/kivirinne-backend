--
-- Table structure for table `air_sensor_data`
--

CREATE TABLE `air_sensor_data` (
  `id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `time` timestamp NOT NULL,
  `temperature` float NOT NULL,
  `humidity` float NOT NULL,
  `voltage` float NOT NULL,
  `awake_time` float NOT NULL
) ENGINE=InnoDB;

ALTER TABLE `air_sensor_data`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `air_sensor_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

ALTER TABLE `air_sensor_data`
  ADD CONSTRAINT `air_sensor_data-sensors` FOREIGN KEY (device_id) REFERENCES sensors (id);
