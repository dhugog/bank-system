<?php

namespace App\Http\Controllers;

use App\Domain\Purchase\PurchaseService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Purchase\IndexPurchaseRequest;
use App\Http\Requests\Purchase\StorePurchaseRequest;

class PurchaseController extends Controller
{
    protected $service;

    public function __construct(PurchaseService $service)
    {
        $this->service = $service;
    }

    public function index(IndexPurchaseRequest $request)
    {
        $filters = $request->only(['account_id', 'status', 'from', 'to']);
        $sort = $request->only(['sort', 'order']);

        return $this->service->getPaginatedList($request->per_page ?? 10, $filters, $sort);
    }

    public function store(StorePurchaseRequest $request)
    {
        $purchase = $this->service->create($request->all());

        return response()->json($purchase, 201);
    }
}
