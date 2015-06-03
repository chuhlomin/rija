<?php namespace app\controllers;


class ProjectController
{
    public function index()
    {
        return file_get_contents('./public/project.html');
    }

    public function getJson()
    {
        return file_get_contents('./private/demo/project.json');
    }

}