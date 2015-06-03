<?php namespace app\controllers;


class ProjectsController
{
    public function index()
    {
        return file_get_contents('./public/projects.html');
    }

    public function getJson()
    {
        return file_get_contents('./private/demo/projects.json');
    }

}