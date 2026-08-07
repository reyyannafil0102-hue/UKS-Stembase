<?php

namespace Tests\Feature;

use Tests\TestCase;

class CmdAccessTest extends TestCase
{
    public function test_public_cmd_page_is_accessible_without_login(): void
    {
        $response = $this->get('/cmd');

        $response->assertStatus(200);
        $response->assertSee('CMD');
    }
}
