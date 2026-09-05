<?php

namespace App\Services;

use App\Models\User;
use App\Models\ActivityLog;
use App\Ai\Agents\SellifyAgent;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AIAgentService
{
    /**
     * Handle incoming AI chat message for any role (seller, customer, driver, admin)
     */
    public function handleMessage(User $user, string $message): array
    {
        $reply = "";
        $actionTaken = null;

        // 1. Prompt Real Google Gemini via official Laravel AI SDK Agent
        try {
            if (!empty(config('ai.providers.gemini.key')) || !empty(env('GEMINI_API_KEY'))) {
                $agent = new SellifyAgent($user);
                $response = $agent->forUser($user)->prompt($message);
                $reply = (string) $response;
            }
        } catch (\Throwable $e) {
            Log::warning('Laravel AI SDK AIAgentService Error: ' . $e->getMessage());
        }

        // 2. Intelligent fallback if offline
        if (empty($reply)) {
            $geminiService = app(\App\Services\GeminiService::class);
            $reply = $geminiService->generateResponse($user, $message);
        }

        // 3. Log action for compliance & audit trail
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'ai_chat_interaction',
            'description' => "Sellify AI: " . Str::limit($message, 50),
        ]);

        return [
            'reply' => $reply,
            'action' => $actionTaken,
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
