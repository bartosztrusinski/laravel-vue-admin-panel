<?php

namespace App\Enums;
 
enum UserRoleEnum:string {
    case ContentEditor = 'content_editor';
    case Admin = 'admin';
    case User = 'user';
}