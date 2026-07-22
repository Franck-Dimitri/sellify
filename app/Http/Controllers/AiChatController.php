<?php

namespace App\Http\Controllers;

use App\Services\AIAgentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiChatController extends Controller
{
    protected AIAgentService $aiAgentService;

    public function __construct(AIAgentService $aiAgentService)
    {
        $this->aiAgentService = $aiAgentService;
    }

    /**
     * Process message from Floating AI Assistant Widget.
     */
    public function handle(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $user = $request->user();
        $replyData = $this->aiAgentService->handleMessage($user, $request->input('message'));

        return response()->json($replyData);
    }
}
