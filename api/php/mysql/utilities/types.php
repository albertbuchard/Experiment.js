<?php

function isAssoc(array $arr)
{
  if (array() === $arr) return false;
  return array_keys($arr) !== range(0, count($arr) - 1);
}

function firstKey(array $arr) {
  if (array() === $arr) return null;
  return array_keys($arr)[0];
}

?>
