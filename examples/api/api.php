<?php

  $httpStatus = 200;
  $accredited = false;
  $shouldLog = false;
  try {
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

    if (($data['credentials'] === null)||(!isset($data['credentials']['userId']))||($data['credentials']['userId'] === 'test')) {
      $shouldLog = true;
      throw new Exception('Not accredited', 1);
    } else {
      $data['credentials'] = ['userId' => $data['credentials']['userId']];
    }

    $result = $data;

  } catch (Exception $e) {
    $httpStatus = 500;
    $result['message'] = $e.message;
    $result['shouldLog'] = $shouldLog;
  }



  header('Content-Type: application/json', true, $httpStatus);
  echo json_encode($result);
  // header('Content-Type: text', true, $httpStatus);
  // var_dump($data);
  // var_dump($result);
?>
