<?php
if (file_exists('./utilities/configDev.php')) {
  require_once "./utilities/configDev.php";
} else {
  require_once "./utilities/config.php";
}

require_once "./utilities/types.php";
require_once "./utilities/db.php";
require_once "./utilities/rest.php";
require_once "./utilities/surveys.php";
require_once "./utilities/session.php";
