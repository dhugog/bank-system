<?php

namespace App\Http\Controllers;

use App\Domain\Transaction\TransactionService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\GetTransactionSummaryRequest;
use App\Http\Requests\Transaction\IndexTransactionRequest;

class TransactionController extends Controller
{
    protected $service;

    public function __construct(TransactionService $service)
    {
        $this->service = $service;
    }

    public function index(IndexTransactionRequest $request)
    {
        $filters = $request->only(['account_id', 'from', 'to']);
        $sort = $request->only(['sort', 'order']);

        return $this->service->getPaginatedList($request->per_page ?? 10, $filters, $sort);
    }

    public function summary(GetTransactionSummaryRequest $request)
    {
        $summary = $this->service->getSummary($request->all());

        return response()->json($summary);
    }

}
