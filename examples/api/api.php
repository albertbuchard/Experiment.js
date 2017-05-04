<?php

  $httpStatus = 200;
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


    $accredited = false;
    $result = $data;

  } catch (Exception $e) {
    $httpStatus = 500;
    $result = $e.message;
  }



  header('Content-Type: application/json', true, $httpStatus);
  echo json_encode($result);
  // header('Content-Type: text', true, $httpStatus);
  // var_dump($data);
  // var_dump($result);
?>
