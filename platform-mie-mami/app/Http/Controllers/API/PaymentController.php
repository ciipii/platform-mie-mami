<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PaymentResource;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentController extends Controller
{
    /**
     * Process a payment for an order.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function processPayment(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'order_id' => 'required|exists:orders,id',
                'payment_method' => 'required|string|in:credit_card,paypal,bank_transfer',
                'card_number' => 'required_if:payment_method,credit_card|string|nullable',
                'card_expiry' => 'required_if:payment_method,credit_card|string|nullable',
                'card_cvv' => 'required_if:payment_method,credit_card|string|nullable',
                'paypal_email' => 'required_if:payment_method,paypal|email|nullable',
                'bank_account' => 'required_if:payment_method,bank_transfer|string|nullable',
            ]);

            return DB::transaction(function () use ($request, $validated) {
                // Get the order
                $order = Order::where('user_id', $request->user()->id)
                    ->where('id', $validated['order_id'])
                    ->firstOrFail();

                // Check if order is already paid
                if ($order->payment()->exists()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'This order has already been paid',
                    ], 422);
                }

                // Calculate total amount
                $totalAmount = 0;
                foreach ($order->details as $detail) {
                    $totalAmount += $detail->price * $detail->quantity;
                }

                // Create payment record
                $payment = new Payment([
                    'order_id' => $order->id,
                    'amount' => $totalAmount,
                    'payment_method' => $validated['payment_method'],
                    'payment_date' => now(),
                ]);
                $payment->save();

                // Update order status
                $order->status = 'processing';
                $order->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'data' => [
                        'order' => new OrderResource($order),
                        'payment' => new PaymentResource($payment),
                    ],
                ]);
            });
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get payment details for an order.
     *
     * @param Request $request
     * @param int $orderId
     * @return JsonResponse
     */
    public function getPaymentDetails(Request $request, int $orderId): JsonResponse
    {
        try {
            $order = Order::where('user_id', $request->user()->id)
                ->where('id', $orderId)
                ->firstOrFail();

            $payment = $order->payment;

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'No payment found for this order',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new PaymentResource($payment),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment details',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
