<?php
/*

  Replace ...xxx... with your specific parameters.

 */
/* INTERFACES */
$_INTERFACE_REST = 'rest';
$_INTERFACE_GRAPHQL = 'graphql';
$_INTERFACE_WEBSOCKET = 'websocket';

/*--- REST API ---*/
/* Database configuration */
$DB_HOST = '...xxx...';
$DB_NAME = '...xxx...';
$DB_USER = '...xxx...';
$DB_PASS = '...xxx...';

/* Query endpoints */
$_QUERY_ADD = 'add';
$_QUERY_LOGIN = 'login';
$_QUERY_GET_CHECKPOINT = 'getCheckpoint';
$_QUERY_SET_CHECKPOINT = 'setCheckpoint';

/* Api configuration */
$_SHOULD_CREATE_TABLES = true;
$_SHOULD_ALTER_TABLES = true;
$_SHOULD_SET_USERID_FOR_ALL_ADD = true;
$_USE_LOG_IP = true;
$_USE_SESSIONS = false;
$_LOGKEY_EXPIRES_IN = 86400000; // 1 day in ms

 /* String constants */
$_NO_CHECKPOINT = 'none';
$_TABLE_CHECKPOINTS = 'checkpoints';

/*--- SURVEYS ---*/
$SURVEY_ROOT = "...xxx...";
