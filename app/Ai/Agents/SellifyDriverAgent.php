<?php

namespace App\Ai\Agents;

use Laravel\Ai\Attributes\Provider;
use Laravel\Ai\Attributes\Model;
use Laravel\Ai\Attributes\Temperature;
use Laravel\Ai\Attributes\Timeout;
use Laravel\Ai\Enums\Lab;

#[Provider(Lab::Gemini)]
#[Model('gemini-3.1-flash-lite')]
#[Temperature(0.7)]
#[Timeout(30)]
class SellifyDriverAgent extends SellifyAgent
{
}
