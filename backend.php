<?php
/**
 * Created by PhpStorm.
 * User: ZZH
 * Date: 2018/12/20
 * Time: 9:31
 */

$conn = mysqli_connect("127.0.0.1", "root", "8ud7fh") or die("连接数据库失败" . mysqli_error($conn));
//$conn = mysqli_connect("localhost", "root", "root") or die("连接数据库失败" . mysqli_error($conn));
mysqli_select_db($conn, "zzh_blog") or die("数据库访问错误" . mysqli_error($conn));
mysqli_query($conn, "set names 'utf8'");
ini_set('date.timezone', 'Asia/Shanghai');
$date = date('Y-m-d H:i:s');

$action = $_GET['action'];
switch ($action) {
    case 'login':
        login();
        break;
    case 'quillUploadImg':
        quillUploadImg();
        break;
    case 'new_topic':
        new_topic();
        break;
    case 'get_topics':
        get_topics();
        break;
    case 'views_count_add':
        views_count_add();
        break;
}
function views_count_add()
{
    global $conn;
    $id = $_POST['id'];
    $rs = update($conn, 'topic', "`view`=`view`+1", "`id`=$id");
    if ($rs !== true) {
        echo $rs;
    }
}

function get_topics()
{
    //预设每页显示5条数据
    $NUM_PER_PAGE = 5;
    global $conn;
    $startIndex = ($_POST['num'] - 1) * $NUM_PER_PAGE;
    $rs = all($conn, 'topic', "ORDER by `id` DESC limit $startIndex,$NUM_PER_PAGE");
    $total = select($conn, 'count', "`name`='topic'")[0]['value'];
    echo json_encode(['total' => $total, 'arr' => $rs]);
}

function new_topic()
{
    global $conn, $date;
    $arr = array(1 => 0);
    for ($i = 0; $i < count($_POST['tags']); $i++) {
        $arr['' . $i] = $_POST['tags'][$i];
    }
    $rs = add($conn, 'topic', [check_before_SQL($_POST['author']), check_before_SQL($_POST['title']), check_before_SQL($_POST['grouping']), json_encode(json_encode($arr, JSON_UNESCAPED_UNICODE), JSON_UNESCAPED_UNICODE), check_before_SQL($_POST['content']), 0, 0, "'" . $date . "'", "default"]);
    if ($rs === true) {
        //计数+1
        update($conn, 'count', "`value`=`value`+1", "`name`='topic'");
        echo response(1, null);
    } else {
        echo response(-1, $rs);
    }
}

function quillUploadImg()
{
    $image = $_FILES['img'];
    //保存图片
    $arr = explode(".", $image["name"]);
    $type = $arr[count($arr) - 1];//后缀名
    $image_name = md5(uniqid()) . '.' . $type;
    if (!move_uploaded_file($image["tmp_name"], "./userdata/images/" . $image_name))
        echo json_encode(array('flag' => 'ERROR'));
    else {
        echo json_encode(array('flag' => 'DONE', 'path' => "./userdata/images/" . $image_name));
    }
}

function login()
{
    global $conn;
    $username = check_before_SQL($_POST['username']);
    $password = check_before_SQL(md5($_POST['password']));
    if (count(select($conn, 'user', "`username`=$username and `password`=$password")) != 0) {
        echo "PASS";
    } else {
        echo "REFUSED";
    }
}


//---------------------------------------------------------------------------
//防注入
function check_before_SQL($value)
{
    global $conn;
    // 去除斜杠
    if (get_magic_quotes_gpc()) {
        $value = stripslashes($value);
    }
    // 如果不是数字则加引号
//    if (!is_numeric($value)) {
//        $value = "'" . mysqli_real_escape_string($conn, $value) . "'";
//    }
    $value = "'" . mysqli_real_escape_string($conn, $value) . "'";
    return $value;
}


function select($conn, $table, $filter)
{
    //条件需手动拼凑成sql语句
    $sql = "select * from $table where $filter";
    $res = mysqli_query($conn, $sql);
    $arr = array();
    while ($row = mysqli_fetch_assoc($res)) {
        $arr[] = $row;
    }
    return $arr;
}

function all($conn, $table, $order)
{
    $sql = "select * from  $table " . $order;
    $res = mysqli_query($conn, $sql);
    $arr = array();
    while ($row = mysqli_fetch_assoc($res)) {
        $arr[] = $row;
    }
    return $arr;
}

function add($conn, $table, $arr)
{
    //arr需写成数组形式，且必须按顺序
    //mysqli_affected_rows返回最近一次sql操作影响的行数
    $str = array_values($arr);
    $str = implode(",", $str);
    $sql = "insert into $table values(DEFAULT ,$str)";
    $res = mysqli_query($conn, $sql);
    if ($res && mysqli_affected_rows($conn) > 0) {
        return true;
    } else {
        return $sql;
    }
}

function delete($conn, $table, $where)
{
    $sql = "delete from $table where $where";
    $res = mysqli_query($conn, $sql);
    if ($res && mysqli_affected_rows($conn) > 0) {
        return true;
    } else {
        return $sql;
    }
}

function update($conn, $table, $update, $where)
{
    $sql = "update $table set $update where $where";
    $res = mysqli_query($conn, $sql);
    if ($res && mysqli_affected_rows($conn) > 0) {
        return true;
    } else {
        return $sql;
    }
}

function response($code, $msg)
{
    $arr = [1 => 'OK', -1 => $msg];
    return json_encode(['status' => $code, 'msg' => $arr[$code]]);
}

function close()
{
    global $conn;
    mysqli_close($conn);
}