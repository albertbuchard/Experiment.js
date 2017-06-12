<?php
/* =============== Survey utils =============== */

/* ======== Limesurvey interface ======== */

/**
 * Checks if the survey data is of the correct format - also creates a name correspondance with the other json format
 * using the smaller variable names (not really usefull since we added the callback field). Returns an object like so :
 * [is_the_data_correct, if_not_here_is_the_error, if_yes_here_are_the_fields] list of field names on the object[2].
 * @param object $survey_data Parsed from the json file. Contains the data for one specific survey, eg $loadedJson["bisbas_mturk"]
 */
function check_survey_data($survey_data)
{
  if (!is_array($survey_data)) {
    return (["result" => false, "error" => "check_survey_data: survey_data is not an array."]);
  }

  if ((!isset($survey_data["questionaire_id"])) && (!isset($survey_data["sid"]))) {
    return (["result" => false, "error" => "getQuestionId: $survey_data is invalid"]);
  }

  if (isset($survey_data["questionaire_id"])) {
    $fields = array(
      "questionaire_id" => "questionaire_id",
      "question_group" => "question_group",
      "subject_group_id_question_id" => "subject_group_id_question_id",
      "subject_id_question_id" => "subject_id_question_id",
      "survey_group_question_id" => "survey_group_question_id",
      "callback_information_question_id" => "callback_information_question_id",
    );
  } else {
    $fields = array(
      "questionaire_id" => "sid",
      "question_group" => "gid",
      "subject_group_id_question_id" => "qid_gp",
      "subject_id_question_id" => "qid_sj",
      "survey_group_question_id" => "qid_sg",
    );
  }

  return (["result" => true, "error" => "", "fields" => $fields]);
}

function get_survey_by_id($survey_data, $id)
{
  $check = check_survey_data($survey_data);
  if (!$check["result"]) {
    die($check["error"]);
  }

  $filtered_data = array_filter($surveys, function ($survey) {
    return ($survey["questionaire_id"] == $id);
  });

  if (count($filtered_data) > 0) {
    return ($filtered_data[0]);
  } else {
    return null;
  }
}

/** Returns the limesurvey SGQ id of the specified question (eg 12341X324X234) */
function get_question_id($survey_data, $field = "subject_id_question_id")
{

  $check = check_survey_data($survey_data);
  if (!$check["result"]) {
    die($check["error"]);
  }

  $fields = $check["fields"];

  if (!array_key_exists($field, $fields)) {
    $field = array_search($field, $fields);
    if (!$field) {
      die("get_question_id: " . $field . " is not a valid field.");
    }
  }

  $question_string = $survey_data[$fields["questionaire_id"]]
  . "X" . $survey_data[$fields["question_group"]]
  . "X" . $survey_data[$fields[$field]];

  return ($question_string);
}

/** Returns a fully form URL to the limesurvey specified in $survey_data with specified $fields values */
function get_survey_url($survey_data,
  $fields = array(),
  $lang = "en",
  $root_dir = null) {

  if ($root_dir === null) $root_dir = $GLOBALS['DB_ROOT'];

  $check = check_survey_data($survey_data);
  if (!$check["result"]) {
    die($check["error"]);
  }

  $data_fields = $check["fields"];

  $questionaire_id = $survey_data[$data_fields["questionaire_id"]];

  $url = $root_dir . $questionaire_id . '/newtest/Y?lang=' . $lang;
  foreach ($fields as $field => $value) {
    if (!is_null($value)) {
      $url .= "&" . get_question_id($survey_data, $field) . "=" . $value;
    }
  }

  return ($url);
}

/**
 * Function to create automatically a named array $fields used by get_survey_url($survey_data, $fields)
 * in order to produce a valid url and send subject_id, subject_group, survey_group, and a callback information field
 * @param string $subject_id
 * @param string $subject_group
 * @param string $survey_group
 * @param string $callback_url Base url subject should be sent to after completing the form
 *                             (such as http://www.brainandlearning.org/surveys.php)
 * @return Array Named array containing 4 fields :
 *                     - "subject_id_question_id" => $subject_id,
 *                     - "subject_group_id_question_id" => $subject_group,
 *                     - "survey_group_question_id" => $survey_group,
 *                     - "callback_information_question_id" => information the survey should send BACK to the callback_url page (all the previous information are concatenated and separated by a comma - parsing is done on limesurvey)
 *
 */
function get_fields_from_variables($subject_id, $subject_group, $survey_group, $callback_url = null)
{
  // If no callback url given use the requested url of the current script
  if (is_null($callback_url)) {
    $uri_parts = explode('?', $_SERVER['REQUEST_URI'], 2);
    $callback_url = "http://$_SERVER[HTTP_HOST]$uri_parts[0]";
  }

  // creates a fields named array with keys as field name
  // callback_information_question_id holds all the information usefull to be sent back separated by a ','
  // The End message source on limesurvey use it to build the callback url
  $fields = [
    "subject_id_question_id" => $subject_id,
    "subject_group_id_question_id" => $subject_group,
    "survey_group_question_id" => $survey_group,
    "callback_information_question_id" => $subject_id . "," . $subject_group . "," . $survey_group . "," . $callback_url,
  ];

  return $fields;
}

/* ======== Db interface ======== */
function get_subject_registered_surveys($subject_id, $bdd)
{
  if (pdo_ping($bdd)) {
    die("get_subject_registered_surveys: Invalid db connection bdd");
  }

  // Get all surveys filled and registered in db for the subject
  $query = "SELECT * FROM surveyStatus
              WHERE subjID = :subjID
              ORDER BY id";

  $req = $bdd->prepare($query);
  $req->bindParam(":subjID", $_SESSION['subjID']);
  // $req->bindParam(":groupID", $_SESSION['groupID']);
  // $req->bindParam(":surveyGroup", $_SESSION['surveyGroup']);
  $req->execute();
  $rows = $req->fetchAll(PDO::FETCH_ASSOC);

  return $rows;
}
