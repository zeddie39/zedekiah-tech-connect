import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    ArrowLeft,
    Package,
    MapPin,
    Clock,
    CheckCircle2,
    XCircle,
    CreditCard,
    Receipt,
    Truck
} from "lucide-react";
import ShopNavbar from "@/components/ShopNavbar";
import { toast } from "@/components/ui/use-toast";

type Order = {
    id: string;
    created_at: string;
    amount: number;
    status: string | null;
    payment_status: string | null;
    product_id: string;
    delivery_location: string | null;
    mpesa_receipt?: string | null;
    checkout_request_id?: string | null;
};

type Product = {
    id: string;
    title: string;
    price: number;
    image_url: string | null;
};

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" />, label: "Pending" },
    confirmed: { color: "bg-blue-100 text-blue-800", icon: <Package className="w-4 h-4" />, label: "Confirmed" },
    processing: { color: "bg-purple-100 text-purple-800", icon: <Package className="w-4 h-4" />, label: "Processing" },
    shipped: { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-4 h-4" />, label: "Shipped" },
    delivered: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="w-4 h-4" />, label: "Delivered" },
    completed: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="w-4 h-4" />, label: "Completed" },
    cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" />, label: "Cancelled" },
    payment_failed: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" />, label: "Payment Failed" },
};

const paymentStatusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" />, label: "Pending" },
    paid: { color: "bg-green-100 text-green-800", icon: <CheckCircle2 className="w-4 h-4" />, label: "Paid" },
    failed: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" />, label: "Failed" },
};

export default function OrderDetailsPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                navigate("/orders");
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/auth");
                return;
            }

            // Fetch order
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .select("*")
                .eq("id", orderId)
                .single();

            if (orderError || !orderData) {
                toast({ title: "Error", description: "Order not found", variant: "destructive" });
                navigate("/orders");
                return;
            }

            setOrder(orderData as Order);

            // Fetch product details
            const { data: productData } = await supabase
                .from("products")
                .select("id, title, price")
                .eq("id", orderData.product_id)
                .single();

            if (productData) {
                // Get first image from product_images
                const { data: imgData } = await supabase
                    .from("product_images")
                    .select("image_url")
                    .eq("product_id", productData.id)
                    .limit(1)
                    .maybeSingle();
                setProduct({ ...productData, image_url: imgData?.image_url ?? null } as Product);
            }

            setLoading(false);
        };

        fetchOrder();

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`order-${orderId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "orders",
                    filter: `id=eq.${orderId}`,
                },
                (payload) => {
                    setOrder(payload.new as Order);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId, navigate]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const orderStatus = statusConfig[order.status || "pending"] || statusConfig.pending;
    const paymentStatus = paymentStatusConfig[order.payment_status || "pending"] || paymentStatusConfig.pending;

    return (
        <>
            <ShopNavbar />
            <div className="max-w-3xl mx-auto py-6 sm:py-10 px-3">
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/orders")}
                        className="bg-primary text-accent font-semibold rounded px-4 py-2 border border-accent hover:bg-accent hover:text-primary transition-colors duration-200 flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Orders
                    </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Order Details</h1>

                {/* Order ID and Date */}
                <Card className="p-4 sm:p-6 mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Order ID</p>
                            <p className="font-mono font-semibold">{order.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Order Date</p>
                            <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                </Card>

                {/* Status Badges */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">Order Status</p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${orderStatus.color}`}>
                            {orderStatus.icon}
                            <span className="font-semibold">{orderStatus.label}</span>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${paymentStatus.color}`}>
                            {paymentStatus.icon}
                            <span className="font-semibold">{paymentStatus.label}</span>
                        </div>
                    </Card>
                </div>

                {/* Product Details */}
                <Card className="p-4 sm:p-6 mb-4">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" /> Product
                    </h2>
                    <div className="flex items-center gap-4">
                        {product?.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-20 h-20 object-cover rounded-lg bg-muted"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-lg">{product?.title || "Product"}</p>
                            <p className="text-primary font-bold">Ksh {order.amount.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>

                {/* Delivery Location */}
                {order.delivery_location && (
                    <Card className="p-4 sm:p-6 mb-4">
                        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <MapPin className="w-5 h-5" /> Delivery Location
                        </h2>
                        <p className="text-muted-foreground">{order.delivery_location}</p>
                    </Card>
                )}

                {/* Payment Receipt */}
                {order.mpesa_receipt && (
                    <Card className="p-4 sm:p-6 mb-4 bg-green-50 border-green-200">
                        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-green-700">
                            <Receipt className="w-5 h-5" /> M-Pesa Receipt
                        </h2>
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                            <p className="text-sm text-muted-foreground">Receipt Number</p>
                            <p className="font-mono font-bold text-2xl text-green-700">{order.mpesa_receipt}</p>
                        </div>
                    </Card>
                )}

                {/* Actions */}
                {order.status === "pending" && order.payment_status !== "paid" && (
                    <Card className="p-4 sm:p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Complete Payment
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Your order is pending payment. Click below to complete the payment.
                        </p>
                        <Button
                            onClick={() => navigate(`/checkout?orderId=${order.id}`)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Pay Now
                        </Button>
                    </Card>
                )}
            </div>
        </>
    );
}
