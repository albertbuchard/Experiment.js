<?php
/* =============== DB UTILS =============== */
function connect_to_db() {
  try {
    // if you use a local server you need to use hostname found in db and crate a new user
    // with all privileges on that hostname
    // http://stackoverflow.com/questions/4093603/how-do-i-find-out-my-mysql-url-host-port-and-username
    // http://stackoverflow.com/questions/1559955/host-xxx-xx-xxx-xxx-is-not-allowed-to-connect-to-this-mysql-server
      return get_db_connection($GLOBALS['DB_HOST'], $GLOBALS['DB_NAME'], $GLOBALS['DB_USER'], $GLOBALS['DB_PASS']);
  } catch (Exception $e) {
    throw $e;
  }
}

function get_db_connection($host, $dbname, $username, $password, $port = 3306)
{
  $connect_string = "mysql:host=" . $host . ";port=" . $port . ";dbname=" . $dbname . ";";
  $bdd = null;
  try {
    $bdd = new PDO($connect_string, $username, $password);
  } catch (Exception $e) {
    throw new Exception('get_db_connection : ' . $e->getMessage());
  }
  return $bdd;
}

function pdo_ping($bdd)
{
  try {
    $bdd->query('SELECT 1');
  } catch (PDOException $e) {
    return false;
  }
  return true;
}
