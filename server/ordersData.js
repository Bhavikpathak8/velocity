export const initialOrders = [
    {
        id: "VEL-98421",
        user_id: "u-demo",
        customer_name: "Bhavik Pathak",
        email: "customer@velocity.com",
        status: "shipped",
        total_amount: 235.00,
        placed_at: "2026-07-20T14:30:00Z",
        shipping_address: {
            address_line1: "742 Evergreen Terrace",
            city: "San Francisco",
            state: "CA",
            postal_code: "94107",
            country: "United States"
        },
        items: [
            {
                product_id: "p1",
                name: "AeroPulse Pro X",
                price: 180.00,
                quantity: 1,
                size: "9.5",
                color: "Obsidian / Electric Blue",
                sku: "VEL-APX-001"
            },
            {
                product_id: "p9",
                name: "Aero Split Shorts",
                price: 55.00,
                quantity: 1,
                size: "M",
                color: "Electric Blue",
                sku: "VEL-ASS-009"
            }
        ]
    },
    {
        id: "VEL-97104",
        user_id: "u-demo",
        customer_name: "Bhavik Pathak",
        email: "customer@velocity.com",
        status: "delivered",
        total_amount: 180.00,
        placed_at: "2026-07-05T09:15:00Z",
        shipping_address: {
            address_line1: "742 Evergreen Terrace",
            city: "San Francisco",
            state: "CA",
            postal_code: "94107",
            country: "United States"
        },
        items: [
            {
                product_id: "p8",
                name: "Velocity Vector Duffel",
                price: 180.00,
                quantity: 1,
                size: "One Size",
                color: "Matte Black",
                sku: "VEL-VVD-008"
            }
        ]
    }
];
