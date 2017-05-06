<?php
/* ==== REST API ==== */
$_INTERFACE_REST = 'rest';
$_INTERFACE_GRAPHQL = 'graphql';
$_INTERFACE_WEBSOCKET = 'websocket';
$_QUERY_ADD = 'add';
$_QUERY_LOGIN = 'login';
$_QUERY_GET_CHECKPOINT = 'getCheckpoints';
$_QUERY_SET_CHECKPOINT = 'setCheckpoint';

$_SHOULD_CREATE_TABLES = true;
$_SHOULD_SET_USERID_FOR_ALL_ADD = true;
$_USE_LOG_IP = true;
$_USE_SESSIONS = false;
$_LOGKEY_EXPIRES_IN = 86400000; // 1 day in ms

function prepare_and_execute($bdd, $query, $params) {
  try {
    $req = $bdd->prepare($query);
    bind_values($req, $params);
    $req->execute();
    if ($req) {
      return $req;
    } else {
      throw new Exception("prepare_and_execute: update was unsuccessful -- " . $req->errorInfo()[2], 1);
    }
  } catch (Exception $e) {
    throw new Exception("prepare_and_execute: error. ". $e['message'], 1);
  }
}

function bind_values($req, $params) {
  if (!($req instanceof PDOStatement)) {
    throw new Exception("bind_values: req is not a PDOStatement", 1);
  }
  if (!isAssoc($params)) {
    throw new Exception("bind_values: invalid params", 1);
  }

  try {
    foreach ($params as $key => $value) {
      $type = PDO::PARAM_STR;
      if (is_bool($value)) {
        $type = PDO::PARAM_BOOL;
      } elseif (is_int($value)) {
        $type = PDO::PARAM_INT;
      } elseif (is_array($value)) {
        $value = json_encode($value);
      }
      $req->bindValue(":${key}", $value, $type);
    }
  } catch (Exception $e) {
    throw new Exception("bind_values: error while binding params ". $e['message'], 1);
  }
}

function login($bdd, $credentials) {
    if ((!is_array($credentials)) || (!isset($credentials['userId'])) || (!isset($credentials['password']))) {
      throw new Exception("login: invalid credentials", 1);
    }

    try {

      $userId = $credentials['userId'];
      $password = $credentials['password'];

      // get user from bd with userid
      $query = "SELECT password, type FROM users
                  WHERE userId = :userId";

      $params = [];
      $params['userId'] = $userId;

      $req = prepare_and_execute($bdd, $query, $params);
      $count = $req->rowCount();
      if ($count == 1) {
        $rows = $req->fetchAll(PDO::FETCH_ASSOC);
        // use hash to compare password
        if (password_verify($password , $rows[0]['password'])) {
          // generate logKey
          $k = range("q","9 ");
          shuffle($k);
          $logKey = substr(implode($k), 0, 20);

          // replace logKey into DB
          // TODO think about when to remove the logkey ...
          set_logkey($bdd, $userId, $logKey);

          return ['type' => $rows[0]['type'], 'userId' => $userId, 'logKey' => $logKey];
        } else {
          return false;
        }
      } elseif ($count == 0) {
        // invalid userId
        return false;
      } else {
        // userId should be unique
        throw new Exception("is_accredited: duplicated id ? " . $count, 1);
      }
    } catch (Exception $e) {
      throw $e;
    }


}

function set_logkey($bdd, $userId, $logKey) {
  $params = [];
  $ipQuery = "";

  if ($GLOBALS['_USE_LOG_IP'] === true) {
    $ipQuery .= ", logIp = :logIp ";
    $params['logIp'] = $_SERVER['REMOTE_ADDR'];
  }

  $query = "UPDATE users
            SET logKey = :logKey, logKeyTime = :logKeyTime${ipQuery}
            WHERE userId = :userId";

  $params['userId'] = $userId;
  $params['logKey'] = $logKey;
  $params['logKeyTime'] =  get_timestamp_ms();

  try {
    $req = prepare_and_execute($bdd, $query, $params);
    add_rows($bdd, 'userLogs', [$params]);
  } catch (Exception $e) {
    throw $e;
  }

}

function get_timestamp_ms() {
  return round(microtime(true) * 1000);
}

function check_logkey_and_refresh($bdd, $userId, $logKeyTime) {
  // should check if expires ? If null does not check
  if (is_int($GLOBALS['_LOGKEY_EXPIRES_IN'])) {
    $return = false;
    $params = ['userId' => $userId];
    // check that the key has not expired
    if  ($GLOBALS['_LOGKEY_EXPIRES_IN']+intval($logKeyTime) > get_timestamp_ms()) {
      //updated the logKeyTime to now so as to prevent logout
      $params['logKeyTime'] = get_timestamp_ms();
      $return = true;
    } else {
      // expired: delete logkey
      $params['logKey'] = '';
      $params['logKeyTime'] = 0;
      $logKeyQuery = ", logKey = :logKey ";
    }

    $query = "UPDATE users
              SET logKeyTime = :logKeyTime${logKeyQuery}
              WHERE userId = :userId";

    try {
      $req = prepare_and_execute($bdd, $query, $params);
      return $return ;
    } catch (Exception $e) {
      throw $e;
    }

  }
  return true;
}

function is_accredited($bdd, $data = []) {
  if (!pdo_ping($bdd)){
    throw new Exception("is_accredited: bdd is not a valid pdo connection", 1);
  }

  $userId = null;
  $logKey = null;
  if (isset($data['userId']) && isset($data['logKey'])) {
    $userId = $data['userId'];
    $logKey = $data['logKey'];
  } elseif (isset($_SESSION['userId']) && isset($_SESSION['logKey'])) {
    $userId = $data['userId'];
    $logKey = $data['logKey'];
  }else {
    throw new Exception("is_accredited: no valid credentials passed", 1);
  }

  $query = "SELECT logIp, logKey, logKeyTime, type FROM users
              WHERE userId = :userId";

  $params = ['userId' => $userId];
  $req = prepare_and_execute($bdd, $query, $params);
  $count = $req->rowCount();
  if ($count == 1) {
    $rows = $req->fetchAll(PDO::FETCH_ASSOC);

    if (($logKey == $rows[0]['logKey'])&&((!$GLOBALS['_USE_LOG_IP'])||($_SERVER['REMOTE_ADDR'] == $rows[0]['logIp']))) {
      if (check_logkey_and_refresh($bdd, $userId, $rows[0]['logKeyTime'])) {
        return $rows[0]['type'];
      }
      return false;
    } else {
      return false;
    }
  } elseif ($count == 0) {
    // invalid userId
    return false;
  } else {
    // userId should be unique
    throw new Exception("is_accredited: duplicated id ? " . $count, 1);
  }

}

function is_row_object($row) {
  if ((is_array($row)) && (count($row) > 0) && (!is_array($row[0]))) {
    return true;
  } else {
    return false;
  }
}

function is_duplicate($bdd, $table, $row) {
  if (!pdo_ping($bdd)){
    throw new Exception("is_accredited: bdd is not a valid pdo connection", 1);
  }

  $query = "SELECT * FROM ${table} WHERE ";
  $and = false;
  foreach ($row as $key => $value) {
    if ($and) {
      $query .= " AND ";
    }
    $query .= "${key} = :${key} ";
    $and = true;
  }


  $req = $bdd->prepare($query);

  foreach ($row as $key => $value) {
    $type = PDO::PARAM_STR;
    if (is_bool($value)) {
      $type = PDO::PARAM_BOOL;
    } elseif (is_int($value)) {
      $type = PDO::PARAM_INT;
    }
    $req->bindParam(":${key}", $value, $type);
  }

  $req->execute();
  $count = $req->rowCount();
  if ($count === 0) {
    return false;
  } else {
    return true;
  }
}

function set_user_timestamp($rows, $userId) {
    for ($i=0; $i < count($rows); $i++) {
      $row = $rows[$i];

      if (!isAssoc($row)) {
        throw new Exception("set_user_timestamp: invalid row", 1);
      }
      if (!isset($row['userId']) || !array_key_exists('userId', $row)) {
        $rows[$i]['userId'] = $userId;
      }
      if (!isset($row['dbTimestamp']) || !array_key_exists('dbTimestamp', $row)) {
        $rows[$i]['dbTimestamp'] = get_timestamp_ms();
      }
    }
}

function add_rows($bdd, $table, $rows) {
  if (!pdo_ping($bdd)){
    throw new Exception("is_accredited: bdd is not a valid pdo connection", 1);
  }

  if ($GLOBALS['_SHOULD_SET_USERID_FOR_ALL_ADD']) {
    // add userId and dbTimestamp to all tables even if not sent by the dataManager
    set_user_timestamp($rows, $userId);
  }

  table_exists_or_create($bdd, $table, $rows);

  $query = "INSERT INTO ${table} (";
  $values = " VALUES (";

  if (isAssoc($rows)){
    $rows = [$rows];
  }

  $valuesRow = [];
  $i = 0;
  foreach ($rows as $j => $row) {
    $and = false;
    $valuesRow[$j] = "";
    if (!is_row_object($row)) {
      throw new Exception("Invalid row " . $i, 1);
    }

    foreach ($row as $key => $value) {
      if ($and) {
        $query .= ($i > 0) ? "" :" , ";
        $valuesRow[$j] .= " , ";
      }
      $query .= ($i > 0) ? "" :"${key}";
      $valuesRow[$j] .= ":${key}${j}";
      $and = true;
    }
    $i += 1;
  }

  $values .= implode('), (', $valuesRow) . ')';

  $query .= ")" . $values. " ON DUPLICATE KEY UPDATE id=id"; // TODO make sure id is always primary

  $req = $bdd->prepare($query);

  $j = 0;
  foreach ($rows as $i => $row) {
    foreach ($row as $key => $value) {
      $type = PDO::PARAM_STR;
      if (is_bool($value)) {
        $type = PDO::PARAM_BOOL;
      } elseif (is_int($value)) {
        $type = PDO::PARAM_INT;
      } elseif (is_array($value)) {
        $value = json_encode($value);
      }
      $req->bindValue(":${key}${j}", $value, $type);
    }
    $j += 1;
  }

  if ($req->execute()) {
    return true;
  } else {
    throw new Exception("add_row: insert was unsuccessful -- " . $query . " " . $req->errorInfo()[2], 1);
  }
}


function table_alter_to_match($bdd, $table, $rows) {
  try {
    $query = "SELECT COLUMN_NAME FROM information_schema.columns
              WHERE table_schema = :dbname AND table_name = :table";
    $req = prepare_and_execute($bdd, $query, ['dbname' => $GLOBALS['DB_NAME'], 'table' => $table]);

  } catch (Exception $e) {
    throw new Exception("table_alter_to_match: error ". $e['message'], 1);
  }
}

function table_exists_or_create($bdd, $table, $rows) {


  $query = "SHOW TABLES LIKE :table";

  $req = $bdd->prepare($query);
  $req->bindParam(":table", $table);
  $req->execute();

  $count = $req->rowCount();
  if ($count == 1) {
    if ($GLOBALS['_SHOULD_ALTER_TABLES']) {
        table_alter_to_match($bdd, $table, $rows);
    }
    return true;
  } else {
    if ($GLOBALS['_SHOULD_CREATE_TABLES']) {

      if (!isAssoc($rows)){
        $rows = $rows[0];
        if (!isAssoc($rows)) {
          throw new Exception("table_exists_or_create: invalid rows", 1);
        }
      }

      // create table based on the rows
      $query = "CREATE TABLE ${table} (";

      $add = false;
      $primary = false;
      foreach ($rows as $key => $value) {
        if ($add) {
          $query .= ", ";
        }

        if ($key === 'id') {
          $primary = true;
          $query .= "id INT NOT NULL PRIMARY KEY AUTO_INCREMENT";
        } else {
          $query .= $key." ".type_from_value($value);
        }

        $add = true;
      }
      if (!$primary) {
        if ($add) {
          $query .= ", ";
        }
        $query .= "id INT NOT NULL PRIMARY KEY AUTO_INCREMENT";
      }
      $query .= ");";

      $req = $bdd->prepare($query);
      if ($req->execute()) {
        return true;
      } else {
        throw new Exception("table_exists_or_create: table creation was unsuccessful -- " . $req->errorInfo()[2], 1);
      }

    }
  }

}

function type_from_value($value) {
  if (is_int($value)) {
    return "BIGINT";
  } elseif (is_bool($value)) {
    return "BOOL";
  }
  return "TEXT";
}

function get_checkpoints($bdd, $userId) {
  if (!pdo_ping($bdd)){
    throw new Exception("is_accredited: bdd is not a valid pdo connection", 1);
  }

  $query = "INSERT INTO ${table} (";
  $values = " VALUES (";
  $and = false;
  foreach ($row as $key => $value) {
    if ($and) {
      $query .= " , ";
      $values .= " , ";
    }
    $query .= "${key}";
    $values .= ":${key}";
    $and = true;
  }
  $query .= ")" . $values . " ON DUPLICATE KEY UPDATE ";


  $req = $bdd->prepare($query);

  foreach ($row as $key => $value) {
    $type = PDO::PARAM_STR;
    if (is_bool($value)) {
      $type = PDO::PARAM_BOOL;
    } elseif (is_int($value)) {
      $type = PDO::PARAM_INT;
    }
    $req->bindParam(":${key}", $value, $type);
  }

  if ($req->execute()) {
    return true;
  } else {
    throw new Exception("add_row: insert was unsuccessful -- " . $req->errorInfo()[2], 1);
  }
}

function add_csv($bdd, $table, $csvFile) {

  /* TODO
  LOAD DATA INFILE 'data.txt' INTO TABLE tbl_name
  IGNORE
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\r\n'
  IGNORE 1 LINES;
  */
}

function is_valid_query() {
  // TODO protect against query complexity
}
