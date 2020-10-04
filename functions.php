<?php

function debug($value)
{
    $path = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS)[0];
    $path = 'called at ' . $path['file'] . ' :[' . $path['line'] . ']';

    echo "<pre class='dump' >" . print_r($value, true) . '<br/>' . $path . "</pre>";

    echo "<style>

            .dump{
                padding: 20px 20px;
                background-color: black;
                color: #6ef442;
            }

            </style> ";
}

function debugDie($value)
{
    $path = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS)[0];
    $path = 'called at ' . $path['file'] . ' :[' . $path['line'] . ']';

    echo "<pre class='dump' >" . print_r($value, true) . '<br/>' . $path . "</pre>";

    echo "<style>

            .dump{
                padding: 20px 20px;
                background-color: black;
                color: #6ef442;
            }

            </style> ";
    die();
}