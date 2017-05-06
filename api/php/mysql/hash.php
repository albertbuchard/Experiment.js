<?php

  $pass = $_GET['pass'];
  var_dump($pass);
  echo password_hash($pass, PASSWORD_DEFAULT);

?>
