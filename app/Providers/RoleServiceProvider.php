<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use App\Http\Middleware\Role;
use App\Http\Middleware\UserMiddleware;

class RoleServiceProvider extends ServiceProvider
{
    public function register(): void
    {

    }

    public function boot(Router $router): void
    {
        // Daftarkan alias "role"
        $router->aliasMiddleware('role', UserMiddleware::class);
    }
}
