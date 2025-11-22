import { Category, CheckoutData } from '../types.ts';

// --- MOCK DATA ---
const mockCatalog: Category[] = [
    {
        id: 1, name: 'Bebidas', image_url: 'https://picsum.photos/id/1060/200/200',
        subcategories: [
            {
                id: 101, name: 'Gaseosas', image_url: 'https://picsum.photos/id/312/200/200',
                products: [
                    { product_id: 1001, product_name: 'Coca-Cola 500ml', price: 150.00, unit: 'u', stock: 50, image_url: 'https://picsum.photos/id/312/200/200' },
                    { product_id: 1002, product_name: 'Sprite 500ml', price: 145.00, unit: 'u', stock: 40, image_url: 'https://picsum.photos/id/163/200/200' },
                    { product_id: 1003, product_name: 'Fanta Naranja 500ml', price: 140.00, unit: 'u', stock: 35, image_url: 'https://picsum.photos/id/490/200/200' },

                ]
            },
            {
                id: 102, name: 'Aguas', image_url: 'https://picsum.photos/id/1053/200/200',
                products: [
                    { product_id: 1004, product_name: 'Agua Mineral 500ml', price: 100.00, unit: 'u', stock: 100, image_url: 'https://picsum.photos/id/1053/200/200' },
                    { product_id: 1005, product_name: 'Agua Saborizada Manzana', price: 120.00, unit: 'u', stock: 80, image_url: 'https://picsum.photos/id/659/200/200' },
                ]
            },
            {
                id: 103, name: 'Alcohólicas', image_url: 'https://picsum.photos/id/1057/200/200',
                products: [
                    { product_id: 1006, product_name: 'Cerveza Lager 473ml', price: 220.00, unit: 'u', stock: 60, image_url: 'https://picsum.photos/id/1057/200/200' },
                    { product_id: 1007, product_name: 'Vino Malbec 750ml', price: 850.00, unit: 'u', stock: 25, image_url: 'https://picsum.photos/id/1075/200/200' },
                ]
            }
        ]
    },
    {
        id: 2, name: 'Snacks', image_url: 'https://picsum.photos/id/1080/200/200',
        subcategories: [
            {
                id: 201, name: 'Papas Fritas', image_url: 'https://picsum.photos/id/25/200/200',
                products: [
                    { product_id: 2001, product_name: 'Lays Clásicas 80g', price: 250.00, unit: 'u', stock: 30, image_url: 'https://picsum.photos/id/25/200/200' },
                    { product_id: 2002, product_name: 'Pringles Original', price: 450.00, unit: 'u', stock: 20, image_url: 'https://picsum.photos/id/292/200/200' },
                ]
            },
            {
                id: 202, name: 'Galletitas', image_url: 'https://picsum.photos/id/431/200/200',
                products: [
                    { product_id: 2003, product_name: 'Oreo 118g', price: 180.00, unit: 'u', stock: 60, image_url: 'https://picsum.photos/id/431/200/200' },
                    { product_id: 2004, product_name: 'Chocolinas 150g', price: 160.00, unit: 'u', stock: 70, image_url: 'https://picsum.photos/id/433/200/200' },
                ]
            },
            {
                id: 203, name: 'Chocolates', image_url: 'https://picsum.photos/id/355/200/200',
                products: [
                    { product_id: 2005, product_name: 'Tableta de Chocolate con Leche', price: 300.00, unit: 'u', stock: 45, image_url: 'https://picsum.photos/id/355/200/200' },
                ]
            }
        ]
    },
    {
        id: 3, name: 'Almacén', image_url: 'https://picsum.photos/id/435/200/200',
        subcategories: [
            {
                id: 301, name: 'Lácteos', image_url: 'https://picsum.photos/id/447/200/200',
                products: [
                    { product_id: 3001, product_name: 'Leche Entera 1L', price: 180.00, unit: 'u', stock: 30, image_url: 'https://picsum.photos/id/447/200/200' },
                    { product_id: 3002, product_name: 'Yogur de Frutilla 1L', price: 210.00, unit: 'u', stock: 25, image_url: 'https://picsum.photos/id/568/200/200' },
                ]
            },
            {
                id: 302, name: 'Panificados', image_url: 'https://picsum.photos/id/175/200/200',
                products: [
                    { product_id: 3003, product_name: 'Pan de Molde Blanco', price: 350.00, unit: 'u', stock: 20, image_url: 'https://picsum.photos/id/175/200/200' },
                ]
            }
        ]
    },
    {
        id: 4, name: 'Limpieza', image_url: 'https://picsum.photos/id/939/200/200',
        subcategories: [
             {
                id: 401, name: 'Hogar', image_url: 'https://picsum.photos/id/939/200/200',
                products: [
                    { product_id: 4001, product_name: 'Detergente 500ml', price: 250.00, unit: 'u', stock: 30, image_url: 'https://picsum.photos/id/939/200/200' },
                ]
            },
             {
                id: 402, name: 'Personal', image_url: 'https://picsum.photos/id/1011/200/200',
                products: [
                    { product_id: 4002, product_name: 'Jabón de Tocador', price: 120.00, unit: 'u', stock: 50, image_url: 'https://picsum.photos/id/1011/200/200' },
                ]
            }
        ]
    }
];

const mockCheckoutData: CheckoutData = {
    user_info: { name: "Juan Perez", phone: "1122334455", can_use_mixed_payment: true },
    addresses: [
        { address_corregida: "Av. Corrientes 1234", description: "Casa, puerta verde", costo_envio: 200, lat: -34.60, lng: -58.38 },
        { address_corregida: "Calle Falsa 567, Piso 3 Depto A", description: "Oficina", costo_envio: 250, lat: -34.61, lng: -58.39 },
    ],
    delivery_config: { business_address: "Av. de Mayo 888", store_coords: [-34.6083, -58.3712] },
    payment_config: { allow_cash: true }
};


// --- MOCK API FUNCTIONS ---
const delay = <T,>(data: T, ms = 500): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), ms));

export const api = {
    unifiedLogin: (codeOrPhone: string) => {
        console.log('API Dev Mode: unifiedLogin with', codeOrPhone);
        // For development, any number proceeds to WhatsApp verification.
        return delay({ status: 'needs_whatsapp_verification' });
    },
    verifyWhatsappCode: (phone: string, code: string) => {
        console.log('API Dev Mode: verifyWhatsappCode with', phone, code);
        // For development, any code is accepted and we ask for the user's name as if they are new.
        return delay({ status: 'needs_name', phone });
    },
    updateClientInfo: (phone: string, name: string) => {
        console.log('API: updateClientInfo with', phone, name);
        return delay({ status: 'success', phone, name });
    },
    fetchInitialData: (userIdentifier: string) => {
         console.log('API: fetchInitialData for', userIdentifier);
         if (userIdentifier === "new_user_no_address") {
             return delay({ status: 'success', data: { user_info: {name: 'Nuevo Usuario'}, addresses: [] } });
         }
         return delay({ status: 'success', data: { user_info: {name: 'Juan Perez'}, addresses: mockCheckoutData.addresses } });
    },
    fetchCatalog: () => delay(mockCatalog, 800),
    fetchCheckoutData: () => delay({ status: 'success', data: mockCheckoutData }, 700),
    initiateOrder: (payload: any) => {
        console.log('API: initiateOrder with payload', payload);
        const orderId = `ORDER-${Date.now()}`;
        return delay({ status: 'success', order_id: orderId }, 1000);
    },
    fetchOrderStatus: (orderId: string) => {
        console.log('API: fetchOrderStatus for', orderId);
        const statuses = ['EN_PREPARACION', 'EN_CAMINO', 'ENTREGADO'];
        const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return delay({
            status: currentStatus,
            orderType: 'delivery',
            location: { lat: -34.605 + Math.random() * 0.01, lon: -58.385 + Math.random() * 0.01 },
            payment_status: 'PAGADO',
            order_id: orderId,
            pickupCode: 'AB-123'
        }, 1200);
    },
    submitFeedback: (orderId: string, rating: number, comment: string) => {
        console.log('API: submitFeedback', {orderId, rating, comment});
        return delay({ status: 'success' });
    }
};