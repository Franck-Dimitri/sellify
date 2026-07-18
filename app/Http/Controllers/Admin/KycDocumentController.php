<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KycDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KycDocumentController extends Controller
{
    /**
     * Serve identity document file securely.
     */
    public function show(Request $request, int $id): StreamedResponse
    {
        $document = KycDocument::findOrFail($id);
        $user = $request->user();

        // Security check: Only Admins or the owner of the document can view it
        if (! $user->isAdmin() && $user->id !== $document->user_id) {
            abort(403, 'Accès interdit à ce document.');
        }

        if (! Storage::exists($document->file_path)) {
            abort(404, 'Document introuvable sur le serveur.');
        }

        return Storage::response($document->file_path);
    }
}
