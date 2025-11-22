
export interface Product {
    product_id: number;
    product_name: string;
    price: number;
    unit: string;
    stock: number;
    image_url?: string;
}

export interface Subcategory {
    id: number;
    name: string;
    image_url?: string;
    products: Product[];
}

export interface Category {
    id: number;
    name: string;
    image_url?: string;
    subcategories: Subcategory[];
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Cart {
    [productId: number]: CartItem;
}

export interface UserInfo {
    name: string;
    phone: string;
    can_use_mixed_payment: boolean;
}

export interface Address {
    address_corregida: string;
    description: string;
    costo_envio: number;
    lat: number;
    lng: number;
}

export interface DeliveryConfig {
    business_address: string;
    store_coords: [number, number];
}

export interface PaymentConfig {
    allow_cash: boolean;
}

export interface CheckoutData {
    user_info: UserInfo;
    addresses: Address[];
    delivery_config: DeliveryConfig;
    payment_config: PaymentConfig;
}

export interface NavigationPathItem {
    id: number;
    name: string;
}

export type View = 
    | { type: 'CATALOG' }
    | { type: 'ORDER_STATUS'; orderId: string };

export interface AuthState {
    isAuthenticated: boolean;
    loading: boolean;
    userIdentifier: string | null;
    role: 'cliente' | null;
    userInfo: { name: string; phone: string } | null;
}