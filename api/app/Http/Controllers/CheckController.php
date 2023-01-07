<?php

namespace App\Http\Controllers;

use App\Domain\Check\CheckService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Check\ApproveCheckRequest;
use App\Http\Requests\Check\IndexCheckRequest;
use App\Http\Requests\Check\RejectCheckRequest;
use App\Http\Requests\Check\ShowCheckRequest;
use App\Http\Requests\Check\StoreCheckRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CheckController extends Controller
{
    protected $service;

    public function __construct(CheckService $service)
    {
        $this->service = $service;
    }

    public function index(IndexCheckRequest $request)
    {
        $filters = $request->only(['account_id', 'status', 'from', 'to']);
        $sort = $request->only(['sort', 'order']);

        return $this->service->getPaginatedList($request->per_page ?? 10, $filters, $sort);
    }

    public function store(StoreCheckRequest $request): JsonResponse
    {
        $account = $request->user()->accounts()->first();

        $check = $this->service->create([
            ...$request->all(),
            'account_id' => $account->id,
        ]);

        return response()->json($check, 201);
    }

    public function show(ShowCheckRequest $request): JsonResponse
    {
        return response()->json($request->check->load(['account.user']));
    }

    public function getImage(ShowCheckRequest $request)
    {
        $type = Storage::mimeType($request->check->image);
        $content = Storage::get($request->check->image);

        return response($content)->header('Content-Type', $type);
    }

    public function approve(ApproveCheckRequest $request): JsonResponse
    {
        $this->service->approve($request->check, $request->user());

        return response()->json(null, 204);
    }

    public function reject(RejectCheckRequest $request): JsonResponse
    {
        $this->service->reject($request->check, $request->user());

        return response()->json(null, 204);
    }
}
