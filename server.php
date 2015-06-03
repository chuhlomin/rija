<?php

$scriptInvokedFromCli = isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php';

if ($scriptInvokedFromCli) {
    $port = getenv('PORT');
    if (empty($port)) {
        $port = '3000';
    }

    echo 'Starting server on port '. $port . PHP_EOL;
    exec('php -S localhost:'. $port . ' -t public server.php');
    return false;
}

$filename = __DIR__. '/public' .preg_replace('#(\?.*)$#', '', $_SERVER['REQUEST_URI']);
if (php_sapi_name() === 'cli-server' && is_file($filename)) {
    return false;
}

$loader = require __DIR__.'/vendor/autoload.php';
$loader->add('app\\', __DIR__);

$app = new Silex\Application();

$app['debug'] = true;

$app->get('/projects/', 'app\controllers\ProjectsController::index');
$app->get('/projects.json', 'app\controllers\ProjectsController::getJson');

$app->get('/project/', 'app\controllers\ProjectController::index');
$app->get('/project.json', 'app\controllers\ProjectController::getJson');

$app->run();