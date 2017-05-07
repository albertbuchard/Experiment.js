<?php

  require_once 'vendor/autoload.php';
  require_once './utilities.php';

  use GraphQL\GraphQL;
  use \GraphQL\Schema;
  use \GraphQL\Type\Definition\Config;
  use \GraphQL\Error\FormattedError;
  // use \Exception;

  //ini_set('display_errors', 0);

  if (!empty($_GET['debug'])) {
    // Enable additional validation of type configs
    // (disabled by default because it is costly)
    Config::enableValidation();

    // Catch custom errors (to report them in query results if debugging is enabled)
    $phpErrors = [];
    set_error_handler(function($severity, $message, $file, $line) use (&$phpErrors) {
        $phpErrors[] = new ErrorException($message, 0, $severity, $file, $line);
    });
  }

  $accredited = false;
  $shouldLog = false;
  $httpStatus = 500;
  $result = [];
  try {
    if (($_USE_SESSIONS) && (is_session_started() === FALSE )) session_start();
    // Check for valid request and presence of credentials
    $data = [];
    if (isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {

        // Fetch data json object
        $rawBody = file_get_contents('php://input');
        // if json object valid
        $data = json_decode($rawBody ?: '', true);
    }

    $data += ['query' => null, 'credentials' => null,'interface' => $_INTERFACE_REST, 'variables' => null];
    if ($data['query'] === null) {
        // $data = $_POST;
        throw new Exception('Empty or invalid query', 1);
    }

    // Connect to the db
    $bdd = connect_to_db();

    // Look for credentials
    $userId = null;
    $credentials = $data['credentials'];
    if ($data['query'] === $_QUERY_LOGIN) {
      $logged = login($bdd, $data['credentials']);
      if (is_array($logged)) {
        $result['credentials'] = $logged;
      }
    } else {
      if (isset($credentials['userId']) && isset($credentials['logKey'])) {
        $userId = $credentials['userId'];
        $logKey = $credentials['logKey'];
      } elseif ($_USE_SESSIONS && isset($_SESSION['userId']) && isset($_SESSION['logKey'])) {
        $userId = $credentials['userId'];
        $logKey = $credentials['logKey'];
      }else {
        $shouldLog = true;
        throw new Exception("is_accredited: no valid credentials passed", 1);
      }

      // TODO Should we use an OAuth library.. ?
      // http://bshaffer.github.io/oauth2-server-php-docs/cookbook/
      $accredited = is_accredited($bdd, ['userId' => $userId, 'logKey' => $logKey]);

      if (!$accredited) {
        $shouldLog = true;
        throw new Exception('Not accredited', 1);
      }

      $query = $data['query'];
      $variables = $data['variables'];

      $interface = $data['interface'];
      if ($data['interface'] === $_INTERFACE_REST) {

        // Add endpoint
        if ($data['query'] == 'add') {
          if (($variables === null) || (!isset($variables['table'])) || (!isset($variables['rows']))) {
            throw new Exception("Invalid data", 1);
          }
          $rows = $variables['rows'];
          if (!is_array($rows)) {
            throw new Exception("Invalid rows", 1);
          }

          $table = $variables['table'];
          if (!is_string($table)) {
            throw new Exception("Invalid table " .json_encode($table), 1);
          }

          $rowsAdded = add_rows($bdd, $table, $rows);
          $result = ['status' => 'OK', 'Rows added' => json_encode($rowsAdded)];
        }

        // Checkpoints endpoint
        if ($query === "getCheckpoint") {
          $checkpoint = get_checkpoint($bdd, $userId);
          $result = ['status' => 'OK'] + $checkpoint;
        }

        if ($query === "setCheckpoints") {
          // treat this as a normal row hanled by add row
        }

        if ($query === 'get') {
          // general endpoint to select information from db
          // limited to the userId
          // is it usefull ? ..probably not

        }
      }

    }

    $httpStatus = 200;

  } catch (Exception $e) {
    $result['message'] = $e.message;
    $httpStatus = 500;
    // if (!empty($_GET['debug'])) {
    //     $result['extensions']['exception'] = FormattedError::createFromException($e);
    // } else {
    //     $result['errors'] = [FormattedError::create('Unexpected Error')];
    // }

    $result['shouldLog'] = $shouldLog;
  }



  header('Content-Type: application/json', true, $httpStatus);
  echo json_encode($result);
  //header('Content-Type: text', true, $httpStatus);
  //var_dump($result);
  // TODO Use graphQL
  // Here possibly define the GraphQL schema
  // add mutations etc...

  /*

  $data += ['query' => null, 'variables' => null];
  if (null === $data['query']) {
      $data['query'] = '{hello}';
  }

  // GraphQL schema to be passed to query executor:
    $schema = new Schema([
        'query' => Types::query(),
        'mutation' => $mutationType,
    ]);
    $result = GraphQL::execute(
        $schema,
        $data['query'],
        null,
        $appContext,
        (array) $data['variables']
    );
    // Add reported PHP errors to result (if any)
    if (!empty($_GET['debug']) && !empty($phpErrors)) {
        $result['extensions']['phpErrors'] = array_map(
            ['GraphQL\Error\FormattedError', 'createFromPHPError'],
            $phpErrors
        );
    }

  */
